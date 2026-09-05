import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { convertStepTo3dPdf } from '@/lib/converters/step-3dpdf/conversion-pipeline';
import { withCadJob } from '@/lib/converters/step-3dpdf/job-manager';
import { assertStepUpload, extensionOf, StepConversionError } from '@/lib/converters/step-3dpdf/validation';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!rateLimit(`cad-convert:${ip}`, 5, 60_000).success) {
    return NextResponse.json(
      { error: 'Too many CAD conversion requests. Please wait one minute and try again.' },
      {
        status: 429,
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
      }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      throw new StepConversionError('Please select a STEP CAD file to convert.');
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    assertStepUpload(file, bytes);

    const ext = extensionOf(file.name) || 'step';

    const result = await withCadJob(async (directory) => {
      const inputPath = join(directory, `input.${ext}`);
      await writeFile(inputPath, bytes);

      return await convertStepTo3dPdf({
        inputPath,
        originalName: file.name,
        directory,
      });
    });

    const responseBytes = new Uint8Array(result.pdfBytes);

    return new Response(responseBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${result.fileName}"`,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'X-CAD-Solids': String(result.metadata.solids),
        'X-CAD-Faces': String(result.metadata.faces),
        'X-CAD-Triangles': String(result.metadata.triangles),
      },
    });
  } catch (error) {
    const known = error instanceof StepConversionError;
    return NextResponse.json(
      {
        error: known
          ? error.message
          : 'CAD conversion failed safely. Please verify that your STEP file is valid and try again.',
      },
      {
        status: known ? error.status : 500,
        headers: {
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    );
  }
}
