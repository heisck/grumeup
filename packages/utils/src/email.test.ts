import { describe, expect, it } from "vitest";
import { generateOtpCode, sendOtpEmail } from "./email";

describe("Email Utilities", () => {
  it("should generate a 6-digit numeric OTP code", () => {
    const code = generateOtpCode();
    expect(code).toMatch(/^\d{6}$/);
    expect(code.length).toBe(6);
  });

  it("should format and process sendOtpEmail in development mode", async () => {
    const result = await sendOtpEmail("test@example.com", "123456");
    expect(result.success).toBe(true);
    expect(result.mockCode).toBe("123456");
  });
});
