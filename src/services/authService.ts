import type { LoginResponse, User } from "../types/auth.types";

export type { LoginResponse, Role, User } from "../types/auth.types";

const users: Array<User & { password: string }> = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "ADMIN",
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    role: "USER",
  },
];

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const user = users.find(
    (u) =>
      u.username === username &&
      u.password === password
  );

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const token = btoa(
    JSON.stringify({
      userId: user.id,
      username: user.username,
      role: user.role,
    })
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
};