import {postVoteValidators} from "@/lib/validators/vote";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {CachedPost} from "@/types/redis";

const CACHE_AFTER_UPVOTE = 1;

export async function PATCH(req: Request) {
    try {
        const body = req.json();

        const {voteType, postId} = postVoteValidators.parse(body);

        const session = await getAuthSession();

        if (!session) {
            return new Response(
                "Unauthorized", {status: 401},
            );
        }

        const existingPost = await db.post.findFirst({
            where: {
                id: postId,
            },
            include: {
                author: true,
                postVotes: true
            }
        });

        if (!existingPost) {
            return new Response(
                "Post not found", {status: 404},
            );
        }

        const existingPostVote = await db.postVote.findFirst({
            where: {
                userId: session.user.id,
                postId: postId
            }
        });

        if (existingPostVote) {
            if (voteType === existingPostVote.type) {
                await db.postVote.delete({
                    where: {
                        userId_postId: {
                            postId: postId,
                            userId: session.user.id
                        }
                    }
                });
                return new Response("OK");
            }

            await db.postVote.update({
                where: {
                    userId_postId: {
                        postId: postId,
                        userId: session.user.id
                    }
                },
                data: {
                    type: voteType
                }
            });
            return new Response("OK")
        }

        // RECOUNT THE VOTE
        const postVotesAmount = existingPost.postVotes.reduce(
            (acc, vote) => {
                if (vote.type === "UP") {
                    return acc + 1;
                }
                if (vote.type === "DOWN") {
                    return acc - 1;
                }
                return acc;
            }, 0
        );

        if (postVotesAmount >= CACHE_AFTER_UPVOTE) {
            const cachedPayload: CachedPost = {
                title: existingPost.title,
                content: JSON.stringify(existingPost.content),
                id: existingPost.id,
                authorUsername: existingPost.author.username ?? "",
                createdAt: existingPost.createdAt,
                currentPostVote: voteType
            };


        }
    } catch (error) {

    }
}