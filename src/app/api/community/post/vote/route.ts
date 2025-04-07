import {postVoteValidators} from "@/lib/validators/vote";
import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {CachedPost} from "@/types/redis";
import {redis} from "@/lib/redis";
import {Post, PostVote, User, VoteType} from "@prisma/client";
import {z} from "zod";

const CACHE_AFTER_UPVOTE = 10;

type ExistingPost = Post & {
    author: User;
    postVotes: PostVote[];
}

function countPostVotes(post: ExistingPost) {
    return post.postVotes.reduce(
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
}

async function cachePost(postVotesAmount: number, existingPost: ExistingPost, voteType: VoteType) {
    if (postVotesAmount >= CACHE_AFTER_UPVOTE) {
        const cachedPayload: CachedPost = {
            title: existingPost.title,
            content: JSON.stringify(existingPost.content),
            id: existingPost.id,
            authorUsername: existingPost.author.username ?? "",
            createdAt: existingPost.createdAt,
            currentPostVote: voteType
        };

        await redis.hset(`post:${existingPost.id}`, cachedPayload);
        console.log("cachePost", cachedPayload);
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

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

                const postVotesAmount = countPostVotes(existingPost);

                if (postVotesAmount >= CACHE_AFTER_UPVOTE) {
                    await cachePost(postVotesAmount, existingPost, voteType);
                }

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

            const postVotesAmount = countPostVotes(existingPost);

            if (postVotesAmount >= CACHE_AFTER_UPVOTE) {
                await cachePost(postVotesAmount, existingPost, voteType);
            }

            return new Response("OK");
        }

        await db.postVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId: postId,
            }
        });

        const postVotesAmount = countPostVotes(existingPost);

        if (postVotesAmount >= CACHE_AFTER_UPVOTE) {
            await cachePost(postVotesAmount, existingPost, voteType);
        }

        return new Response("OK");

        // RECOUNT THE VOTES
        // const postVotesAmount1 = existingPost.postVotes.reduce(
        //     (acc, vote) => {
        //         if (vote.type === "UP") {
        //             return acc + 1;
        //         }
        //         if (vote.type === "DOWN") {
        //             return acc - 1;
        //         }
        //         return acc;
        //     }, 0
        // );

        // if (postVotesAmount >= CACHE_AFTER_UPVOTE) {
        //     const cachedPayload: CachedPost = {
        //         title: existingPost.title,
        //         content: JSON.stringify(existingPost.content),
        //         id: existingPost.id,
        //         authorUsername: existingPost.author.username ?? "",
        //         createdAt: existingPost.createdAt,
        //         currentPostVote: voteType
        //     };
        //
        //     await redis.hset(`post:${postId}`, cachedPayload);
        // }

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