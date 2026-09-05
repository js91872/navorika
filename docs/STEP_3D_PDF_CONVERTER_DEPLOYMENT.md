# Navorika STEP to 3D PDF Converter: Deployment & Production Guide

This guide documents the system dependencies, native compilation, permissions, runtime configuration, and verification steps for deploying the **STEP to 3D PDF Converter** (`/tools/step-to-3d-pdf-converter`) on an Ubuntu/Debian production host (e.g. Ubuntu Noble 24.04 LTS or Linux Mint 22).

---

## 1. System Requirements & Architecture

The conversion pipeline converts STEP/STP (ISO 10303-21) CAD models into PDF documents containing embedded interactive 3D PRC / RichMedia objects:

$$\text{STEP / STP} \xrightarrow{\text{Open CASCADE 7.6}} \text{Triangulated OBJ + BBox JSON} \xrightarrow{\text{Asymptote 2.87 (PRC)}} \text{3D PDF (/Subtype/3D)}$$

### Core Toolchain
- **Open CASCADE Technology (OCCT) 7.6**: Direct C++ B-Rep import, topological analysis, and deflection-based incremental tessellation.
- **Asymptote 2.87**: Compiles 3D OBJ geometry into Product Representation Compact (PRC) streams and invokes TeX/Ghostscript to generate PDF 1.4 documents with RichMedia annotations.
- **TeX Live & Ghostscript 10**: Underpins Asymptote's vector and PRC document assembly (`pdflatex`, `media9`, `ocgx2`).

---

## 2. Required Host Packages (Ubuntu 24.04 / Debian)

Install the required build tools, Open CASCADE development headers, Asymptote, and TeX Live packages:

```bash
sudo apt-get update && sudo apt-get install -y \
  build-essential \
  cmake \
  g++ \
  libocct-data-exchange-dev \
  libocct-modeling-algorithms-dev \
  libocct-modeling-data-dev \
  libocct-foundation-dev \
  libocct-visualization-dev \
  libocct-ocaf-dev \
  asymptote \
  ghostscript \
  texlive-latex-base \
  texlive-latex-recommended \
  texlive-latex-extra \
  texlive-pstricks
```

---

## 3. Native Engine Compilation (`step-to-obj`)

The native Open CASCADE executable source is maintained in Git under:
`src/lib/converters/step-3dpdf/native/`

To compile and install the production binary:

```bash
# Using the automated build script:
npm run build:step-to-obj

# Or manually using CMake:
cmake -S src/lib/converters/step-3dpdf/native -B src/lib/converters/step-3dpdf/native/build -DCMAKE_BUILD_TYPE=Release
cmake --build src/lib/converters/step-3dpdf/native/build --config Release -j$(nproc)
mkdir -p bin
cp src/lib/converters/step-3dpdf/native/build/step-to-obj bin/step-to-obj
chmod +x bin/step-to-obj
```

### Production Binary Location & Resolution
The server-side capability and execution layer searches for `step-to-obj` in the following order:
1. `STEP_TO_OBJ_PATH` environment variable (if specified)
2. `<project-root>/bin/step-to-obj`
3. `<project-root>/src/lib/converters/step-3dpdf/native/build/step-to-obj`
4. `/usr/local/bin/step-to-obj`
5. `/usr/bin/step-to-obj`

Ensure the user running the Next.js process has execute permissions (`chmod +x bin/step-to-obj`).

---

## 4. Headless Server & Execution Safety

### Headless Rendering Guarantee (`settings.render=0;`)
- The production server is headless (no X11 server or GPU display).
- Asymptote's `settings.render=2;` calls OpenGL/freeglut to render offscreen 2D raster posters, which fails with `failed to open display ''` in a headless environment.
- The pipeline defaults to `settings.render=0;`, generating the 3D PRC streams directly via LaTeX/dvips/media9 without any display server dependency. No `xvfb` is required for V1.

### Isolated Temporary Sandboxing & Guaranteed Cleanup
- Each conversion executes within a unique temporary directory created via `mkdtemp(join(tmpdir(), 'navorika-cad-'))`.
- Uploaded CAD files, intermediate `.obj`, `.asy`, LaTeX logs, and output `.pdf` files are kept strictly within this sandbox.
- Cleanup is performed in a `finally` block:
  ```ts
  await rm(directory, { recursive: true, force: true });
  ```

### Process Isolation & Security
- All subprocesses (`step-to-obj`, `asy`) are executed with `shell: false`.
- User input is never interpolated into shell commands.
- Subprocesses are strictly terminated with `SIGKILL` if execution exceeds 60 seconds.
- Internal filesystem paths and raw stack traces are never leaked in HTTP responses.

### Concurrency Semaphore
- By default, `MAX_CONCURRENT_CAD_JOBS = 2`.
- To reduce host CPU/memory load, configure `MAX_CONCURRENT_CAD_JOBS=1` in the production environment if complex assemblies require substantial RAM.

---

## 5. Environment Variables

Add to `.env.production.local` or PM2 process configuration if custom paths are needed:

```bash
# Maximum concurrent conversions (default: 2)
MAX_CONCURRENT_CAD_JOBS=2

# Optional custom binary paths (if not using standard locations):
# STEP_TO_OBJ_PATH=/home/node/navorika/bin/step-to-obj
# ASY_PATH=/usr/bin/asy
# PDFLATEX_PATH=/usr/bin/pdflatex
# GHOSTSCRIPT_PATH=/usr/bin/gs
```

---

## 6. PM2 Process Considerations

When running under PM2:
- Ensure the PM2 process has write permissions to `/tmp` (standard Linux permissions).
- Ensure `PATH` in the PM2 ecosystem configuration includes `/usr/bin:/usr/local/bin`.
- Recommended memory restart threshold for the Next.js process: `max_memory_restart: 1G`.

---

## 7. Capability & Healthcheck Verification

### Verification via Endpoint
Probe the capabilities endpoint:
```bash
curl -s http://localhost:3000/api/step-to-3d-pdf/capabilities | jq .
```

Expected JSON response:
```json
{
  "available": true,
  "nativeEngine": true,
  "asymptote": true,
  "latex": true,
  "ghostscript": true,
  "maxUploadBytes": 26214400
}
```

### Manual CLI Smoke Test
Test the pipeline directly on the host using the test model:
```bash
# 1. Test native OCCT conversion
./bin/step-to-obj "prototypes/step-3dpdf/Pump Manifold v3.step" /tmp/test.obj

# 2. Test Asymptote headless PDF generation
asy -f pdf -render=0 prototypes/step-3dpdf/manifold3d.asy -o /tmp/smoke-test.pdf

# 3. Verify embedded 3D structures
grep -a -E "(Subtype/3D|Subtype /3D|RichMedia|\.prc)" /tmp/smoke-test.pdf

# 4. Clean up
rm -f /tmp/test.obj /tmp/smoke-test.pdf
```

---

## 8. Client-Side Viewer Compatibility Note

Interactive 3D manipulation (orbit, pan, zoom, model hierarchy) requires **Adobe Acrobat Reader desktop** (Windows / macOS) or another PRC-compliant 3D PDF viewer. Standard web browser PDF viewers (Chrome PDF Viewer, Firefox PDF.js, Edge, Safari) do not run the Adobe 3D JavaScript engine and will only display a preview frame.
