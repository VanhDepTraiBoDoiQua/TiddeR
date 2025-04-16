import {z} from "zod";

export const conversationValidators = z.object({
    userId: z.string(),
    isGroup: z.boolean().optional(),
    members: z.array(z.string()),
    name: z.string().optional(),
});

export type ConversationRequest = z.infer<typeof conversationValidators>;