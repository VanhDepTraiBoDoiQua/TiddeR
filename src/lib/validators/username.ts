import {z} from "zod";

export const usernameValidator = z.object({
    username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores."),
});

export type UsernameRequest = z.infer<typeof usernameValidator>;