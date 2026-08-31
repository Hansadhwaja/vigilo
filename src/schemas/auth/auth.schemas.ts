import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/^\S+$/, "Password must not contain spaces")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const registerSchema = z
  .object({
    name: z.string().min(1, "Company name is required"),

    email: z.email("Please enter a valid email address"),

    mobile: z
      .string()
      .regex(/^04\d{8}$/, "Enter a valid Australian mobile number"),

    address: z.string().min(1, "Address is required"),

    password: passwordSchema,

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
