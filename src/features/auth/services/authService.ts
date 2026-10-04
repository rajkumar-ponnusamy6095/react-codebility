import type { LoginResponse, User } from "../types/auth.types";
import { apiRequest } from "../../../services/api";

export type { LoginResponse, Role, User } from "../types/auth.types";

export interface AuthMessageResponse {
  message: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireMessage = (
  response: AuthMessageResponse | undefined,
  operation: string,
): AuthMessageResponse => {
  if (!response || typeof response.message !== "string") {
    throw new Error(`The ${operation} response was missing a message`);
  }

  return response;
};

const unwrapData = (value: unknown): unknown =>
  isRecord(value) && "data" in value ? value.data : value;

const normalizeCurrentUser = (value: unknown): User => {
  const account = unwrapData(value);
  if (
    !isRecord(account) ||
    typeof account.id !== "string" ||
    typeof account.email !== "string" ||
    typeof account.firstName !== "string" ||
    typeof account.lastName !== "string" ||
    typeof account.gender !== "string" ||
    typeof account.phone !== "string" ||
    typeof account.department !== "string" ||
    typeof account.status !== "string" ||
    typeof account.role !== "string" ||
    typeof account.createdAt !== "string" ||
    typeof account.isVerified !== "boolean"
  ) {
    throw new Error("The current-user response was missing required data");
  }

  const role = account.role.toUpperCase();
  if (role !== "ADMIN" && role !== "USER") {
    throw new Error(`Unsupported user role: ${account.role}`);
  }
  if (account.status !== "active" && account.status !== "inactive") {
    throw new Error(`Unsupported account status: ${account.status}`);
  }

  return {
    id: account.id,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    name: `${account.firstName} ${account.lastName}`.trim(),
    gender: account.gender,
    phone: account.phone,
    department: account.department,
    status: account.status,
    role,
    createdAt: account.createdAt,
    isVerified: account.isVerified,
  };
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiRequest<LoginResponse>("/v1/accounts/authenticate", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    token: null,
  });

  if (!response) {
    throw new Error("The login response was empty");
  }
  if (
    typeof response.email !== "string" ||
    typeof response.jwtToken !== "string" ||
    response.jwtToken.length === 0
  ) {
    throw new Error("The login response was missing required data");
  }

  return response;
};

export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await apiRequest<unknown>("/v1/accounts/me", { token });
  return normalizeCurrentUser(response);
};

export const requestPasswordReset = async (
  email: string,
): Promise<AuthMessageResponse> => {
  const response = await apiRequest<AuthMessageResponse>(
    "/v1/accounts/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
      token: null,
    },
  );

  return requireMessage(response, "forgot-password");
};

export const validatePasswordResetToken = async (
  token: string,
): Promise<AuthMessageResponse> => {
  const response = await apiRequest<AuthMessageResponse>(
    "/v1/accounts/validate-reset-token",
    {
      method: "POST",
      body: JSON.stringify({ token }),
      token: null,
    },
  );

  return requireMessage(response, "reset-token validation");
};

export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string,
): Promise<AuthMessageResponse> => {
  const response = await apiRequest<AuthMessageResponse>(
    "/v1/accounts/reset-password",
    {
      method: "POST",
      body: JSON.stringify({ token, password, confirmPassword }),
      token: null,
    },
  );

  return requireMessage(response, "password-reset");
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<void> => {
  await apiRequest<unknown>("/v1/accounts/change-password", {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
  });
};

export const verifyEmail = async (
  token: string,
): Promise<AuthMessageResponse> => {
  const response = await apiRequest<AuthMessageResponse>(
    "/v1/accounts/verify-email",
    {
      method: "POST",
      body: JSON.stringify({ token }),
      token: null,
    },
  );

  return requireMessage(response, "email-verification");
};