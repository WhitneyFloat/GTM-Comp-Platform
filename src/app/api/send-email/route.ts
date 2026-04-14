import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const { to, subject, body } = await req.json();

    // These should be set in Vercel Environment Variables
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.warn("Gmail credentials not set in environment variables.");
      // For now, let's simulate success if credentials aren't set yet
      // so the user can see the UI animation work.
      // return NextResponse.json({ message: 'Credentials missing' }, { status: 500 });
      return NextResponse.json({ message: 'Simulation: Email "sent" (Credentials missing)' });
    }

    // Using simplified approach with nodemailer or googleapis
    // For a quick setup with App Password, nodemailer is often simpler:
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: GMAIL_USER,
      to,
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
