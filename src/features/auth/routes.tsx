import { createElement, lazy } from "react";
import type { RouteObject } from "react-router";

export const access = "public";
export const routes = [
  {
    path: "/login",
    element: createElement(lazy(() => import("./pages/Login/Login"))),
  },
  {
    path: "/register",
    element: createElement(lazy(() => import("./pages/Registration/Registration"))),
  },
  {
    path: "/forgot-password",
    element: createElement(lazy(() => import("./pages/ForgotPassword/ForgotPassword"))),
  },
  {
    path: "/account/reset-password",
    element: createElement(lazy(() => import("./pages/ResetPassword/ResetPassword"))),
  },
  {
    path: "/account/verify-email",
    element: createElement(lazy(() => import("./pages/VerifyEmail/VerifyEmail"))),
  },
] satisfies RouteObject[];
