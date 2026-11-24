#!/usr/bin/env python3
"""Isolated OBJ/MTL to genuine SKP PoC. NOT a production API.

pip install openskp==1.5.0
python scripts/poc_obj_to_skp.py input.obj output.skp --unit-mm 1000

Supports OBJ polygon geometry, per-corner vt, diffuse-color MTL,
local PNG/JPEG map_Kd textures with UV pinning. No ZIP input, smoothing,
groups, alpha maps, complex PBR material properties or mesh repair.
Textured polygons triangulate as a simple fan: concave/ngon fidelity is
not guaranteed. OBJ dimensions are unspecified; choose unit-mm explicitly.
"""
import argparse
import json
import math
from pathlib import Path

# POSIX resource caps limit untrusted conversion subprocesses independently of
# Node/PM2. These limits apply before the OpenSKP/numpy imports in convert().
def _apply_resource_limits():
    import resource
    resource.setrlimit(resource.RLIMIT_CPU, (25, 25))
    resource.setrlimit(resource.RLIMIT_AS, (2 * 1024**3, 2 * 1024**3))
    resource.setrlimit(resource.RLIMIT_FSIZE, (65 * 1024**2, 65 * 1024**2))
    resource.setrlimit(resource.RLIMIT_NOFILE, (128, 128))



def _obj_index(raw: str, count: int, line_number: int, label: str) -> int:
    number = int(raw)
    index = number - 1 if number > 0 else count + number
    if number == 0 or index < 0 or index >= count:
        raise ValueError(f"Line {line_number}: invalid {label} index {number}")
    return index


def parse_obj(path: Path, max_bytes: int = 20_000_000):
    if path.stat().st_size > max_bytes:
        raise ValueError("OBJ exceeds the 20 MB PoC limit")
    vertices, uvs, faces, material, mtl_names = [], [], [], None, []
    for line_number, raw in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        parts = raw.strip().split()
        if not parts or parts[0].startswith("#"):
            continue
        tag, values = parts[0], parts[1:]
        if tag == "v":
            if len(values) < 3:
                raise ValueError(f"Line {line_number}: vertex needs x y z")
            point = tuple(float(v) for v in values[:3])
            if not all(map(math.isfinite, point)):
                raise ValueError(f"Line {line_number}: nonfinite vertex")
            vertices.append(point)
            if len(vertices) > 250_000:
                raise ValueError("Too many vertices")
        elif tag == "vt":
            if len(values) < 2:
                raise ValueError(f"Line {line_number}: vt needs u v")
            uv = (float(values[0]), float(values[1]))
            if not all(map(math.isfinite, uv)):
                raise ValueError(f"Line {line_number}: nonfinite UV")
            uvs.append(uv)
            if len(uvs) > 250_000:
                raise ValueError("Too many UV coordinates")
        elif tag == "mtllib":
            mtl_names.extend(values)
        elif tag == "usemtl":
            material = " ".join(values)
        elif tag == "f":
            if len(values) < 3:
                raise ValueError(f"Line {line_number}: face needs three vertices")
            corners = []
            for token in values:
                bits = token.split("/")
                if not bits[0]:
                    raise ValueError(f"Line {line_number}: missing vertex index")
                vertex_id = _obj_index(bits[0], len(vertices), line_number, "vertex")
                uv_id = (_obj_index(bits[1], len(uvs), line_number, "UV")
                         if len(bits) > 1 and bits[1] else None)
                corners.append((vertex_id, uv_id))
            faces.append((corners, material))
            if len(faces) > 250_000:
                raise ValueError("Too many faces")
    if not vertices or not faces:
        raise ValueError("OBJ has no convertible vertices/faces")
    return vertices, uvs, faces, mtl_names


def _safe_local(base: Path, name: str) -> Path:
    # No path traversal, URLs, absolute paths, or outside-directory references.
    candidate = Path(name)
    if name in ("", ".", "..") or candidate.name != name or candidate.is_absolute() or "\\" in name:
        raise ValueError(f"Unsafe companion-file path: {name}")
    return base / name


def parse_mtl(obj_path: Path, names):
    materials = {}
    for name in names:
        path = _safe_local(obj_path.parent, name)
        if not path.is_file():
            raise ValueError(f"MTL not found: {name}")
        if path.stat().st_size > 2_000_000:
            raise ValueError("MTL exceeds the 2 MB limit")
        current = None
        for raw in path.read_text(encoding="utf-8-sig", errors="replace").splitlines():
            parts = raw.strip().split()
            if not parts or parts[0].startswith("#"):
                continue
            tag, values = parts[0], parts[1:]
            if tag == "newmtl":
                current = " ".join(values)
                materials.setdefault(current, {})
            elif tag == "Kd" and current and len(values) >= 3:
                rgb = tuple(float(x) for x in values[:3])
                if not all(math.isfinite(x) and 0 <= x <= 1 for x in rgb):
                    raise ValueError(f"Invalid MTL diffuse color for {current}")
                materials[current]["color"] = tuple(round(x * 255) for x in rgb)
            elif tag == "map_Kd" and current:
                # PoC supports plain texture paths, not MTL option flags.
                if len(values) != 1:
                    raise ValueError(f"map_Kd options/spaces unsupported for {current}")
                materials[current]["texture"] = _safe_local(obj_path.parent, values[0])
    return materials


