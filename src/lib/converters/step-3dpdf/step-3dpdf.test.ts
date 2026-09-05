import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import {
  assertStepUpload,
  assertValidPdfOutput,
  extensionOf,
  safeOutputStem,
  StepConversionError,
  STEP_MAX_UPLOAD_BYTES,
} from './validation';
import { getStepCapabilities, getStepToObjBinaryPath, getAsymptoteBinaryPath } from './capabilities';
import { withCadJob, getActiveCadJobs } from './job-manager';
import { convertStepTo3dPdf } from './conversion-pipeline';

test('extensionOf handles lowercase and uppercase CAD extensions', () => {
  assert.equal(extensionOf('part.step'), 'step');
  assert.equal(extensionOf('assembly.stp'), 'stp');
  assert.equal(extensionOf('MODEL.STEP'), 'step');
  assert.equal(extensionOf('DRAWING.STP'), 'stp');
  assert.equal(extensionOf('complex.name.v2.step'), 'step');
  assert.equal(extensionOf('no-ext'), '');
});

test('safeOutputStem sanitizes special characters and spaces', () => {
  assert.equal(safeOutputStem('Pump Manifold v3.step'), 'Pump-Manifold-v3');
  assert.equal(safeOutputStem('bracket@rev#4!.stp'), 'bracket-rev-4');
  assert.equal(safeOutputStem('../../../etc/passwd.step'), 'passwd');
  assert.equal(safeOutputStem(''), 'cad-model');
});

test('assertStepUpload rejects empty or oversized files', () => {
  assert.throws(
    () => assertStepUpload({ name: 'test.step', size: 0, type: '' }, new Uint8Array(0)),
    (err) => err instanceof StepConversionError && err.status === 400
  );

  assert.throws(
    () =>
      assertStepUpload(
        { name: 'test.step', size: STEP_MAX_UPLOAD_BYTES + 1, type: '' },
        new Uint8Array(STEP_MAX_UPLOAD_BYTES + 1)
      ),
    (err) => err instanceof StepConversionError && err.status === 413
  );
});

test('assertStepUpload rejects unsupported extensions', () => {
  const dummyStep = new TextEncoder().encode('ISO-10303-21;\nHEADER;\nENDSEC;\nDATA;\nENDSEC;\nEND-ISO-10303-21;\n');

  assert.throws(
    () => assertStepUpload({ name: 'model.dwg', size: dummyStep.length, type: '' }, dummyStep),
    (err) => err instanceof StepConversionError && err.message.includes('extension')
  );

  assert.throws(
    () => assertStepUpload({ name: 'model.obj', size: dummyStep.length, type: '' }, dummyStep),
    (err) => err instanceof StepConversionError && err.message.includes('extension')
  );

  assert.throws(
    () => assertStepUpload({ name: 'model.pdf', size: dummyStep.length, type: '' }, dummyStep),
    (err) => err instanceof StepConversionError && err.message.includes('extension')
  );
});

test('assertStepUpload rejects fake renamed files without ISO-10303-21 header', () => {
  const fakeContent = new TextEncoder().encode('This is just a text file renamed to step\n');

  assert.throws(
    () => assertStepUpload({ name: 'fake.step', size: fakeContent.length, type: '' }, fakeContent),
    (err) => err instanceof StepConversionError && err.message.includes('ISO 10303-21')
  );
});

test('assertStepUpload rejects STEP file missing HEADER section', () => {
  const missingHeader = new TextEncoder().encode('ISO-10303-21;\nDATA;\nENDSEC;\nEND-ISO-10303-21;\n');

  assert.throws(
    () => assertStepUpload({ name: 'no-header.step', size: missingHeader.length, type: '' }, missingHeader),
    (err) => err instanceof StepConversionError && err.message.includes('HEADER')
  );
});

test('assertStepUpload accepts valid STEP with optional UTF-8 BOM', () => {
  const validWithBom = new Uint8Array([
    0xef, 0xbb, 0xbf, // UTF-8 BOM
    ...new TextEncoder().encode('ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION((\'STEP AP214\'),\'1\');\nENDSEC;\nDATA;\nENDSEC;\nEND-ISO-10303-21;\n'),
  ]);

  assert.doesNotThrow(() => {
    assertStepUpload({ name: 'valid.step', size: validWithBom.length, type: '' }, validWithBom);
    assertStepUpload({ name: 'valid.STP', size: validWithBom.length, type: '' }, validWithBom);
  });
});

