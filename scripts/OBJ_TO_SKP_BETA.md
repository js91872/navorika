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
- Child process is bounded to 30 seconds, one concurrent per app instance, and rate limited. Python now applies Linux POSIX RLIMIT_CPU=25s, RLIMIT_AS=2 GiB, RLIMIT_FSIZE=65 MiB and RLIMIT_NOFILE=128. Uploads require Content-Length and reject more than 32,000,000 bytes. Enforce Nginx client_max_body_size 32m as a separate defense. For a public rollout, consider OS sandboxing (unprivileged user, filesystem isolation), abuse protection and observability.
- A readback by OpenSKP does not substitute for independent SketchUp desktop testing.

## Beta verification
Run GitHub Actions `OBJ to SKP beta validation`, download SKP artifacts, check geometry/scale/textures in SketchUp, then test the disabled API GET and enabled POST on staging. Do not merge without the release gate review.

## Safe VPS preflight (read-only: does not deploy or modify Nginx/PM2)

Run after the PR is reviewed; this checks only existing software/state:

```bash
cd /var/www/navorika
git status --short
git branch --show-current
df -h /
command -v python3
command -v nginx
pm2 status navorika
nginx -T 2>/dev/null | grep -E 'client_max_body_size|server_name navorika.com' | head -20
test ! -e /opt/navorika-obj-skp-venv/bin/python || /opt/navorika-obj-skp-venv/bin/python -c 'import openskp; print("OpenSKP available")'
```

## Staging sequence (must NOT share production PM2 port or production env)

1. Use a separate git worktree and private local-only port. Do not run the existing production deployment script on a feature branch: it requires the reviewed `main` commit and restarts production.
2. Install the Python venv and OpenSKP only on the staging host / isolated environment. Keep `OBJ_TO_SKP_ENABLED=false` on production.
3. Set `OBJ_TO_SKP_ENABLED=true` and `OBJ_TO_SKP_PYTHON` only for the staging Next.js process. Protect the staging port; never publish to public Nginx without authentication and upload limits.
4. Verify `GET /api/obj-to-skp` advertises `enabled:true`. Use `curl --form 'obj=@sample.obj' --form 'unitMm=1000' --output sample.skp http://127.0.0.1:STAGING_PORT/api/obj-to-skp`. Add `--form 'companions=@sample.mtl' --form 'companions=@texture.png'` for textured models.
5. Open the downloaded SKPs with SketchUp desktop and confirm scale, faces, textures. Test missing MTL, unsupported texture, files over limits, malformed OBJ, concurrent requests, and cleanup of temporary `navorika-objskp-*` directories.
6. Check server memory, CPU, disk and Nginx request limits before any public enablement. Do not enable production until staging results are accepted.

## Known gap
A standalone Next.js deploy may not package the external Python script automatically. The existing Navorika `scripts/deploy-vps.sh` is a production release script, not a staging launcher. Use an isolated worktree for staging and confirm the script path exists there. Do not guess at a production runtime location.
