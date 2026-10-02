export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}