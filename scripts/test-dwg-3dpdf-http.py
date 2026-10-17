#!/usr/bin/env python3
"""HTTP integration smoke test for running local DWG/DXF conversion server."""
from io import BytesIO
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import json
import os
import uuid
import ezdxf
from pypdf import PdfReader

BASE = os.environ.get("CAD_TEST_BASE", "http://127.0.0.1:3117")

def request(method, route, body=None, content_type=None):
    headers = {}
    if content_type:
        headers["Content-Type"] = content_type
    req = Request(BASE + route, data=body, method=method, headers=headers)
    try:
        with urlopen(req, timeout=90) as response:
            return response.status, response.read(), dict(response.headers)
    except HTTPError as exc:
        return exc.code, exc.read(), dict(exc.headers)

def upload(name, blob):
    boundary = "NavorikaTest" + uuid.uuid4().hex
    envelope = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{name}\"\r\n"
        "Content-Type: application/octet-stream\r\n\r\n"
    ).encode() + blob + f"\r\n--{boundary}--\r\n".encode()
    return request("POST", "/api/dwg-to-3d-pdf", envelope, f"multipart/form-data; boundary={boundary}")

def main():
    status, body, _ = request("GET", "/api/dwg-to-3d-pdf")
    assert status == 200, (status, body[:500])
    capabilities = json.loads(body)
    assert capabilities["available"] is True, capabilities
    doc = ezdxf.new("R2013")
    msp = doc.modelspace()
    tetra = [(0,0,0),(10,0,0),(0,10,0),(0,0,10)]
    for indices in ((0,1,2),(0,1,3),(0,2,3),(1,2,3)):
        msp.add_3dface([tetra[i] for i in indices])
    from io import StringIO
    stream = StringIO()
    doc.write(stream)
    status, pdf, hdr = upload("sample-3d.dxf", stream.getvalue().encode("utf-8"))
    assert status == 200, (status, pdf[:1000].decode(errors="replace"))
    assert pdf.startswith(b"%PDF"), "Expected PDF document"
    assert hdr.get("Content-Type", "").startswith("application/pdf"), hdr
    reader = PdfReader(BytesIO(pdf))
    found = []
    for page in reader.pages:
        for ref in page.get("/Annots", []):
            annot = ref.get_object()
            if str(annot.get("/Subtype")) != "/RichMedia":
                continue
            names = annot["/RichMediaContent"].get_object()["/Assets"].get_object()["/Names"]
            for i in range(0,len(names),2):
                if str(names[i]).lower().endswith(".prc"):
                    spec = names[i+1].get_object()
                    found.append(spec["/EF"].get_object()["/F"].get_object().get_data())
    assert any(data.startswith(b"PRC") and len(data) > 100 for data in found), "No embedded PRC model"
    print(f"PASS: HTTP uploaded DXF -> PDF ({len(pdf)} bytes) with PRC asset")

    status, body, _ = upload("invalid.txt", b"not a drawing")
    assert status == 400, (status, body[:300])
    print("PASS: rejects unsupported filename extension")

    status, body, _ = upload("empty.dxf", b"")
    assert status == 400, (status, body[:300])
    print("PASS: rejects empty file")

    status, body, _ = upload("fake.dwg", b"invalid")
    assert status == 503, (status, body[:300])
    print("PASS: reports missing DWG importer instead of generating a fake output")

if __name__ == "__main__":
    main()
