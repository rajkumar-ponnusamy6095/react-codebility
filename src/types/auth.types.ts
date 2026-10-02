export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  role: Role;
  name?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
