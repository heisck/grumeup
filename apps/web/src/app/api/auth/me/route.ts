import { cache } from "@grumeup/cache";
import { findAdminByEmail } from "@grumeup/database";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("grumeup_admin_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Attempt cache retrieval first
    try {
      const cachedAdmin = await cache.get<{
        id: string;
        name: string;
        email: string;
        role: string;
      }>(`session:${token}`);
      if (cachedAdmin) {
        return NextResponse.json({ authenticated: true, admin: cachedAdmin });
      }
    } catch {
      // Fallback if Redis offline
    }

    // Fallback to checking initial admin in env or database
    const initialEmail = process.env["INITIAL_ADMIN_EMAIL"] ?? "admin@grumeup.com";
    const admin = await findAdminByEmail(initialEmail);

    if (admin) {
      const { passwordHash: _, ...adminInfo } = admin;
      return NextResponse.json({ authenticated: true, admin: adminInfo });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("grumeup_admin_session")?.value;

    if (token) {
      try {
        await cache.del(`session:${token}`);
      } catch {
        // Cache delete cleanup
      }
    }

    cookieStore.delete("grumeup_admin_session");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
