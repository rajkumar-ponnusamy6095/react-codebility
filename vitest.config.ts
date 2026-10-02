import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      all: false,
      include: [
        "src/context/AuthContext.tsx",
        "src/context/ThemeContext.tsx",
        "src/pages/Login/login.schema.ts",
        "src/pages/Registration/registration.schema.ts",
        "src/pages/Users/user.schema.ts",
        "src/services/api.ts",
        "src/services/authService.ts",
        "src/services/registrationService.ts",
        "src/services/userService.ts",
        "src/themes/themes.ts",
        "src/utils/datePipe.ts",
      ],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/types/**/*.ts",
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
