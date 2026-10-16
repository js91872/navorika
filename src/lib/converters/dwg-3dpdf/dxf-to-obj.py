#!/usr/bin/env python3
"""Convert supported DXF 3D mesh entities into triangulated OBJ geometry.
This intentionally rejects ACIS solids and 2D drawings rather than faking 3D."""
import sys
import math
import json
import ezdxf

def main(source, destination):
    doc = ezdxf.readfile(source)
    vertices = []
    faces = []
    unsupported = set()
    for entity in doc.modelspace():
        typ = entity.dxftype()
        polygons = []
        if typ == "3DFACE":
            points = list(entity.wcs_vertices())
            if len(points) == 4 and points[2].isclose(points[3]):
                points.pop()
            polygons = [points]
        elif typ == "MESH":
            mesh_vertices = list(entity.vertices)
            polygons = [[mesh_vertices[i] for i in face] for face in entity.faces]
        elif typ == "POLYLINE" and entity.is_poly_face_mesh:
            polygons = [[vertex.dxf.location for vertex in face] for face in entity.faces()]
        elif typ in ("3DSOLID", "BODY", "REGION", "SURFACE", "PLANESURFACE", "EXTRUDEDSURFACE", "LOFTEDSURFACE", "REVOLVEDSURFACE", "SWEPTSURFACE"):
            unsupported.add(typ)
        for poly in polygons:
            if len(poly) < 3:
                continue
            indices = []
            for v in poly:
                coords = (float(v.x), float(v.y), float(v.z))
                if not all(math.isfinite(x) and abs(x) < 1e10 for x in coords):
                    continue
                vertices.append(coords)
                indices.append(len(vertices))
            if len(indices) >= 3:
                for j in range(1, len(indices)-1):
                    faces.append((indices[0], indices[j], indices[j+1]))
            if len(faces) > 500000:
                raise ValueError("Mesh exceeds the 500,000-triangle safety limit")
    if unsupported:
        raise ValueError("Unsupported ACIS solid/surface entities: " + ", ".join(sorted(unsupported)) + ". Export as a triangulated 3D mesh (3DFACE/MESH/polyface) before uploading.")
    if not faces:
        raise ValueError("No supported 3D mesh faces detected. A flat 2D drawing cannot be converted into an interactive 3D model.")
    with open(destination, "w", encoding="utf-8") as out:
        out.write("# Navorika 3D CAD mesh\n")
        for x, y, z in vertices:
            out.write(f"v {x:.8g} {y:.8g} {z:.8g}\n")
        for a, b, c in faces:
            out.write(f"f {a} {b} {c}\n")
    xs = [v[0] for v in vertices]
    ys = [v[1] for v in vertices]
    zs = [v[2] for v in vertices]
    center = [(min(v) + max(v)) / 2 for v in (xs, ys, zs)]
    diagonal = math.sqrt(sum((max(v) - min(v)) ** 2 for v in (xs, ys, zs)))
    print(json.dumps({"center": center, "diagonal": diagonal, "triangles": len(faces)}))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Usage: dxf-to-obj.py input.dxf output.obj")
    try:
        main(sys.argv[1], sys.argv[2])
    except Exception as exc:
        sys.exit(str(exc))
