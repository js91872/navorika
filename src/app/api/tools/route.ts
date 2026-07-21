import { NextResponse } from 'next/server';
import { getAllTools } from '@/lib/toolRegistry';

export async function GET() {
  try {
    const tools = getAllTools();
    const slugs = tools.map(t => t.slug);
    
    return NextResponse.json({
      total: tools.length,
      slugs: slugs,
      productivityTools: tools.filter(t => t.category === 'productivity').map(t => t.slug)
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
