import { Suspense } from "react";
import { Navigate, useRoutes } from "react-router";
import type { FeatureRouteModule } from "./featureRoutes";
import AppLayout from "../components/AppLayout/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import RoleRoute from "../components/RoleRoute/RoleRoute";

const featureRouteModules = import.meta.glob<FeatureRouteModule>(
  "../features/*/routes.tsx",
  { eager: true },
);
const featureRoutes = Object.values(featureRouteModules);
const publicRoutes = featureRoutes
  .filter((feature) => feature.access === "public")
  .flatMap((feature) => feature.routes);
const authenticatedRoutes = featureRoutes
  .filter((feature) => feature.access === "authenticated")
  .flatMap((feature) => feature.routes);
const adminRoutes = featureRoutes
  .filter((feature) => feature.access === "admin")
  .flatMap((feature) => feature.routes);

export default function AppRoutes() {
  const routes = useRoutes([
    ...publicRoutes,
    {
      element: <ProtectedRoute />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        {
          element: <AppLayout />,
          children: [
            ...authenticatedRoutes,
            {
              element: <RoleRoute allowedRoles={["ADMIN"]} />,
              children: adminRoutes,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <Suspense
      fallback={
        <div className="container py-4" role="status" aria-live="polite">
          Loading page...
        </div>
      }
    >
      {routes}
    </Suspense>
  );
}
