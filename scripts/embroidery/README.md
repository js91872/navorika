# Embroidery converter engine (not yet a public web tool)

A backend proof-of-concept for stitch-file conversion, using `pyembroidery`.

## Setup and use

```bash
python3 -m venv .venv-embroidery
.venv-embroidery/bin/pip install pyembroidery==1.5.1
.venv-embroidery/bin/python scripts/embroidery/convert.py design.pes converted.dst
```

This does **not** digitize JPG/PNG/SVG artwork. Output can lose machine-specific metadata, colors, and commands; always inspect and test on the target machine.

## Production integration required

- Add a dedicated Next.js tool page and SEO metadata/guide through the repository's validated tool registry.
- Provide a sandboxed worker endpoint, per-request temporary directory, file-size and CPU/time limits, concurrency control and cleanup.
- Verify all supported file pairs using real fixtures, including malformed and adversarial inputs.
- Never accept arbitrary filesystem paths from web users. Never expose the CLI directly to HTTP.
- Add privacy notice reflecting server-side processing; do not claim browser-local conversion.
- Run architecture, i18n, typecheck, and deployment tests before merging.

This PR intentionally does not change existing URLs, dependencies, or production routes.
