# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Backend API

The UI calls the REST API at `http://localhost:4000/api` by default. Set
`VITE_API_BASE_URL` to change the API base URL, for example:

```env
VITE_API_BASE_URL=https://api.example.com
```

Authentication sends `{ "email": "...", "password": "..." }` to
`POST /v1/accounts/authenticate` and expects `{ "email": "...", "jwtToken": "..." }`.
After authentication, `GET /v1/accounts/me` loads the current account. The JWT
is sent as a bearer token to protected endpoints and the account is stored with
the token in local storage.

User management uses `GET /v1/accounts` (a `{ "data": [...], "pagination": {...} }`
response), `GET /v1/accounts/:id`, `POST /v1/accounts`, `PUT /v1/accounts/:id`,
and `DELETE /v1/accounts/:id`. Account names are represented by `firstName` and
`lastName`, IDs are strings, and roles returned by the API are `Admin` or
`User`.

Self-service registration sends `gender`, `firstName`, `lastName`, `email`,
`phone`, `department`, `password`, `confirmPassword`, and `acceptTerms` to
`POST /v1/accounts/register`. After a successful response, the user is sent to
the login page with a notification to verify their email.
