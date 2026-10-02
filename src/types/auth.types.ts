export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  name: string;
  gender: string;
  phone: string;
  department: string;
  status: "active" | "inactive";
  createdAt: string;
  isVerified: boolean;
}

export interface LoginResponse {
  email: string;
  jwtToken: string;
}
