import { mockUsers } from "../mock/users";

import type {
  User,
} from "../pages/Users/user.types";

/*
 * In-memory mock database.
 *
 * This will be replaced by API calls later.
 */
let users: User[] = [...mockUsers];

export const getUsers = async (): Promise<User[]> => {
  return [...users];
};

export const createUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<User> => {
  const newUser: User = {
    ...user,
    id: Date.now(),
    createdAt: new Date()
      .toISOString()
      .split("T")[0],
  };

  users = [
    ...users,
    newUser,
  ];

  return newUser;
};

export const updateUser = async (
  id: number,
  updatedUser: Omit<User, "id" | "createdAt">
): Promise<User> => {
  const existingUser = users.find(
    (user) => user.id === id
  );

  if (!existingUser) {
    throw new Error("User not found");
  }

  const updated: User = {
    ...existingUser,
    ...updatedUser,
  };

  users = users.map((user) =>
    user.id === id
      ? updated
      : user
  );

  return updated;
};

export const deleteUser = async (
  id: number
): Promise<void> => {
  const exists = users.some(
    (user) => user.id === id
  );

  if (!exists) {
    throw new Error("User not found");
  }

  users = users.filter(
    (user) => user.id !== id
  );
};