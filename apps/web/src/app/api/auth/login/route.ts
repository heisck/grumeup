import { cache } from "@grumeup/cache";
import { verifyAdminCredentials } from "@grumeup/database";
import { generateSessionToken } from "@grumeup/utils";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials input format" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const authResult = await verifyAdminCredentials(email, password);

    if (!authResult.success || !authResult.admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const admin = authResult.admin;
    const sessionToken = generateSessionToken();
    const ttlSeconds = 60 * 60 * 24 * 7; // 7 days session

    // Cache admin session in Redis
    try {
      await cache.set(`session:${sessionToken}`, admin, ttlSeconds);
    } catch {
      // Redis optional cache fallback
    }

    // Set secure HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set("grumeup_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      maxAge: ttlSeconds,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred during admin login" },
      { status: 500 }
    );
  }
}
