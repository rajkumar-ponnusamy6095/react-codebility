import type { LoginResponse, User } from "../types/auth.types";
import { apiRequest } from "./api";

export type { LoginResponse, Role, User } from "../types/auth.types";

const normalizeUserRole = (user: User): User => {
  const role = String(user.role).toUpperCase();

  if (role !== "ADMIN" && role !== "USER") {
    throw new Error(`Unsupported user role: ${user.role}`);
  }

  return { ...user, role };
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    token: null,
  });

  if (!response) {
    throw new Error("The login response was empty");
  }

  return {
    ...response,
    user: normalizeUserRole(response.user),
  };
};

export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await apiRequest<{ user: User }>("/api/auth/me", { token });

  if (!response?.user) {
    throw new Error("The current-user response was empty");
  }

  return normalizeUserRole(response.user);
};

export const logout = async (token: string): Promise<void> => {
  await apiRequest<never>("/api/auth/logout", {
    method: "POST",
    token,
  });
};