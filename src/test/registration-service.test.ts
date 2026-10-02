import { describe, expect, it, vi } from "vitest";
import { registerAccount } from "../services/registrationService";

describe("registrationService", () => {
  it("registers an account with the expected payload", async () => {
    const payload = {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      gender: "female",
      phone: "+1234567890",
      department: "Engineering",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    } as const;

    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 201 }));

    await expect(registerAccount(payload)).resolves.toBeUndefined();
  });
});
