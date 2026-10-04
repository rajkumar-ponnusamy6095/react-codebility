import { z } from "zod";
import { DEPARTMENTS, GENDERS } from "../../../../shared/accountOptions";

export const registrationSchema = z.object({
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

  gender: z.enum(GENDERS, {
    error: "Select a gender",
  }),

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

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),

  acceptTerms: z.literal(true, {
    error: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegistrationFormData =
  z.infer<typeof registrationSchema>;