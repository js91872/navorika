import { NextResponse } from 'next/server';
import { sanitizeInput, validateEmail, sanitizeObject } from '@/lib/security';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    
    // Sanitize input
    const allowedKeys = ['email', 'message'];
    const sanitized = sanitizeObject(body, allowedKeys);
    const { email, message } = sanitized;
    
    // Validate
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required.' },
        { status: 400 }
      );
    }
    
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }
    
    // Process message (sanitized)
    const cleanMessage = sanitizeInput(message);
    const cleanEmail = sanitizeInput(email);
    
    // Log (without exposing sensitive data)
    console.log('Contact message received:', { cleanEmail, cleanMessage });
    
    return NextResponse.json(
      { success: true, message: 'Support message received successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
