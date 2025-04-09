"use client"

import {FC, useRef} from 'react';
import {Post, PostVote, User} from "@prisma/client";
import {formatTimeToNow} from "@/lib/utils";
import {MessageSquare} from "lucide-react";
import EditorOutput from "@/components/community/EditorOutput";
import {PartialVote} from "@/types/db";
import PostVoteClient from "@/components/post-vote/PostVoteClient";

interface PostProps {
    communityName: string;
    post: Post & {
        author: User,
        postVotes: PostVote[],
    };
    commentsAmount: number;
    votesAmount: number;
    currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
                                 communityName,
                                 post,
                                 commentsAmount,
                                 votesAmount: _votesAmount,
                                 currentVote: _currentVote
                             }) => {

    const postRef = useRef<HTMLDivElement>(null);

    return (
        <div className="rounded-md bg-white shadow">
            <div className="px-6 py-4 flex
            justify-between"
            >

                {/*ADD POST VOTE*/}
                <PostVoteClient
                    postId={post.id}
                    initialVote={_currentVote?.type}
                    initialVotesAmount={_votesAmount}
                />

                <div className="w-0 flex-1">
                    <div className="max-h-40 mt-1 text-xs
                    text-gray-500"
                    >
                        {communityName ? (
                            <>
                                <a
                                    className="text-zinc-900 text-sm font-medium"
                                    href={`/t/${communityName}`}
                                >
                                    t/{communityName}
                                </a>
                                <span className="px-1">•</span>
                            </>
                        ) : null}
                        {formatTimeToNow(new Date(post.createdAt))}
                    </div>
                    <a
                        href={`/t/${communityName}/comments/${post.id}`}
                    >
                        <h1 className="text-2xl font-bold py-2
                        leading-6 text-gray-900"
                        >
                            {post.title}
                        </h1>
                    </a>
                    <div
                        className="relative text-sm max-h-40
                        w-full overflow-clip"
                        ref={postRef}
                    >

                        <EditorOutput content={post.content}/>

                        {postRef.current?.clientHeight === 160 ? (
                            <div className="absolute bottom-0 left-0
                            h-24 w-full bg-gradient-to-t
                            from-white to-transparent"
                            />
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 z-20 text-sm
            p-4 sm:p-6"
            >
                <a
                    className="w-fit flex items-center
                    gap-2"
                    href={`/t/${communityName}/comments/${post.id}`}
                >
                    <MessageSquare className="h-4 w-4"/>
                    {commentsAmount} comments
                </a>
            </div>
        </div>
    );
};

export default Post;