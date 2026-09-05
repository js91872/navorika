import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getAsymptoteBinaryPath, getStepToObjBinaryPath } from './capabilities';
import { runProcess } from './process';
import type { CadGeometryMetadata, StepConversionResult } from './types';
import { assertValidPdfOutput, safeOutputStem, StepConversionError } from './validation';

export interface ConvertStepOptions {
  inputPath: string;
  originalName: string;
  directory: string;
}

export async function convertStepTo3dPdf(
  options: ConvertStepOptions
): Promise<StepConversionResult> {
  const { inputPath, originalName, directory } = options;

  const stepToObjBin = await getStepToObjBinaryPath();
  if (!stepToObjBin) {
    throw new StepConversionError(
      'The native Open CASCADE conversion engine is not configured on this server.',
      503
    );
  }

  const asyBin = await getAsymptoteBinaryPath();
  if (!asyBin) {
    throw new StepConversionError(
      'The Asymptote 3D vector compiler is not configured on this server.',
      503
    );
  }

  const objPath = join(directory, 'model.obj');
  const asyPath = join(directory, 'scene.asy');
  const pdfPath = join(directory, 'scene.pdf');

  // Step 1: Execute native Open CASCADE B-Rep import and mesher
  const { stdout } = await runProcess(stepToObjBin, [inputPath, objPath], directory);

  let metadata: CadGeometryMetadata;
  try {
    const jsonStart = stdout.indexOf('{');
    const jsonEnd = stdout.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON output from step-to-obj');
    }
    const raw = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1));
    if (!raw.success || !raw.bbox) {
      throw new Error('Invalid metadata format');
    }
    metadata = raw as CadGeometryMetadata;
  } catch {
    throw new StepConversionError(
      'CAD conversion failed: unable to extract geometry metadata from the STEP file.',
      422
    );
  }

  // Step 2: Verify intermediate OBJ exists and has non-zero size
  const objStat = await stat(objPath).catch(() => null);
  if (!objStat || objStat.size === 0) {
    throw new StepConversionError(
      'CAD tessellation did not generate valid intermediate polygon geometry.',
      422
    );
  }

  // Step 3: Compute dynamic camera target and position based on bounding box
  const [cx, cy, cz] = metadata.bbox.center;
  const diag = Math.max(metadata.bbox.diagonal, 1.0);

  // Isometric-style perspective view centered on target
  const cameraX = cx + 1.25 * diag;
  const cameraY = cy + 1.25 * diag;
  const cameraZ = cz + 0.95 * diag;

  // Step 4: Write Asymptote scene file (settings.render=0 for safe headless PDF generation)
  const asyContent = `settings.outformat="pdf";
settings.prc=true;
settings.render=0;

import three;
import obj;

size(500);

currentprojection=perspective(
    camera=(${cameraX.toFixed(4)}, ${cameraY.toFixed(4)}, ${cameraZ.toFixed(4)}),
    up=Z,
    target=(${cx.toFixed(4)}, ${cy.toFixed(4)}, ${cz.toFixed(4)})
);

obj model = obj("model.obj", true, lightgray);
draw(model);
`;

  await writeFile(asyPath, asyContent, 'utf8');

  // Step 5: Execute Asymptote to generate PDF with embedded 3D PRC / RichMedia
  await runProcess(asyBin, ['-f', 'pdf', '-render=0', 'scene.asy'], directory);

  // Step 6: Verify and load generated PDF
  const pdfStat = await stat(pdfPath).catch(() => null);
  if (!pdfStat || pdfStat.size === 0) {
    throw new StepConversionError(
      'The 3D PDF compiler completed without producing an output document.',
      500
    );
  }

  const pdfBytes = await readFile(pdfPath);
  assertValidPdfOutput(pdfBytes);

  const safeStem = safeOutputStem(originalName);
  const fileName = `${safeStem}-3d.pdf`;

  return {
    pdfPath,
    pdfBytes,
    fileName,
    metadata,
  };
}
