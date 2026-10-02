import { describe, expect, it } from "vitest";
import { registrationSchema } from "../pages/Registration/registration.schema";

describe("registrationSchema", () => {
  it("accepts valid registration data", () => {
    const valid = {
      firstName: "  Jane  ",
      lastName: "  Doe  ",
      email: "jane@example.com",
      gender: "female",
      phone: "+1 (555) 123-4567",
      department: "Engineering",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    };

    expect(registrationSchema.parse(valid)).toMatchObject({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      gender: "female",
      department: "Engineering",
    });
  });

  it("rejects invalid and mismatched fields", () => {
    const valid = {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      gender: "female",
      phone: "+1 (555) 123-4567",
      department: "Engineering",
      password: "password123",
      confirmPassword: "password123",
      acceptTerms: true,
    };

    expect(() => registrationSchema.parse({ ...valid, confirmPassword: "wrong" })).toThrow();
    expect(() => registrationSchema.parse({ ...valid, phone: "abc" })).toThrow();
    expect(() => registrationSchema.parse({ ...valid, acceptTerms: false })).toThrow();
    expect(() => registrationSchema.parse({ ...valid, email: "invalid" })).toThrow();
  });
});
