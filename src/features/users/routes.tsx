import { createElement, lazy } from "react";
import type { RouteObject } from "react-router";

export const access = "admin";
export const routes = [
  {
    path: "/users",
    element: createElement(lazy(() => import("./pages/Users/Users"))),
  },
  {
    path: "/users/new",
    element: createElement(lazy(() => import("./pages/Users/UserForm"))),
  },
  {
    path: "/users/:userId/edit",
    element: createElement(lazy(() => import("./pages/Users/UserForm"))),
  },
] satisfies RouteObject[];
