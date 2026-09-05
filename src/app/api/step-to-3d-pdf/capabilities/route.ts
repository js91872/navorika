import { getStepCapabilities } from '@/lib/converters/step-3dpdf/capabilities';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const capabilities = await getStepCapabilities();
  return Response.json(capabilities, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });
}
