import { describe, expect, it, vi } from "vitest";
import {
  getCurrentUser,
  login,
  requestPasswordReset,
  resetPassword,
  validatePasswordResetToken,
  verifyEmail,
} from "../services/authService";

describe("authService", () => {
  it("logs in with valid response data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ email: "user@example.com", jwtToken: "jwt-token" }), {
        status: 200,
      }),
    );

    await expect(login("user@example.com", "password123")).resolves.toEqual({
      email: "user@example.com",
      jwtToken: "jwt-token",
    });
  });

  it("rejects malformed login responses and empty payloads", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ email: "user@example.com" }), { status: 200 }),
    );

    await expect(login("user@example.com", "password")).rejects.toThrow(
      "The login response was missing required data",
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
    await expect(login("user@example.com", "password")).rejects.toThrow(
      "The login response was empty",
    );
  });

  it("normalizes a valid current user and rejects invalid roles/statuses", async () => {
    const valid = {
      data: {
        id: "user-1",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
        gender: "female",
        phone: "+1234567890",
        department: "Engineering",
        status: "active",
        role: "ADMIN",
        createdAt: "2024-06-01T00:00:00Z",
        isVerified: true,
      },
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(valid), { status: 200 }),
    );

    await expect(getCurrentUser("token")).resolves.toMatchObject({
      id: "user-1",
      name: "Jane Doe",
      role: "ADMIN",
      status: "active",
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: "user-2",
          email: "no-wrapper@example.com",
          firstName: "No",
          lastName: "Wrapper",
          gender: "male",
          phone: "+1234567890",
          department: "Finance",
          status: "inactive",
          role: "USER",
          createdAt: "2024-02-02T00:00:00Z",
          isVerified: false,
        }),
        { status: 200 },
      ),
    );
    await expect(getCurrentUser("token")).resolves.toMatchObject({ name: "No Wrapper" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { ...valid.data, role: "GUEST" } }), { status: 200 }),
    );
    await expect(getCurrentUser("token")).rejects.toThrow("Unsupported user role");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { ...valid.data, status: "pending" } }), { status: 200 }),
    );
    await expect(getCurrentUser("token")).rejects.toThrow("Unsupported account status");

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { id: "user-2", email: "bad" } }), { status: 200 }),
    );
    await expect(getCurrentUser("token")).rejects.toThrow(
      "The current-user response was missing required data",
    );
  });

  it("returns message payloads for reset and email flows", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Email sent" }), { status: 200 }),
    );
    await expect(requestPasswordReset("user@example.com")).resolves.toEqual({ message: "Email sent" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Token valid" }), { status: 200 }),
    );
    await expect(validatePasswordResetToken("token-1")).resolves.toEqual({ message: "Token valid" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Password was reset" }), { status: 200 }),
    );
    await expect(resetPassword("token-1", "password123", "password123")).resolves.toEqual({ message: "Password was reset" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Email verified" }), { status: 200 }),
    );
    await expect(verifyEmail("token-1")).resolves.toEqual({ message: "Email verified" });
  });

  it("rejects responses that do not include a message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    await expect(requestPasswordReset("user@example.com")).rejects.toThrow(
      "The forgot-password response was missing a message",
    );
  });
});
