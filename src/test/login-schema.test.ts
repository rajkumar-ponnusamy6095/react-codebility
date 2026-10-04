import { describe, expect, it } from "vitest";
import { loginSchema } from "../features/auth/pages/Login/login.schema";

describe("loginSchema", () => {
  it("accepts valid credentials and trims input", () => {
    expect(
      loginSchema.parse({ email: " user@example.com ", password: "password123" }),
    ).toEqual({ email: "user@example.com", password: "password123" });
  });

  it("rejects empty or malformed credentials", () => {
    expect(() => loginSchema.parse({ email: "", password: "" })).toThrow();
    expect(() => loginSchema.parse({ email: "invalid", password: "12345" })).toThrow();
    expect(() => loginSchema.parse({ email: "test@example.com", password: "123" })).toThrow();
  });
});