test('assertValidPdfOutput validates PDF signature and 3D structures', () => {
  const invalidShort = new Uint8Array([1, 2, 3]);
  assert.throws(
    () => assertValidPdfOutput(invalidShort),
    /corrupted|small/
  );

  const notPdf = new TextEncoder().encode('This is not a PDF file at all, but it is long enough to pass the length check.');
  assert.throws(
    () => assertValidPdfOutput(notPdf),
    /valid PDF/
  );

  const pdfWithout3D = new TextEncoder().encode('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n%%EOF\n');
  assert.throws(
    () => assertValidPdfOutput(pdfWithout3D),
    /3D/
  );

  const pdfWith3D = new TextEncoder().encode('%PDF-1.4\n1 0 obj\n<< /Subtype /3D >>\nendobj\n%%EOF\n% extra padding bytes for test\n');
  assert.doesNotThrow(() => assertValidPdfOutput(pdfWith3D));
});

test('job-manager tracks concurrency and cleans up temporary directories', async () => {
  assert.equal(getActiveCadJobs(), 0);

  let capturedDir = '';
  await withCadJob(async (dir) => {
    capturedDir = dir;
    assert.equal(getActiveCadJobs(), 1);
    const s = await stat(dir);
    assert.ok(s.isDirectory());
  });

  assert.equal(getActiveCadJobs(), 0);
  const existsAfter = await stat(capturedDir).catch(() => null);
  assert.equal(existsAfter, null, 'Temporary directory should be deleted after job completion');
});

test('capabilities detection detects native engine and asymptote', async () => {
  const caps = await getStepCapabilities();
  const nativeBin = await getStepToObjBinaryPath();
  const asyBin = await getAsymptoteBinaryPath();

  assert.ok(nativeBin !== null, 'step-to-obj binary should be discoverable in bin/ or native/build/');
  assert.ok(asyBin !== null, 'asy binary should be discoverable in system PATH');
  assert.equal(caps.nativeEngine, true);
  assert.equal(caps.asymptote, true);
  assert.equal(caps.available, true);
  assert.equal(caps.maxUploadBytes, STEP_MAX_UPLOAD_BYTES);
});

test('end-to-end conversion of Pump Manifold v3.step to 3D PDF', async () => {
  const stepPath = join(process.cwd(), 'prototypes', 'step-3dpdf', 'Pump Manifold v3.step');
  const stepBytes = await readFile(stepPath);

  assertStepUpload({ name: 'Pump Manifold v3.step', size: stepBytes.length, type: '' }, stepBytes);

  const result = await withCadJob(async (directory) => {
    return await convertStepTo3dPdf({
      inputPath: stepPath,
      originalName: 'Pump Manifold v3.step',
      directory,
    });
  });

  // Verify geometry statistics
  assert.equal(result.metadata.solids, 1);
  assert.equal(result.metadata.faces, 118);
  assert.equal(result.metadata.edges, 668);
  assert.equal(result.metadata.vertices, 1336);
  assert.equal(result.metadata.meshedFaces, 118);
  assert.equal(result.metadata.meshNodes, 4174);
  assert.equal(result.metadata.triangles, 4372);

  // Bounding dimensions check (~114.734 x 114.734 x 83.619)
  const [dx, dy, dz] = result.metadata.bbox.dimensions;
  assert.ok(Math.abs(dx - 114.734) < 0.1, `X dimension ${dx} should match ~114.734`);
  assert.ok(Math.abs(dy - 114.734) < 0.1, `Y dimension ${dy} should match ~114.734`);
  assert.ok(Math.abs(dz - 83.619) < 0.1, `Z dimension ${dz} should match ~83.619`);

  // Verify output filename
  assert.equal(result.fileName, 'Pump-Manifold-v3-3d.pdf');

  // Verify PDF properties
  assert.ok(result.pdfBytes.length > 50_000, `PDF size should be substantial (got ${result.pdfBytes.length} bytes)`);

  const pdfString = new TextDecoder('latin1').decode(result.pdfBytes);
  assert.ok(pdfString.startsWith('%PDF-'), 'Output should have valid %PDF- header');
  assert.ok(
    pdfString.includes('/Subtype/3D') || pdfString.includes('/Subtype /3D') || pdfString.includes('/Subtype/RichMedia'),
    'Output must contain 3D / RichMedia structures'
  );
});
