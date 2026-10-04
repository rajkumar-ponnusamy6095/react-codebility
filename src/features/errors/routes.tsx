import { createElement, lazy } from "react";
import type { RouteObject } from "react-router";

export const access = "public";
export const routes = [
  {
    path: "/400",
    element: createElement(lazy(() => import("./pages/errors/BadRequest"))),
  },
  {
    path: "/401",
    element: createElement(lazy(() => import("./pages/errors/Unauthorized"))),
  },
  {
    path: "/403",
    element: createElement(lazy(() => import("./pages/errors/Forbidden"))),
  },
  {
    path: "/500",
    element: createElement(lazy(() => import("./pages/errors/ServerError"))),
  },
  {
    path: "*",
    element: createElement(lazy(() => import("./pages/errors/NotFound"))),
  },
] satisfies RouteObject[];
