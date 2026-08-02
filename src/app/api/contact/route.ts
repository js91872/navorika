import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, message } = body;

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required.' }, { status: 400 });
    }

    // Here you can integrate your email service provider (e.g., SendGrid, Nodemailer, etc.)
    // For now, we successfully acknowledge the transmission.
    return NextResponse.json({ success: true, message: 'Support message received successfully.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
