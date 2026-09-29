import z from "zod";

export const enquirySchema = z.object({
  subject: z.string().min(1, "Please Enter Name"),
  description: z.string().min(1, "Please Enter Plate Number"),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
