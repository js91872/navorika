# OBJ to SKP PoC — isolated, not deployed

The proof of concept uses the MIT-licensed OpenSKP 1.5.0 writer to produce a **real, legacy-format SketchUp SKP** file. It is a developer test, NOT a Navorika public tool.

## Run

```bash
python -m pip install 'openskp==1.5.0'
python scripts/poc_obj_to_skp.py /path/to/model.obj /tmp/model.skp --unit-mm 1000
```

OBJ has no standardized units: 1000 means **1 OBJ coordinate unit = 1000 mm** (one meter). Use 1 for millimeter-based OBJ files.

## Acceptance gates

1. GitHub Actions conversion test passes, producing a nontrivial SKP artifact.
2. Independently parse artifact using OpenSKP and confirm face geometry.
3. **Manual:** download the artifact from the workflow run and open it in SketchUp desktop. Check editable faces, scale, materials, file compatibility. This step cannot be claimed complete by CI.
4. Next: textured OBJ/MTL/PNG/ZIP handling and UV mapping, mesh diagnostics and limits, browser/server decision, and security/licensing review.

## Known limitations

- Diffuse MTL color only; texture images and UVs are not preserved.
- Geometry only; no groups/objects, smoothing, camera or object transforms.
- Input cap 20 MB and 250,000 vertices/faces; no archive handling.
- Uses legacy SKP file writer; test desktop-version interoperability.
- Not integrated into Next.js and does not add a route or change any existing tool.
- There is no assertion of commercial readiness or full SketchUp compatibility.
