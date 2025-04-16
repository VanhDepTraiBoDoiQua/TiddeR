import {z} from "zod";

export const messageValidator = z.object({
    userId: z.string(),
    conversationId: z.string(),
    messageBody: z.string().optional(),
    messageImage: z.string().optional(),
});

export type MessageCreationRequest = z.infer<typeof messageValidator>;