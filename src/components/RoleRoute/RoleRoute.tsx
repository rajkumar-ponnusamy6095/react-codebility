import {
  Navigate,
  Outlet,
} from "react-router";

import { useAuth } from "../../context/AuthContext";

import type { Role } from "../../types/auth.types";

interface RoleRouteProps {
  allowedRoles: Role[];
}

export default function RoleRoute({
  allowedRoles,
}: RoleRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return <Outlet />;
}