import isNil from "lodash/isNil";

import type {
  User,
  UsersQueryParams,
  UsersResponse,
} from "../pages/Users/user.types";
import { apiRequest } from "./api";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !isNil(value) && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  !isNil(value) && typeof value === "string" && value.trim().length > 0;

const isUserInput = (
  value: unknown,
): value is Omit<User, "id" | "createdAt"> => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.email) &&
    isNonEmptyString(value.phone) &&
    isNonEmptyString(value.department) &&
    !isNil(value.role) &&
    (value.role === "user" || value.role === "admin") &&
    !isNil(value.status) &&
    (value.status === "active" || value.status === "inactive")
  );
};

const isUser = (value: unknown): value is User => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    !isNil(value.id) &&
    typeof value.id === "number" &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.email) &&
    isNonEmptyString(value.phone) &&
    isNonEmptyString(value.department) &&
    !isNil(value.role) &&
    (value.role === "user" || value.role === "admin") &&
    !isNil(value.status) &&
    (value.status === "active" || value.status === "inactive") &&
    !isNil(value.createdAt) &&
    typeof value.createdAt === "string" &&
    value.createdAt.length > 0
  );
};

const isUsersResponse = (value: unknown): value is UsersResponse => {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    return false;
  }

  const pagination = value.pagination;
  if (!isRecord(pagination)) {
    return false;
  }

  return (
    value.data.every(isUser) &&
    !isNil(pagination.page) &&
    typeof pagination.page === "number" &&
    Number.isSafeInteger(pagination.page) &&
    pagination.page > 0 &&
    !isNil(pagination.limit) &&
    typeof pagination.limit === "number" &&
    Number.isSafeInteger(pagination.limit) &&
    pagination.limit > 0 &&
    !isNil(pagination.total) &&
    typeof pagination.total === "number" &&
    Number.isSafeInteger(pagination.total) &&
    pagination.total >= 0 &&
    !isNil(pagination.totalPages) &&
    typeof pagination.totalPages === "number" &&
    Number.isSafeInteger(pagination.totalPages) &&
    pagination.totalPages > 0
  );
};

const requireUserId = (id: number): void => {
  if (
    isNil(id) ||
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    throw new Error("A valid user ID is required");
  }
};

const requireUser = (value: unknown, message: string): User => {
  if (!isUser(value)) {
    throw new Error(message);
  }

  return value;
};

export const getUsers = async (
  query: UsersQueryParams = {},
  signal?: AbortSignal,
): Promise<UsersResponse> => {
  if (isNil(query) || !isRecord(query)) {
    throw new Error("The users query is missing or invalid");
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") {
      continue;
    }

    if (isNil(value)) {
      throw new Error(`The users query parameter "${key}" cannot be null`);
    }

    searchParams.set(key, String(value));
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/api/users?${queryString}` : "/api/users";
  const response = await apiRequest<unknown>(path, { signal });

  if (!isUsersResponse(response)) {
    throw new Error("The users response was missing required data");
  }

  return response;
};

export const getUser = async (id: number): Promise<User> => {
  requireUserId(id);
  const user = await apiRequest<unknown>(`/api/users/${id}`);

  return requireUser(user, "The user response was missing required data");
};

export const createUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<User> => {
  if (!isUserInput(user)) {
    throw new Error("User details are missing or invalid");
  }

  const createdUser = await apiRequest<unknown>("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  });

  return requireUser(
    createdUser,
    "The create-user response was missing required data",
  );
};

export const updateUser = async (
  id: number,
  updatedUser: Omit<User, "id" | "createdAt">
): Promise<User> => {
  requireUserId(id);
  if (!isUserInput(updatedUser)) {
    throw new Error("Updated user details are missing or invalid");
  }

  const user = await apiRequest<unknown>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedUser),
  });

  return requireUser(user, "The update-user response was missing required data");
};

export const deleteUser = async (
  id: number
): Promise<void> => {
  requireUserId(id);
  await apiRequest<never>(`/api/users/${id}`, {
    method: "DELETE",
  });
};