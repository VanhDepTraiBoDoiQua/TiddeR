"use client"

import {FC, useRef} from 'react';
import {ExtendedPost} from "@/types/db";
import {useIntersection} from "@mantine/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {INFINITE_SCROLLING_PAGINATION_RESULTS} from "@/config";
import axios from "axios";
import {useSession} from "next-auth/react";
import Post from "@/components/community/Post";

interface PostFeedProps {
    initialPosts: ExtendedPost[];
    communityName?: string;
}

const PostFeed: FC<PostFeedProps> = ({initialPosts, communityName}) => {

    const {data: session} = useSession();

    const lastPostRef = useRef<HTMLElement>(null);

    const {ref, entry} = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    });

    const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ["infiniteQuery"],
        queryFn: async ({pageParam = 1}) => {
            const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`
                + (!!communityName ? `&communityName=${communityName}` : "");

            const {data} = await axios.get(query);
            return data as ExtendedPost[];
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1;
        },
        initialData: {
            pages: [initialPosts],
            pageParams: [1]
        }
    });

    const posts = data?.pages.flatMap(
        (page) => page
    ) ?? initialPosts;

    return (
        <ul className="flex flex-col col-span-2
            space-y-6"
        >
            {posts.map((post, index) => {
                const postVoteAmount = post.postVotes.reduce((acc, postVote) => {
                    if (postVote.type === "UP") {
                        return acc + 1;
                    }

                    if (postVote.type === "DOWN") {
                        return acc - 1;
                    }

                    return acc;
                }, 0);

                const currentPostVote = post.postVotes.find(
                    (vote) => vote.userId === session?.user.id
                );

                if (index === posts.length - 1) {
                    return (
                        <li
                            key={post.id}
                            ref={ref}
                        >
                            <Post
                                post={post}
                                commentsAmount={post.comments.length}
                                communityName={post.community.name}
                                currentVote={currentPostVote}
                                votesAmount={postVoteAmount}
                            />
                        </li>
                    );
                } else {
                    return (
                        <Post
                            key={post.id}
                            post={post}
                            commentsAmount={post.comments.length}
                            communityName={post.community.name}
                            currentVote={currentPostVote}
                            votesAmount={postVoteAmount}
                        />
                    );
                }
            })}
        </ul>
    );
};

export default PostFeed;