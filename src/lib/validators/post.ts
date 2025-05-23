import {z} from "zod";

export const postValidator = z.object({
    title: z.string()
        .min(3, {message: "Title must be longer than 3 characters"})
        .max(128, {message: "Title must not be longer than 128 characters"}),
    communityId: z.string(),
    content: z.any(),
});

export type PostCreationRequest = z.infer<typeof postValidator>;