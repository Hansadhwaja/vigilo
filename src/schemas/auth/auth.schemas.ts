import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Company name must be at least 2 characters"),

    email: z.email("Please enter a valid email address"),

    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),

    address: z.string().min(5, "Please enter a valid address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
