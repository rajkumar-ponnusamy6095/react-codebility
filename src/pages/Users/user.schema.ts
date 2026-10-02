import { z } from "zod";

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

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Enter a valid email address"),

  mobileNumber: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid 10-digit mobile number",
    ),

  role: z.enum(["USER", "ADMIN"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type UserFormData = z.infer<typeof userSchema>;
