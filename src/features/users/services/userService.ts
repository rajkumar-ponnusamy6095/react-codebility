import isNil from "lodash/isNil";

import type {
  User,
  UsersQueryParams,
  UsersResponse,
} from "../types/user.types";
import { apiRequest } from "../../../services/api";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !isNil(value) && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  !isNil(value) && typeof value === "string" && value.trim().length > 0;

type UserInput = Omit<User, "id" | "name" | "createdAt" | "isVerified">;

interface AccountApiUser {
  id: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: User["status"];
  createdAt: string;
  isVerified: boolean;
}

interface AccountApiUsersResponse {
  data: AccountApiUser[];
  pagination: UsersResponse["pagination"];
}

const isUserInput = (value: unknown): value is UserInput => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.firstName) &&
    isNonEmptyString(value.lastName) &&
    isNonEmptyString(value.gender) &&
    isNonEmptyString(value.email) &&
    isNonEmptyString(value.phone) &&
    isNonEmptyString(value.department) &&
    !isNil(value.role) &&
    (value.role === "user" || value.role === "admin") &&
    !isNil(value.status) &&
    (value.status === "active" || value.status === "inactive")
  );
};

const unwrapAccount = (value: unknown): unknown =>
  isRecord(value) && isRecord(value.data) ? value.data : value;

const isAccount = (value: unknown): value is AccountApiUser => {
  const account = unwrapAccount(value);
  if (!isRecord(account)) {
    return false;
  }

  return (
    isNonEmptyString(account.id) &&
    isNonEmptyString(account.firstName) &&
    isNonEmptyString(account.lastName) &&
    isNonEmptyString(account.gender) &&
    isNonEmptyString(account.email) &&
    isNonEmptyString(account.phone) &&
    isNonEmptyString(account.department) &&
    typeof account.role === "string" &&
    ["user", "admin"].includes(account.role.toLowerCase()) &&
    (account.status === "active" || account.status === "inactive") &&
    isNonEmptyString(account.createdAt) &&
    typeof account.isVerified === "boolean"
  );
};

const normalizeUser = (value: unknown): User => {
  const account = unwrapAccount(value);
  if (!isAccount(account)) {
    throw new Error("The user response was missing required data");
  }

  const role = account.role.toLowerCase() as User["role"];
  return {
    id: account.id,
    gender: account.gender,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    phone: account.phone,
    department: account.department,
    role,
    status: account.status,
    createdAt: account.createdAt,
    isVerified: account.isVerified,
    name: `${account.firstName} ${account.lastName}`.trim(),
  };
};

const isUsersResponse = (
  value: unknown,
): value is AccountApiUsersResponse => {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    return false;
  }

  const pagination = value.pagination;
  if (!isRecord(pagination)) {
    return false;
  }

  return (
    value.data.every(isAccount) &&
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
    pagination.totalPages >= 0
  );
};

const requireUserId = (id: string): void => {
  if (isNil(id) || !isNonEmptyString(id)) {
    throw new Error("A valid user ID is required");
  }
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

    const apiKey = key === "sortBy" && value === "name" ? "firstName" : key;
    const apiValue =
      key === "role"
        ? value === "admin"
          ? "Admin"
          : "User"
        : value;
    searchParams.set(apiKey, String(apiValue));
  }

  const queryString = searchParams.toString();
  const path = queryString
    ? `/v1/accounts?${queryString}`
    : "/v1/accounts";
  const response = await apiRequest<unknown>(path, { signal });

  if (!isUsersResponse(response)) {
    throw new Error("The users response was missing required data");
  }

  return {
    ...response,
    data: response.data.map((account) => normalizeUser(account)),
  };
};

export const getUser = async (id: string): Promise<User> => {
  requireUserId(id);
  const user = await apiRequest<unknown>(`/v1/accounts/${encodeURIComponent(id)}`);

  return normalizeUser(user);
};

export const createUser = async (
  user: UserInput
): Promise<User> => {
  if (!isUserInput(user)) {
    throw new Error("User details are missing or invalid");
  }

  const createdUser = await apiRequest<unknown>("/v1/accounts", {
    method: "POST",
    body: JSON.stringify({
      ...user,
      role: user.role === "admin" ? "Admin" : "User",
    }),
  });

  return normalizeUser(createdUser);
};

export const updateUser = async (
  id: string,
  updatedUser: UserInput
): Promise<User> => {
  requireUserId(id);
  if (!isUserInput(updatedUser)) {
    throw new Error("Updated user details are missing or invalid");
  }

  const user = await apiRequest<unknown>(`/v1/accounts/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({
      ...updatedUser,
      role: updatedUser.role === "admin" ? "Admin" : "User",
    }),
  });

  return normalizeUser(user);
};

export const deleteUser = async (
  id: string
): Promise<void> => {
  requireUserId(id);
  await apiRequest<never>(`/v1/accounts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};