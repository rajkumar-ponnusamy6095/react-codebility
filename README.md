# Codebility

Codebility is a React 19 and TypeScript single-page application built with Vite.
The UI uses React Bootstrap, React Router, React Hook Form, and Zod. The app is
organized by feature so pages, route declarations, domain services, and types
can grow with their module instead of accumulating in global folders.

## Contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Available commands](#available-commands)
- [Project structure](#project-structure)
- [Adding a feature](#adding-a-feature)
- [Routing and access control](#routing-and-access-control)
- [API and environment configuration](#api-and-environment-configuration)
- [Backend endpoints](#backend-endpoints)
- [Testing and code quality](#testing-and-code-quality)

## Requirements

- Node.js compatible with the Vite version in `package.json`
- npm
- Access to the backend API (the local development default is
  `http://localhost:4000/api`)

## Getting started

From the repository root:

```bash
npm install
npm run dev
```

Vite prints the local URL when the development server starts (normally
`http://localhost:5173`). Keep the backend running at the URL configured by
`VITE_API_BASE_URL`.

Before building or deploying, make sure the API base URL is set for the target
environment; see [API and environment configuration](#api-and-environment-configuration).

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Type-check the application and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally (run `npm run build` first). |
| `npm test` | Run the Vitest test suite once. |
| `npm run test:coverage` | Run tests and generate coverage output. |
| `npm run lint` | Run ESLint across the repository. |

## Project structure

```text
src/
  app/                    # Application-wide route composition
  components/             # Shared UI components and route guards
  context/                # App-wide providers (authentication, theme)
  features/
    auth/
      pages/              # Login, registration, and account recovery screens
      services/           # Authentication and registration API operations
      types/              # Authentication domain types
      routes.tsx          # Auth feature route declarations
    users/
      pages/              # User list and user form
      services/           # User/account API operations
      types/              # User domain types
      routes.tsx
    admin/
    dashboard/
    errors/
    profile/
  services/
    api.ts                # Shared fetch wrapper and API error handling
  shared/                 # Small values shared by multiple features
  test/                   # Vitest tests and test setup
  themes/                 # Theme definitions
  utils/                  # Shared utility functions
  global.css              # Global application styles
  theme.css               # Theme tokens, including the global font family
```

### Ownership guidelines

- Put a page, its schemas, hooks, and feature-only UI next to the feature that
  owns it.
- Put API operations in that feature's `services/` directory. Keep shared HTTP
  behavior in `src/services/api.ts`; feature services should call `apiRequest`
  rather than implementing their own `fetch` configuration.
- Keep feature types with the feature. Put a type in a shared location only
  when it is genuinely used across feature boundaries.
- Keep reusable application UI in `src/components/`. Avoid placing
  feature-specific screens or business rules there.
- Keep providers that coordinate app-wide concerns in `src/context/`.
- Prefer feature-local imports. Cross-feature imports should be limited to
  functionality that the consuming feature genuinely needs.

## Adding a feature

Create a folder under `src/features/` and put the module's pages, services,
types, and route declarations there. For example:

```text
src/features/reports/
  pages/
    ReportsPage.tsx
  services/
    reportService.ts
  types/
    report.types.ts
  routes.tsx
```

The root router discovers `src/features/*/routes.tsx` automatically. Export an
`access` level and a `routes` array from the feature's `routes.tsx`:

```tsx
import { createElement, lazy } from "react";
import type { RouteObject } from "react-router";

export const access = "authenticated";
export const routes = [
  {
    path: "/reports",
    element: createElement(lazy(() => import("./pages/ReportsPage"))),
  },
] satisfies RouteObject[];
```

The component is lazy-loaded. Use one of the access levels that the root router
handles:

- `public` — available without authentication, such as login or error pages.
- `authenticated` — requires a signed-in user and renders inside the main app
  layout.
- `admin` — requires a signed-in admin and renders inside the main app layout.

Add tests under `src/test/` using the established Vitest patterns. No changes to
`src/App.tsx` are needed to register feature routes.

## Routing and access control

`src/app/AppRoutes.tsx` discovers feature route modules and composes them with
the shared guards:

1. Public routes render without the authenticated application layout.
2. Authenticated routes are wrapped by `ProtectedRoute` and `AppLayout`.
3. Admin routes are additionally wrapped by `RoleRoute` for the `ADMIN` role.
4. The root path redirects to `/dashboard`; unmatched paths render the not-found
   page registered by the errors feature.

Route access is client-side navigation and presentation control. Backend APIs
must independently authorize protected operations.

## API and environment configuration

The API base URL is configured by `VITE_API_BASE_URL`. A local development
value is provided in the repository-root `.env` file:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Set this variable in the environment used to run or build the app when targeting
another backend. For local overrides, use `.env.local`; for CI or deployment,
set the environment variable in the build environment. Restart Vite after
changing environment files.

The application requires this setting and fails clearly when it is missing.
Vite embeds variables prefixed with `VITE_` into browser code: **never put
secrets, private keys, or credentials in these variables**.

All feature services use `src/services/api.ts`, which centralizes base URL
handling, JSON request headers, bearer-token attachment, response parsing, and
`ApiError` reporting. Pass `token: null` for requests that must not use the
current stored token.

The app-wide font is loaded as DM Sans and configured with the
`--app-font-family` CSS variable in `src/theme.css`. The font stylesheet is
loaded from Google Fonts in `index.html`; update the CSS variable to change the
typography globally. A system sans-serif stack is used as a fallback.

## Backend endpoints

The API base URL is combined with the following paths:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/accounts/authenticate` | Authenticate with email and password; returns an email and JWT. |
| `GET` | `/v1/accounts/me` | Load the current authenticated account. |
| `POST` | `/v1/accounts/register` | Register an account and initiate email verification. |
| `POST` | `/v1/accounts/forgot-password` | Request a password-reset email. |
| `POST` | `/v1/accounts/validate-reset-token` | Validate a password-reset token. |
| `POST` | `/v1/accounts/reset-password` | Set a new password using a reset token. |
| `POST` | `/v1/accounts/change-password` | Change the authenticated account password. |
| `POST` | `/v1/accounts/verify-email` | Verify an email using its token. |
| `GET` | `/v1/accounts` | List accounts; returns `data` and `pagination`. |
| `GET` | `/v1/accounts/:id` | Load an account. |
| `POST` | `/v1/accounts` | Create an account. |
| `PUT` | `/v1/accounts/:id` | Update an account. |
| `DELETE` | `/v1/accounts/:id` | Delete an account. |

Authentication sends `{ "email": "...", "password": "..." }` and expects
`{ "email": "...", "jwtToken": "..." }`. The JWT and current account are stored
in browser local storage by the authentication context and the token is sent
as a bearer token for authenticated requests.

Changing a password sends `oldPassword`, `newPassword`, and `confirmPassword`
to `/v1/accounts/change-password` with the authenticated bearer token.

Account roles returned by the backend are `Admin` or `User`; the UI normalizes
them to `ADMIN` or `USER` for access control. Account IDs are strings and names
are represented by `firstName` and `lastName`.

The authenticated `/profile` page lets users view and update their account
details and change their password. On desktop, the profile and password forms
are displayed side by side; on smaller screens, they stack vertically.

Registration submits `gender`, `firstName`, `lastName`, `email`, `phone`,
`department`, `password`, `confirmPassword`, and `acceptTerms`. A successful
registration directs the user to login with an email-verification notification.

## Testing and code quality

Tests are written with Vitest, React Testing Library, and
`@testing-library/user-event`. The shared test setup is in `src/test/setup.ts`;
test files use the `*.test.ts` or `*.test.tsx` suffix.

```bash
npm test
npm run test:coverage
npm run lint
npm run build
```

For a focused test run, pass a test file to Vitest:

```bash
npx vitest run src/test/api.test.ts
```

The production build runs the TypeScript project build before Vite generates
the deployable assets.
