import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import EmailTemplate from '@/components/EmailTemplate';
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { msg, from, to, subject, type } = json;

  const { data, error } = await resend.emails.send({
    to,
    subject,
    from: 'isaac.bell@thesoapstone.net',
    react: EmailTemplate(type, json),
  });

  if (error) {
    return new NextResponse(`Error: ${error}`, { status: 400 });
  }

  console.log('sent mail', { to, type, subject, data });
  return NextResponse.json({ message: data?.id ?? 'success'}, { status: 200 });
};
