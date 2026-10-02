export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";
export type UserSortOrder = "asc" | "desc";

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: UserSortOrder;
  role?: UserRole;
  status?: UserStatus;
  department?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  data: User[];
  pagination: UserPagination;
}