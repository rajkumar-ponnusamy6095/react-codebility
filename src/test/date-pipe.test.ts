import { describe, expect, it } from "vitest";
import { datePipe } from "../utils/datePipe";

describe("datePipe", () => {
  it("returns invalid date for nullish or malformed values", () => {
    expect(datePipe(null)).toBe("Invalid date");
    expect(datePipe(undefined)).toBe("Invalid date");
    expect(datePipe("not-a-date")).toBe("Invalid date");
  });

  it("formats valid dates", () => {
    const isoDate = "2024-05-20T12:00:00Z";
    const expected = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(isoDate));

    expect(datePipe(isoDate)).toBe(expected);
  });
});
