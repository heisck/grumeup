import { z } from "zod";

/**
 * Environment variable validation using Zod.
 *
 * This module validates all environment variables at build time
 * and runtime, ensuring the app fails fast with clear error
 * messages if any required variable is missing or malformed.
 */

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // Redis
  REDIS_URL: z.string().url("REDIS_URL must be a valid URL"),

  // Authentication
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  AUTH_SECRET: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

/**
 * Validated server-side environment variables.
 * Only accessible in Server Components, Route Handlers, and Server Actions.
 */
export const serverEnv = (): z.infer<typeof serverEnvSchema> => {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    // biome-ignore lint/suspicious/noConsole: environment validation error reporting
    console.error("❌ Invalid server environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
};

/**
 * Validated client-side environment variables.
 * These are prefixed with NEXT_PUBLIC_ and exposed to the browser.
 */
export const clientEnv = (): z.infer<typeof clientEnvSchema> => {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
  });

  if (!parsed.success) {
    // biome-ignore lint/suspicious/noConsole: environment validation error reporting
    console.error("❌ Invalid client environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
};