def _validated_texture(path: Path) -> Path:
    if not path.is_file():
        raise ValueError(f"Texture not found: {path.name}")
    if path.stat().st_size > 8_000_000:
        raise ValueError(f"Texture exceeds 8 MB: {path.name}")
    with path.open("rb") as stream:
        magic = stream.read(8)
    if not (magic.startswith(b"\x89PNG\r\n\x1a\n") or
            magic.startswith(b"\xff\xd8\xff")):
        raise ValueError(f"Only PNG/JPEG texture images are supported: {path.name}")
    return path


def _triangles(corners):
    # Triangle fan: sufficient for planar convex quads/simple test geometry;
    # unsupported concave polygons need a proper triangulation algorithm.
    if len(corners) == 3:
        yield corners
    else:
        for n in range(1, len(corners) - 1):
            yield [corners[0], corners[n], corners[n + 1]]


def convert(obj_path: Path, skp_path: Path, unit_mm: float = 1000.0):
    from openskp import create

    if not math.isfinite(unit_mm) or unit_mm <= 0:
        raise ValueError("--unit-mm must be a positive finite number")
    vertices, uvs, faces, mtl_names = parse_obj(obj_path)
    definitions = parse_mtl(obj_path, mtl_names)
    builder = create()
    materials = {}
    for name, definition in definitions.items():
        if "texture" in definition:
            image = _validated_texture(definition["texture"])
            materials[name] = builder.add_texture_material(name, str(image))
        else:
            materials[name] = builder.add_material(name, definition.get("color", (200, 200, 200)))
    converted, output_faces, skipped, textured_faces = 0, 0, 0, 0
    for face_index, (corners, name) in enumerate(faces, 1):
        if name and name not in materials:
            raise ValueError(f"Undefined material {name!r} on face {face_index}")
        textured = bool(name and "texture" in definitions[name])
        if textured and any(uv_id is None for _, uv_id in corners):
            raise ValueError(f"Textured face {face_index} missing UV coordinates")
        # Textured ngons use individually UV-mapped triangles. Keep plain
        # planar polygons intact (like the original Phase-1 proof).
        polygons = list(_triangles(corners)) if textured else [corners]
        for polygon in polygons:
            pts = [tuple(coord * unit_mm for coord in vertices[v]) for v, _ in polygon]
            if len(set(pts)) < 3:
                skipped += 1
                continue
            kwargs = {"auto_triangulate": not textured}
            if name in materials:
                kwargs["material"] = materials[name]
            if textured:
                kwargs["front_uv"] = [(point, uvs[corner[1]])
                                      for point, corner in zip(pts[:3], polygon[:3])]
            try:
                builder.add_face(pts, **kwargs)
            except (ValueError, RuntimeError) as error:
                raise ValueError(f"Unable to convert source face {face_index}: {error}") from error
            output_faces += 1
            if textured:
                textured_faces += 1
        converted += 1
    if output_faces == 0:
        raise ValueError("No valid faces were converted")
    skp_path.parent.mkdir(parents=True, exist_ok=True)
    builder.save(str(skp_path))
    if not skp_path.is_file() or skp_path.stat().st_size < 100:
        raise RuntimeError("SKP writer did not produce a usable file")
    return {
        "status": "written_unverified_in_sketchup",
        "vertices": len(vertices), "source_faces": len(faces),
        "converted_source_faces": converted, "output_faces": output_faces,
        "textured_output_faces": textured_faces,
        "skipped_degenerate_polygons": skipped, "unit_mm": unit_mm,
        "materials": len(materials),
        "textures_submitted_to_skp_writer": sum("texture" in d for d in definitions.values()),
        "warnings": ["Desktop SketchUp texture/UV validation is still required",
                     "Textured concave polygons are not guaranteed to triangulate correctly"],
        "output": str(skp_path), "bytes": skp_path.stat().st_size,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--unit-mm", type=float, default=1000.0)
    args = parser.parse_args()
    print(json.dumps(convert(args.input, args.output, args.unit_mm), indent=2))


if __name__ == "__main__":
    _apply_resource_limits()
    main()
