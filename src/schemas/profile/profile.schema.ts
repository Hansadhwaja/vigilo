import { z } from "zod";
import { addressSchema, mobileSchema } from "../common.schemas";

export const profileSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  mobile: mobileSchema,

  address: addressSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
