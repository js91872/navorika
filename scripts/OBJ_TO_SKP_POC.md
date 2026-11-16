# OBJ to SKP isolated PoC — Phase 2

This is **not deployed** and does not add a public Navorika tool. PR #112 builds legacy SKP files using the MIT-licensed OpenSKP writer. Do not merge until desktop SketchUp opens both artifacts successfully.

## Run

```bash
python -m pip install 'openskp==1.5.0'
python scripts/poc_obj_to_skp.py model.obj output.skp --unit-mm 1000
```

The `--unit-mm` switch sets the size in millimeters of one OBJ coordinate unit. OBJ itself has no units.

## Current functionality and automated validation

- OBJ vertices, normals ignored, faces, negative vertex and texture-coordinate indices.
- MTL diffuse colors and simple `map_Kd` texture references.
- PNG/JPEG textures accepted (magic-byte checked) and attached via `add_texture_material`.
- Per-corner `vt` texture UVs placed through `front_uv`.
- Textured polygons are triangulated as a fan; convex triangles/quads only for the proof.
- GitHub Actions exports a plain cube and a textured quad, re-parses their native SKP geometry, and checks positioned UVs and embedded textured materials.
- SKP workflow artifacts include both sample files when successful.

## Limits and safety

Only same-directory filenames are allowed for OBJ companions. MTL 2 MB, texture 8 MB, OBJ 20 MB, and 250,000 vertices/UVs/faces maximum. No ZIP extraction, no network references, no public upload endpoint. Do not process untrusted uploads outside an isolated environment.

Unsupported: MTL option flags/paths with spaces, images other than PNG/JPEG, UDIM, transparency maps, PBR, smoothing/group fidelity, complex concave polygons, mesh repair, and output to modern (2021+) native SKP format.

## Desktop acceptance gates — still mandatory

1. Download `obj-to-skp-cube-poc` from the latest successful GitHub Actions run.
2. Open `cube.skp` and `textured.skp` in SketchUp desktop.
3. Confirm 6 visible cube faces, correct scale, two textured triangles, proper UV orientation, material embedded and usable after moving the SKP away from its source texture.
4. Check compatibility with the intended version of SketchUp. If any check fails, keep PR draft and record the mismatch.

A passing OpenSKP self-readback test demonstrates serialization/readability by that library, **not** independent SketchUp desktop compatibility.
