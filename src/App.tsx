import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RoleRoute from "./components/RoleRoute/RoleRoute";

const Login = lazy(() => import("./pages/Login/Login"));
const Registration = lazy(() => import("./pages/Registration/Registration"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail/VerifyEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Admin = lazy(() => import("./pages/Admin/Admin"));
const Users = lazy(() => import("./pages/Users/Users"));
const UserForm = lazy(() => import("./pages/Users/UserForm"));
const BadRequest = lazy(() => import("./pages/errors/BadRequest"));
const Unauthorized = lazy(() => import("./pages/errors/Unauthorized"));
const Forbidden = lazy(() => import("./pages/errors/Forbidden"));
const ServerError = lazy(() => import("./pages/errors/ServerError"));
const NotFound = lazy(() => import("./pages/errors/NotFound"));
const AppLayout = lazy(() => import("./components/AppLayout/AppLayout"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="container py-4" role="status" aria-live="polite">
          Loading page...
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/account/reset-password" element={<ResetPassword />} />
        <Route path="/account/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

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
    </Suspense>
  );
}
