import { hashPassword, verifyPassword } from "@grumeup/utils";
import type { Admin, Session } from "@prisma/client";
import { prisma } from "./index";

export interface InitialAdminConfig {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Ensure the initial admin account sourced from .env is created in the database.
 */
export async function ensureInitialAdminExists(config?: InitialAdminConfig): Promise<Admin | null> {
  const email = config?.email ?? process.env["INITIAL_ADMIN_EMAIL"] ?? "admin@grumeup.com";
  const password =
    config?.password ?? process.env["INITIAL_ADMIN_PASSWORD"] ?? "admin_secure_password_123";
  const name = config?.name ?? process.env["INITIAL_ADMIN_NAME"] ?? "Admin";

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return existingAdmin;
    }

    const passwordHash = hashPassword(password);
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });

    return newAdmin;
  } catch (error) {
    // Database fallback/offline safety for dev mode when DB isn't migrated yet
    // biome-ignore lint/suspicious/noConsole: database seed logging
    console.warn("⚠️ Database check/seed warning:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Find an admin user by email address.
 */
export async function findAdminByEmail(email: string): Promise<Admin | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const initialAdminEmail = (process.env["INITIAL_ADMIN_EMAIL"] ?? "admin@grumeup.com")
    .trim()
    .toLowerCase();

  try {
    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (admin) {
      return admin;
    }
  } catch {
    // If DB is offline or table uninitialized, fallback to checking initial admin in env
  }

  // Fallback check for initial admin in env
  if (normalizedEmail === initialAdminEmail) {
    const initialAdminName = process.env["INITIAL_ADMIN_NAME"] ?? "Admin";
    const initialAdminPassword =
      process.env["INITIAL_ADMIN_PASSWORD"] ?? "admin_secure_password_123";

    return {
      id: "initial-admin-id",
      name: initialAdminName,
      email: initialAdminEmail,
      phone: null,
      passwordHash: hashPassword(initialAdminPassword),
      role: "SUPER_ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return null;
}

/**
 * Verify admin email and password.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; admin?: Omit<Admin, "passwordHash"> }> {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    return { success: false };
  }

  const isValid = verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return { success: false };
  }

  const { passwordHash: _, ...adminWithoutPassword } = admin;
  return {
    success: true,
    admin: adminWithoutPassword,
  };
}

/**
 * Create an admin session record in PostgreSQL database.
 */
export async function createAdminSession(
  adminId: string,
  token: string,
  expiresAt: Date
): Promise<Session | null> {
  try {
    if (adminId === "initial-admin-id") {
      const persistedAdmin = await ensureInitialAdminExists();
      if (persistedAdmin) {
        return await prisma.session.create({
          data: {
            adminId: persistedAdmin.id,
            token,
            expiresAt,
          },
        });
      }
    }

    return await prisma.session.create({
      data: {
        adminId,
        token,
        expiresAt,
      },
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: session creation fallback log
    console.warn("⚠️ Session creation notice:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Find active admin session by token.
 */
export async function getAdminSession(token: string) {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const { passwordHash: _, ...adminWithoutPassword } = session.admin;
    return {
      session,
      admin: adminWithoutPassword,
    };
  } catch {
    return null;
  }
}

/**
 * Delete admin session by token (logout).
 */
export async function deleteAdminSession(token: string): Promise<boolean> {
  try {
    await prisma.session.delete({
      where: { token },
    });
    return true;
  } catch {
    return false;
  }
}
