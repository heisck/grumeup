import { describe, expect, it } from "vitest";
import { generateSessionToken, hashPassword, verifyPassword } from "./auth-crypto";

describe("auth-crypto utilities", () => {
  it("should hash and verify passwords correctly", () => {
    const password = "myAdminPassword123";
    const hash = hashPassword(password);

    expect(hash).toContain(":");
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("wrongPassword", hash)).toBe(false);
  });

  it("should generate random session tokens", () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toEqual(token2);
  });
});
