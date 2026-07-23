import { cache } from "@grumeup/cache";
import { verifyAdminCredentials } from "@grumeup/database";
import { generateOtpCode, sendOtpEmail } from "@grumeup/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export interface CachedOtpData {
  code: string;
  attempts: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parseResult = sendOtpSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = parseResult.data;
    const verifyResult = await verifyAdminCredentials(email, password);

    if (!verifyResult.success) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    const otpCode = generateOtpCode();
    const cacheKey = `otp:${email.toLowerCase()}`;
    const otpPayload: CachedOtpData = { code: otpCode, attempts: 0 };

    // Store in Redis with 10-minute (600s) TTL
    await cache.set(cacheKey, otpPayload, 600);

    // Send 6-digit OTP code via Gmail SMTP
    await sendOtpEmail(email, otpCode);

    return NextResponse.json({
      success: true,
      message: `A 6-digit code has been sent to ${email}`,
      expiresInSeconds: 600,
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: handler error logging
    console.error("[send-otp handler error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while sending verification code." },
      { status: 500 }
    );
  }
}
