import { z } from "zod";

export const DEPARTMENTS = [
  "Finance",
  "HR",
  "Engineering",
  "Administration",
  "Operation",
  "Marketing",
] as const;

export const GENDERS = ["female", "male", "other"] as const;

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  gender: z.enum(GENDERS, {
    error: "Select a gender",
  }),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s()-]+$/, "Enter a valid phone number")
    .refine((phone) => {
      const digitCount = phone.replace(/\D/g, "").length;
      return digitCount >= 7 && digitCount <= 15;
    }, "Enter a phone number with 7 to 15 digits"),

  department: z.enum(DEPARTMENTS, {
    error: "Select a department",
  }),

  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "inactive"]),
});

export const userProfileSchema = z.object({
  firstName: userSchema.shape.firstName,
  lastName: userSchema.shape.lastName,
  gender: userSchema.shape.gender,
  phone: userSchema.shape.phone,
  department: z
    .string()
    .trim()
    .min(1, "Department is required"),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
