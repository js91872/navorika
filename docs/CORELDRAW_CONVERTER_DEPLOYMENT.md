# CorelDRAW/CDR converter deployment

Navorika detects conversion binaries at runtime. Missing optional binaries disable the affected controls; the application must not claim that an unavailable conversion succeeded.

## Supported backend roles

| Package/binary | Role |
| --- | --- |
| LibreOffice (`libreoffice`) | DOC/DOCX/SVG to PDF and CDR import through the installed libcdr filter |
| Poppler (`pdftocairo`) | First-page PDF to SVG, PNG, and JPG |
| Poppler (`pdftops`) | First-page PDF to EPS |
| Ghostscript (`gs`) | PostScript AI/EPS to PDF under `-dSAFER` |

There is no native CDR-writing dependency. `cdrWrite` must remain `false` until a separately licensed and verified provider implements the `CdrWriterProvider` contract.

## Debian/Ubuntu installation

Run these commands manually during VPS provisioning, not from the application:

```bash
sudo apt-get update
sudo apt-get install --no-install-recommends libreoffice-core libreoffice-writer libreoffice-draw poppler-utils ghostscript fonts-dejavu-core fonts-liberation
```

On distributions where the CorelDRAW import filter is packaged separately, verify that LibreOffice Draw includes `com.sun.star.comp.Draw.CDRImportFilter`. The capability endpoint checks `/usr/lib/libreoffice/share/registry/draw.xcd` and disables CDR reading if the filter is absent.

Optional language fonts must be selected and licensed for the deployment. For example, install suitable Unicode Gurmukhi, Devanagari, and Arabic fonts when those documents are expected. Font installation improves substitution coverage but cannot guarantee the same metrics as a user’s original font.

## Verification

```bash
libreoffice --headless --version
pdftocairo -v
pdftops -v
gs --version
npm run test:coreldraw
```

The test suite skips the real DOCX→PDF integration test when LibreOffice is unavailable; unit security tests remain binary-independent.

## Runtime and reverse-proxy limits

- Keep request-body limits at or slightly above the application’s 15 MB maximum.
- Permit at least 30 seconds for conversion responses, but do not remove the application timeout.
- Run with a non-root service account.
- Do not share the temporary directory with a publicly served directory.
- Keep the service’s outbound network access restricted where practical.
- Use process/container resource limits appropriate to the VPS. The application allows two concurrent conversions per Node process and ten requests per IP per minute.
- In a multi-instance deployment, replace the in-memory limiter with a shared rate/concurrency store before increasing capacity.

## Privacy and cleanup

Each request creates a random directory under the operating-system temporary directory. Input and output files use generated names and are deleted recursively in a `finally` block after the response bytes are read. API responses use `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow, noarchive`.

## Production acceptance checks

Test representative DOC, DOCX, PDF, SVG, EPS, PDF-compatible AI, and several known CDR versions. Compare page size, page count, fonts, images, transparency, gradients, clipping, tables, and complex-script text against trusted source renders. Open every output in the intended CorelDRAW version before enabling a capability in production.
