import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const key =
      process.env.WEB3FORMS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
      '9dc75efb-08f7-4751-bcf9-12815c3cb113';

    if (!key) {
      return NextResponse.json(
        { error: 'Email service is not configured yet. Please add WEB3FORMS_KEY.' },
        { status: 500 }
      );
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: key,
        name,
        email,
        message,
        from_name: `${name} (Cozy Home Porch)`,
        subject: `New Postcard from ${name}! 💌`,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      return NextResponse.json(
        { error: data.message || 'Web3Forms failed to deliver email.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
