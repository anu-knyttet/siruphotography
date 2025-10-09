import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY!);
const recaptchaSecretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY!;

async function verifyRecaptcha(token: string) {
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${recaptchaSecretKey}&response=${token}`,
  });
  const data = await res.json();
  return data;
}

export async function POST(req: NextRequest) {
  const { name, email, message, token } = await req.json();

  // Verify reCAPTCHA before sending email
  const captchaResult = await verifyRecaptcha(token);
  if (!captchaResult.success || (typeof captchaResult.score === "number" && captchaResult.score < 0.5)) {
    console.error("reCAPTCHA failed:", captchaResult);
    return NextResponse.json({ success: false, error: "Captcha failed", details: captchaResult }, { status: 400 });
  }

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "anuvette.dev@gmail.com",
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  return NextResponse.json({ success: true });
}
