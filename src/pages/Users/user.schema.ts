import { z } from "zod";

export const DEPARTMENTS = [
  "Finance",
  "HR",
  "Engineering",
  "Administration",
  "Operations",
  "Marketing",
] as const;

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid 10-digit phone number",
    ),

  department: z.enum(DEPARTMENTS, {
    error: "Select a department",
  }),

  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "inactive"]),
});

export const userProfileSchema = z.object({
  name: userSchema.shape.name,
  phone: userSchema.shape.phone,
  department: z
    .string()
    .trim()
    .min(1, "Department is required"),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
