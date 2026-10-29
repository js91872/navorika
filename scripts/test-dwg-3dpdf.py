#!/usr/bin/env python3
"""Self-contained DXF mesh -> OBJ -> interactive PRC PDF acceptance test."""
import hashlib
import json
import os
import shutil
from pathlib import Path
import subprocess
import tempfile

import ezdxf
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
CONVERTER = ROOT / "src/lib/converters/dwg-3dpdf/dxf-to-obj.py"

def embedded_prc(pdf):
    result = []
    reader = PdfReader(str(pdf), strict=False)
    for page in reader.pages:
        for ref in page.get("/Annots", []):
            annotation = ref.get_object()
            if str(annotation.get("/Subtype")) != "/RichMedia":
                continue
            content = annotation["/RichMediaContent"].get_object()
            assets = content["/Assets"].get_object()["/Names"]
            for i in range(0, len(assets), 2):
                name = str(assets[i])
                if name.lower().endswith(".prc"):
                    spec = assets[i + 1].get_object()
                    data = spec["/EF"].get_object()["/F"].get_object().get_data()
                    result.append({"name": name, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(), "signature": data[:3]})
    return result

def build_obj(directory, scale, basename):
    doc = ezdxf.new("R2013")
    msp = doc.modelspace()
    a = (0, 0, 0)
    b = (scale, 0, 0)
    c = (0, scale, 0)
    d = (0, 0, scale)
    for face in ((a,b,c), (a,b,d), (a,c,d), (b,c,d)):
        msp.add_3dface(face)
    input_file = directory / f"{basename}.dxf"
    obj_file = directory / f"{basename}.obj"
    doc.saveas(str(input_file))
    run = subprocess.run(["python3", str(CONVERTER), str(input_file), str(obj_file)], capture_output=True, text=True, check=True)
    meta = json.loads(run.stdout)
    data = obj_file.read_text()
    assert "g navorika_model" in data, "OBJ missing named group"
    assert data.count("\nf ") == 4, "Unexpected face count"
    assert meta["triangles"] == 4, meta
    return obj_file, meta

def render(directory, obj_file, basename, metadata):
    x, y, z = metadata["center"]
    d = max(metadata["diagonal"], 1)
    scene = directory / (basename + ".asy")
    scene.write_text(f'''settings.outformat="pdf";
settings.prc=true;
settings.render=0;
import three;
import obj;
size(500);
currentprojection=perspective(camera=({x+1.25*d},{y+1.25*d},{z+0.95*d}),up=Z,target=({x},{y},{z}));
obj model=obj("{obj_file.name}",true,lightgray);
draw(model);
''')
    completed = subprocess.run(["asy", "-f", "pdf", "-render=0", scene.name], cwd=directory, capture_output=True, text=True)
    if completed.returncode:
        raise RuntimeError(f"Asymptote failed ({completed.returncode}):\\nSTDOUT:\\n{completed.stdout}\\nSTDERR:\\n{completed.stderr}")
    assert "Number of groups: 1" in (completed.stdout + completed.stderr), completed.stdout + completed.stderr
    return directory / (basename + ".pdf")

def main():
    with tempfile.TemporaryDirectory(prefix="navorika-cad-ci-") as td:
        directory = Path(td)
        outputs = []
        for scale in (10, 40):
            name = f"tetra-{scale}"
            obj_file, metadata = build_obj(directory, scale, name)
            pdf = render(directory, obj_file, name, metadata)
            if os.environ.get("CAD_PDF_ARTIFACT_DIR"):
                target = Path(os.environ["CAD_PDF_ARTIFACT_DIR"])
                target.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(pdf, target / pdf.name)
            assets = embedded_prc(pdf)
            assert assets, f"No PRC attachment in {pdf}"
            assert all(a["signature"] == b"PRC" for a in assets), "Invalid PRC signature"
            outputs.append({"model": name, "pdf_bytes": pdf.stat().st_size, "prc_assets": [{k: v for k, v in a.items() if k != "signature"} for a in assets]})
        print(json.dumps(outputs, indent=2))
        checksums = [item["prc_assets"][0]["sha256"] for item in outputs]
        if checksums[0] == checksums[1]:
            raise AssertionError("DIAGNOSTIC FAILURE: Two geometrically different CAD meshes produce byte-identical PRC streams. Model output may be empty or geometry-independent.")
        print("PRC differs with source mesh geometry; manual viewer confirmation still required.")

if __name__ == "__main__":
    main()
