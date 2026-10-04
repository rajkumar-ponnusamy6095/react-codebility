import { createElement, lazy } from "react";
import type { RouteObject } from "react-router";

export const access = "authenticated";
export const routes = [
  {
    path: "/dashboard",
    element: createElement(lazy(() => import("./pages/Dashboard/Dashboard"))),
  },
] satisfies RouteObject[];
