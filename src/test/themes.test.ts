import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, themes } from "../themes/themes";

describe("themes", () => {
  it("exposes the default and registered themes", () => {
    expect(DEFAULT_THEME).toBe("blue");
    expect(themes.blue.label).toBe("Azure");
    expect(Object.keys(themes)).toHaveLength(6);
  });
});
