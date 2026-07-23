import { cache } from "@grumeup/cache";
import { createAdminSession, findAdminByEmail } from "@grumeup/database";
import { generateSessionToken } from "@grumeup/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { CachedOtpData } from "../send-otp/route";

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parseResult = verifyOtpSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Invalid code format";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, code } = parseResult.data;
    const normalizedEmail = email.toLowerCase();
    const cacheKey = `otp:${normalizedEmail}`;

    const cachedOtp = await cache.get<CachedOtpData>(cacheKey);

    if (!cachedOtp) {
      return NextResponse.json(
        { error: "Verification code has expired or was not requested. Please click 'Send Again'." },
        { status: 400 }
      );
    }

    if (cachedOtp.attempts >= 5) {
      await cache.del(cacheKey);
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new verification code." },
        { status: 429 }
      );
    }

    if (cachedOtp.code !== code) {
      cachedOtp.attempts += 1;
      await cache.set(cacheKey, cachedOtp, 600);
      return NextResponse.json(
        { error: "Incorrect verification code. Please check your email and try again." },
        { status: 400 }
      );
    }

    const admin = await findAdminByEmail(normalizedEmail);

    if (!admin) {
      return NextResponse.json({ error: "Admin account not found." }, { status: 404 });
    }

    // OTP verified successfully -> clear cache key
    await cache.del(cacheKey);

    // Create session token and DB session record
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await createAdminSession(admin.id, token, expiresAt);

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("grumeup_admin_session", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: handler error logging
    console.error("[verify-otp handler error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during verification." },
      { status: 500 }
    );
  }
}
