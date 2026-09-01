import { getCorelCapabilities } from '@/lib/converters/coreldraw/capabilities';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await getCorelCapabilities(), { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' } });
}
