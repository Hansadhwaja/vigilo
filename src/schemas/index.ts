import { z } from "zod";

export const broadcastSchema = z.object({
    sendToAll: z.boolean(),
    guardIds: z.array(z.string()).optional(),
    projectId: z.string().optional(),
    message: z.string().min(1, "Message is required"),
    attachment: z.instanceof(File).optional(),
}).refine((data) => {
    if (!data.sendToAll) {
        return data.guardIds && data.guardIds.length > 0;
    }
    return true;
}, {
    message: "Select at least one guard",
    path: ["guardIds"],
});

export type BroadCastFormValues = z.infer<typeof broadcastSchema>;