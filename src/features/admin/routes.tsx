import { createElement, lazy } from "react";
import type { RouteObject } from "react-router";

export const access = "admin";
export const routes = [
  {
    path: "/admin",
    element: createElement(lazy(() => import("./pages/Admin/Admin"))),
  },
] satisfies RouteObject[];
