export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  username: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: User;
}
