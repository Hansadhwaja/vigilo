import { z } from "zod";
import { addressSchema, emailSchema, mobileSchema, passwordSchema } from "../common.schemas";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Company name is required"),

    email: emailSchema,

    mobile: mobileSchema,

    address: addressSchema,

    password: passwordSchema,

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
