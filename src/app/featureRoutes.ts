import type { RouteObject } from "react-router";

export interface FeatureRouteModule {
  access: "public" | "authenticated" | "admin";
  routes: RouteObject[];
}
