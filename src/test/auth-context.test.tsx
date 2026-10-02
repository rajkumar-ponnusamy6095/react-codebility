import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";

describe("AuthContext", () => {
  const currentUser = {
    id: "u1",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    name: "Jane Doe",
    gender: "female",
    phone: "+1234567890",
    department: "Engineering",
    status: "active" as const,
    role: "USER" as const,
    createdAt: "2024-06-01T00:00:00Z",
    isVerified: true,
  };

  function AuthProbe() {
    const { user, token, isAuthenticated, isLoading, authError, login, logout, updateUserName, retryAuthentication } = useAuth();

    return (
      <div>
        <span>{token ?? "none"}</span>
        <span>{String(isAuthenticated)}</span>
        <span>{String(isLoading)}</span>
        <span>{authError ?? "none"}</span>
        <span>{user ? user.name : "no-user"}</span>
        <button onClick={() => login({ email: "jane@example.com", jwtToken: "jwt-123" }, currentUser)}>login</button>
        <button onClick={() => updateUserName("Jane Updated", "Jane", "Updated")}>rename</button>
        <button onClick={() => updateUserName("Jane Only Name")}>rename-partial</button>
        <button onClick={() => retryAuthentication()}>retry</button>
        <button onClick={() => logout()}>logout</button>
      </div>
    );
  }

  it("logs in, updates the name, retries and logs out", () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "login" }));
    expect(screen.getByText("jwt-123")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("jwt-123");

    fireEvent.click(screen.getByRole("button", { name: "rename" }));
    expect(screen.getByText("Jane Updated")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "retry" }));
    expect(screen.getAllByText("true").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "logout" }));
    expect(screen.getAllByText("none").length).toBeGreaterThan(0);
  });

  it("does not change the user when no one is authenticated", () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "rename" }));
    expect(screen.getByText("no-user")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "rename-partial" }));
    expect(screen.getByText("no-user")).toBeInTheDocument();
  });

  it("applies partial name updates when a user is logged in", () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "login" }));
    fireEvent.click(screen.getByRole("button", { name: "rename-partial" }));
    expect(screen.getByText("Jane Only Name")).toBeInTheDocument();
  });

  it("ignores stale session responses after unmount", async () => {
    let resolveFetch: (value: Response) => void = () => undefined;
    localStorage.setItem("token", "stale-token");
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const { unmount } = render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    unmount();
    resolveFetch(
      new Response(JSON.stringify({ data: { ...currentUser, role: "USER" } }), {
        status: 200,
      }),
    );

    await Promise.resolve();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("loads the current user and clears invalid sessions", async () => {
    localStorage.setItem("token", "expired-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { ...currentUser, role: "USER" } }), { status: 200 }),
    );

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText("Jane Doe")).toBeInTheDocument());

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new ApiError("Unauthorized", 401));
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => expect(localStorage.getItem("token")).toBeNull());
  });

  it("stores auth errors for session failures", async () => {
    localStorage.setItem("token", "bad-token");
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new ApiError("Oops server error", 500));

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText("Oops server error")).toBeInTheDocument());
  });

  it("stores generic errors from non-ApiError failures", async () => {
    localStorage.setItem("token", "generic-token");
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Broken response"));

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText("Broken response")).toBeInTheDocument());
  });

  it("uses the fallback message for non-Error failures", async () => {
    localStorage.setItem("token", "fallback-token");
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce({ status: 500 });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("Failed to verify the current session")).toBeInTheDocument(),
    );
  });

  it("throws when used without a provider", () => {
    expect(() => render(<AuthProbe />)).toThrow("useAuth must be used inside AuthProvider");
  });
});
