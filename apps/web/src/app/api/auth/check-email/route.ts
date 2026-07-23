import { findAdminByEmail } from "@grumeup/database";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const checkEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    const { email } = parsed.data;
    const admin = await findAdminByEmail(email);

    // Return boolean existence check without leaking sensitive user details
    if (admin) {
      return NextResponse.json({
        exists: true,
        isAdmin: true,
      });
    }

    return NextResponse.json({
      exists: false,
      isAdmin: false,
    });
  } catch {
    return NextResponse.json(
      { error: "An error occurred while verifying email address" },
      { status: 500 }
    );
  }
}
