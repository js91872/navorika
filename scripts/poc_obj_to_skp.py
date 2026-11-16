#!/usr/bin/env python3
"""Isolated OBJ -> real SKP proof of concept. Not a production API.

Install: python -m pip install 'openskp==1.5.0'
Run: python scripts/poc_obj_to_skp.py input.obj output.skp --unit-mm 1000
The OBJ format has no intrinsic unit. --unit-mm is millimeters per OBJ unit.
Supports vertices, polygon faces, negative indices and MTL diffuse colors.
UV textures, mesh repair, smoothing, groups, and full materials are NOT preserved.
"""
import argparse
import json
import math
from pathlib import Path


def parse_obj(path: Path, max_bytes: int = 20_000_000):
    if path.stat().st_size > max_bytes:
        raise ValueError("OBJ exceeds the 20 MB PoC limit")
    vertices, faces, material = [], [], None
    mtl_names = []
    for line_number, raw in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        parts = raw.strip().split()
        if not parts or parts[0].startswith("#"):
            continue
        tag, values = parts[0], parts[1:]
        if tag == "v":
            if len(values) < 3:
                raise ValueError(f"Line {line_number}: vertex needs x y z")
            vertex = tuple(float(v) for v in values[:3])
            if not all(math.isfinite(v) for v in vertex):
                raise ValueError(f"Line {line_number}: nonfinite vertex")
            vertices.append(vertex)
            if len(vertices) > 250_000:
                raise ValueError("Too many vertices")
        elif tag == "mtllib":
            mtl_names.extend(values)
        elif tag == "usemtl":
            material = " ".join(values)
        elif tag == "f":
            if len(values) < 3:
                raise ValueError(f"Line {line_number}: face needs three vertices")
            corners = []
            for token in values:
                raw_index = token.split("/")[0]
                if not raw_index:
                    raise ValueError(f"Line {line_number}: empty vertex index")
                index = int(raw_index)
                resolved = index - 1 if index > 0 else len(vertices) + index
                if index == 0 or not (0 <= resolved < len(vertices)):
                    raise ValueError(f"Line {line_number}: invalid vertex index {index}")
                corners.append(resolved)
            faces.append((corners, material))
            if len(faces) > 250_000:
                raise ValueError("Too many faces")
    if not vertices or not faces:
        raise ValueError("OBJ has no convertible vertices/faces")
    return vertices, faces, mtl_names


def parse_mtl(obj_path: Path, file_names):
    colors, current, textures = {}, None, []
    for name in file_names:
        # Only local companion files, never paths outside the OBJ directory.
        if Path(name).name != name:
            continue
        path = obj_path.parent / name
        if not path.is_file() or path.stat().st_size > 2_000_000:
            continue
        for raw in path.read_text(encoding="utf-8-sig", errors="replace").splitlines():
            parts = raw.split()
            if not parts or parts[0].startswith("#"):
                continue
            if parts[0] == "newmtl":
                current = " ".join(parts[1:])
            elif parts[0] == "Kd" and current and len(parts) >= 4:
                rgb = [float(x) for x in parts[1:4]]
                if all(math.isfinite(x) and 0 <= x <= 1 for x in rgb):
                    colors[current] = tuple(round(x * 255) for x in rgb)
            elif parts[0] == "map_Kd":
                textures.append(raw.strip())
    return colors, textures


def convert(obj_path: Path, skp_path: Path, unit_mm: float = 1000.0):
    from openskp import create

    if not math.isfinite(unit_mm) or unit_mm <= 0:
        raise ValueError("--unit-mm must be a positive finite number")
    vertices, faces, mtl_names = parse_obj(obj_path)
    colors, textures = parse_mtl(obj_path, mtl_names)
    builder = create()
    materials = {name: builder.add_material(name, color) for name, color in colors.items()}
    converted = 0
    skipped = 0
    for corner_ids, material_name in faces:
        pts = [tuple(coord * unit_mm for coord in vertices[i]) for i in corner_ids]
        if len(set(pts)) < 3:
            skipped += 1
            continue
        kwargs = {"auto_triangulate": True}
        if material_name in materials:
            kwargs["material"] = materials[material_name]
        try:
            builder.add_face(pts, **kwargs)
            converted += 1
        except (ValueError, RuntimeError):
            # Keep failure explicit rather than silently dropping geometry.
            raise ValueError(f"Unable to convert source face {converted + skipped + 1}") from None
    if not converted:
        raise ValueError("No valid faces were converted")
    skp_path.parent.mkdir(parents=True, exist_ok=True)
    builder.save(str(skp_path))
    if not skp_path.is_file() or skp_path.stat().st_size < 100:
        raise RuntimeError("SKP writer did not produce a usable file")
    result = {
        "status": "written_unverified_in_sketchup",
        "vertices": len(vertices), "source_faces": len(faces),
        "converted_faces": converted, "skipped_degenerate_faces": skipped,
        "unit_mm": unit_mm, "materials_with_diffuse_color": len(materials),
        "textures_preserved": False,
        "warnings": (["MTL map_Kd textures are NOT preserved in this PoC"] if textures else []),
        "output": str(skp_path),
        "bytes": skp_path.stat().st_size,
    }
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--unit-mm", type=float, default=1000.0)
    args = parser.parse_args()
    print(json.dumps(convert(args.input, args.output, args.unit_mm), indent=2))


if __name__ == "__main__":
    main()
