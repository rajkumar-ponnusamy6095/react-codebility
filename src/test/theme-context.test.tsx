import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { DEFAULT_THEME } from "../themes/themes";

describe("ThemeContext", () => {
  function ThemeProbe() {
    const { theme, setTheme } = useTheme();
    return (
      <>
        <span>{theme}</span>
        <button onClick={() => setTheme("green")}>set-green</button>
      </>
    );
  }

  it("uses the saved theme and updates it", () => {
    localStorage.setItem("app-theme", "orange");
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByText("orange")).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("orange");

    fireEvent.click(screen.getByRole("button", { name: "set-green" }));
    expect(screen.getByText("green")).toBeInTheDocument();
    expect(localStorage.getItem("app-theme")).toBe("green");
  });

  it("falls back to the default theme for bad values", () => {
    localStorage.setItem("app-theme", "invalid-theme");
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByText(DEFAULT_THEME)).toBeInTheDocument();
  });

  it("throws without a provider", () => {
    expect(() => render(<ThemeProbe />)).toThrow("useTheme must be used inside ThemeProvider");
  });
});
