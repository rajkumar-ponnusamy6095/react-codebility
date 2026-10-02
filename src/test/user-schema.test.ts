import { describe, expect, it } from "vitest";
import { userSchema } from "../pages/Users/user.schema";

describe("userSchema", () => {
  it("accepts valid user data", () => {
    const valid = {
      firstName: "Jane",
      lastName: "Doe",
      gender: "female",
      email: "jane@example.com",
      phone: "+1234567890",
      department: "Engineering",
      role: "admin",
      status: "active",
    } as const;

    expect(userSchema.parse(valid)).toEqual(valid);
  });

  it("rejects invalid values", () => {
    const valid = {
      firstName: "Jane",
      lastName: "Doe",
      gender: "female",
      email: "jane@example.com",
      phone: "+1234567890",
      department: "Engineering",
      role: "admin",
      status: "active",
    } as const;

    expect(() => userSchema.parse({ ...valid, email: "bad-email" })).toThrow();
    expect(() => userSchema.parse({ ...valid, role: "manager" })).toThrow();
    expect(() => userSchema.parse({ ...valid, status: "pending" })).toThrow();
  });
});
