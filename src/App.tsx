import { Routes, Route } from "react-router";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Admin from "./pages/Admin/Admin";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RoleRoute from "./components/RoleRoute/RoleRoute";
import Registration from "./pages/Registration/Registration";

import BadRequest from "./pages/errors/BadRequest";
import Unauthorized from "./pages/errors/Unauthorized";
import Forbidden from "./pages/errors/Forbidden";
import ServerError from "./pages/errors/ServerError";
import NotFound from "./pages/errors/NotFound";
import Users from "./pages/Users/Users";
import UserForm from "./pages/Users/UserForm";
import AppLayout from "./components/AppLayout/AppLayout";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Registration />} />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ADMIN only */}

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:userId/edit" element={<UserForm />} />
          </Route>
        </Route>
      </Route>

      {/* Error Routes */}

      <Route path="/400" element={<BadRequest />} />

      <Route path="/401" element={<Unauthorized />} />

      <Route path="/403" element={<Forbidden />} />

      <Route path="/500" element={<ServerError />} />

      {/* 404 */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
