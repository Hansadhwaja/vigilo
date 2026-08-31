import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  mobile: z
    .string()
    .regex(/^04\d{8}$/, "Enter a valid Australian mobile number"),

  address: z.string().min(1, "Address is required"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
