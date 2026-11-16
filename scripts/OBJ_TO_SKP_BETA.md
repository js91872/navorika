# OBJ to SKP — private beta deployment gate

This branch is an **unreleased** proof of deployment. It creates a page at `/tools/obj-to-skp-converter` and an isolated POST API at `/api/obj-to-skp` that is **disabled by default** (`OBJ_TO_SKP_ENABLED` unset). The page is noindexed until enabled. It has a registry entry for architecture validation, but the staged tool is explicitly excluded from site directories and sitemaps through toolsUnderReview until rollout.

## Production prerequisites (do not enable until verified)
- Validate GitHub Quality workflow, OBJ to SKP beta workflow, and independent desktop SketchUp testing.
- Install Python 3.11+ into a dedicated venv: `python3 -m venv /opt/navorika-obj-skp-venv && /opt/navorika-obj-skp-venv/bin/pip install openskp==1.5.0`.
- Ensure production deploy includes `scripts/obj-to-skp-server.py`.
- Stage `OBJ_TO_SKP_PYTHON=/opt/navorika-obj-skp-venv/bin/python`, `OBJ_TO_SKP_ENABLED=true` **only after** verifying input/output end-to-end. A Next.js rebuild is needed for page metadata indexability.
- Limit Nginx request body size to 32 MB and enforce server CPU/memory limits for untrusted CAD content.
- Deploy on a staging instance first. Production is not changed by this PR.

## Current restrictions
- 20 MB max OBJ, 30 MB total, 8 MB per companion, 12 companions.
- No ZIP; plain matching filenames for MTL/PNG/JPG/JPEG required.
- Supported source model scale: 1 OBJ unit = 1 mm, 1 cm, 1 inch, or 1 metre.
- Native legacy SKP output; textures/UVs supported for simple convex polygons; no advanced PBR/complex meshes.
- Temporary server-side processing (not private browser-only processing); per-request temporary folders deleted on completion.
- Child process is bounded to 30 seconds, one concurrent per app instance, and rate limited. For a public rollout, add OS-enforced memory/CPU quotas, improved request-body streaming limits, abuse protection and observability.
- A readback by OpenSKP does not substitute for independent SketchUp desktop testing.

## Beta verification
Run GitHub Actions `OBJ to SKP beta validation`, download SKP artifacts, check geometry/scale/textures in SketchUp, then test the disabled API GET and enabled POST on staging. Do not merge without the release gate review.
