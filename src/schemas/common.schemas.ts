import { z } from "zod";

export const passwordSchema = z
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

export const emailSchema = z.email("Please enter a valid email address");

export const mobileSchema = z
  .string()
  .regex(
    /^04\d{8}$/,
    "Enter a valid Australian mobile number starting with 04",
  );

export const addressSchema = z
  .string()
  .min(5, "Address must be at least 5 chars long");

export const descriptionSchema = z
  .string()
  .min(5, "Description must be at least 5 characters")
  .max(500, "Description cannot exceed 500 characters");
