import { describe, expect, it, vi } from "vitest";
import { apiRequest } from "../services/api";

describe("apiRequest", () => {
  it("uses localStorage token and JSON success response", async () => {
    localStorage.setItem("token", "secret-token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200, statusText: "OK" }),
    );

    const result = await apiRequest<{ ok: boolean }>("/v1/test", { token: undefined });

    expect(result).toEqual({ ok: true });
    const requestConfig = fetchMock.mock.calls[0][1] as RequestInit;
    expect((requestConfig.headers as Headers).get("Authorization")).toBe("Bearer secret-token");
  });

  it("adds JSON content type with custom request headers and accepts explicit token", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await apiRequest<{ ok: boolean }>("/v1/test", {
      body: JSON.stringify({ hello: "world" }),
      headers: { Accept: "application/json" },
      token: "explicit-token",
    });

    const requestConfig = fetchMock.mock.calls[0][1] as RequestInit;
    expect((requestConfig.headers as Headers).get("Content-Type")).toBe("application/json");
    expect((requestConfig.headers as Headers).get("Authorization")).toBe("Bearer explicit-token");
  });

  it("throws ApiError with parsed JSON error message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Plan failed" }), {
        status: 400,
        statusText: "Bad Request",
      }),
    );

    await expect(apiRequest("/v1/fail")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Plan failed",
    });
  });

  it("uses the raw JSON body when it does not contain a message field", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: false }), {
        status: 500,
        statusText: "Server Error",
      }),
    );

    await expect(apiRequest("/v1/no-message")).rejects.toMatchObject({
      message: '{"ok":false}',
      status: 500,
    });
  });

  it("throws ApiError even when the error body is empty", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, {
        status: 400,
        statusText: "Bad Request",
      }),
    );

    await expect(apiRequest("/v1/empty-error")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Bad Request",
    });
  });

  it("falls back to raw text when the JSON payload has no message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Template failed", { status: 500, statusText: "Server Error" }),
    );

    await expect(apiRequest("/v1/plain-text")).rejects.toMatchObject({
      message: "Template failed",
      status: 500,
    });
  });

  it("returns undefined for a 204 response and ignores empty body", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await expect(apiRequest("/v1/empty")).resolves.toBeUndefined();
  });

  it("skips the Authorization header when no token is available", async () => {
    localStorage.clear();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await apiRequest("/v1/anonymous");

    const requestConfig = fetchMock.mock.calls[0][1] as RequestInit;
    expect((requestConfig.headers as Headers).has("Authorization")).toBe(false);
  });

  it("uses the default error text when the server omits a status message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 400, statusText: "" }),
    );

    await expect(apiRequest("/v1/no-status-text")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Request failed",
    });
  });
});
