import { createElement, lazy } from "react";
import type { RouteObject } from "react-router";

export const access = "authenticated";
export const routes = [
  {
    path: "/profile",
    element: createElement(lazy(() => import("./pages/Profile/Profile"))),
  },
] satisfies RouteObject[];
