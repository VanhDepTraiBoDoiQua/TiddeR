import {z} from "zod";

export const communityValidators = z.object({
    name: z.string().min(3).max(21).regex(/^[a-zA-Z0-9_-]+$/),
});

export const subscriptionValidators = z.object({
    communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof communityValidators>;
export type SubscriptionPayload = z.infer<typeof subscriptionValidators>;