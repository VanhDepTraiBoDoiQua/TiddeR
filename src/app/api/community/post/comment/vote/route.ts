import {commentVoteValidators} from "@/lib/validators/vote";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {z} from "zod";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const {voteType, commentId} = commentVoteValidators.parse(body);

        const session = await getAuthSession();

        if (!session) {
            return new Response(
                "Unauthorized", {status: 401},
            );
        }

        const existingComment = await db.comment.findFirst({
            where: {
                id: commentId,
            },
            include: {
                author: true,
                commentVotes: true
            }
        });

        if (!existingComment) {
            return new Response(
                "Comment not found", {status: 404},
            );
        }

        const existingCommentVote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId: commentId,
            }
        });

        if (existingCommentVote) {
            if (voteType === existingCommentVote.type) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            userId: session.user.id,
                            commentId: commentId,
                        }
                    }
                });

                return new Response("OK");
            }

            await db.commentVote.update({
                where: {
                    userId_commentId: {
                        userId: session.user.id,
                        commentId: commentId,
                    }
                },
                data: {
                    type: voteType
                }
            });

            return new Response("OK");
        }

        await db.commentVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                commentId: commentId,
            }
        });

        return new Response("OK");

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                error.message, {status: 422}
            );
        }

        return new Response(
            "Could not register your vote, please try again later.", {status: 500}
        );
    }
}