import { randomInt } from "node:crypto";
import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  success: boolean;
  delivered: boolean;
  mockCode?: string;
  error?: string;
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP code.
 */
export function generateOtpCode(): string {
  const num = randomInt(100000, 999999);
  return num.toString();
}

/**
 * Send an email via Nodemailer using Gmail SMTP or configured SMTP provider.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  // biome-ignore lint/complexity/useLiteralKeys: process.env index signature for strict tsconfig
  const host = process.env["SMTP_HOST"] || "smtp.gmail.com";
  // biome-ignore lint/complexity/useLiteralKeys: process.env index signature for strict tsconfig
  const port = Number.parseInt(process.env["SMTP_PORT"] || "587", 10);
  // biome-ignore lint/complexity/useLiteralKeys: process.env index signature for strict tsconfig
  const user = process.env["SMTP_USER"] || "";
  // biome-ignore lint/complexity/useLiteralKeys: process.env index signature for strict tsconfig
  const pass = process.env["SMTP_PASS"] || "";
  // biome-ignore lint/complexity/useLiteralKeys: process.env index signature for strict tsconfig
  const from = process.env["SMTP_FROM"] || `GrumeUp Queue <${user || "noreply@grumeup.app"}>`;

  if (!pass) {
    // biome-ignore lint/suspicious/noConsole: dev email fallback logging
    console.log(
      `[DEV EMAIL MOCK] SMTP_PASS not set in .env! Email to: ${options.to}\nSubject: ${options.subject}\nBody: ${options.text}`
    );
    return { success: true, delivered: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return { success: true, delivered: true };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: SMTP failure error reporting
    console.error("❌ Gmail SMTP send error:", error);
    return {
      success: false,
      delivered: false,
      error: error instanceof Error ? error.message : "SMTP transport error",
    };
  }
}

/**
 * Send a 6-digit OTP verification email with clean monochrome GrumeUp styling.
 */
export async function sendOtpEmail(email: string, otpCode: string): Promise<SendEmailResult> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 40px 20px; }
    .container { max-width: 480px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; text-align: center; }
    .logo { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff; margin-bottom: 24px; }
    .title { font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 8px; }
    .subtitle { font-size: 14px; color: #a1a1aa; margin-bottom: 28px; line-height: 1.5; }
    .otp-box { background-color: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 18px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #ffffff; margin: 0 auto 28px auto; text-align: center; font-family: monospace; }
    .footer { font-size: 12px; color: #71717a; border-top: 1px solid #27272a; pt: 20px; margin-top: 28px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">GrumeUp</div>
    <div class="title">Verification Code</div>
    <div class="subtitle">Enter the following 6-digit verification code to complete your admin login.</div>
    <div class="otp-box">${otpCode}</div>
    <div class="subtitle">This code expires in <strong>10 minutes</strong>. Do not share this code with anyone.</div>
    <div class="footer">If you did not request this login code, please ignore this email.</div>
  </div>
</body>
</html>
  `.trim();

  const text = `GrumeUp Admin Verification Code: ${otpCode}\n\nThis code expires in 10 minutes.`;

  const result = await sendEmail({
    to: email,
    subject: `Your GrumeUp Verification Code [${otpCode}]`,
    html,
    text,
  });

  if (!result.delivered && result.success) {
    result.mockCode = otpCode;
  }

  return result;
}
