import {z} from "zod";

export const postVoteValidators = z.object({
    postId: z.string(),
    voteType: z.enum(["UP", "DOWN"]),
});

export type PostVoteRequest = z.infer<typeof postVoteValidators>;

export const commentVoteValidators = z.object({
    commentId: z.string(),
    voteType: z.enum(["UP", "DOWN"]),
});

export type CommentVoteRequest = z.infer<typeof commentVoteValidators>;