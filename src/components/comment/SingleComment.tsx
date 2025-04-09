"use client"

import {FC, useRef} from 'react';
import UserAvatar from "@/components/navbar/UserAvatar";
import {ExtendedComment} from "@/types/db";
import {formatTimeToNow} from "@/lib/utils";

interface SingleCommentProps {
    comment: ExtendedComment;
}

const SingleComment: FC<SingleCommentProps> = ({comment}) => {

    const commentRef = useRef<HTMLDivElement>();

    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <UserAvatar
                    user={{
                        name: comment.author.name || null,
                        image: comment.author.image || null,
                    }}
                    className="h-6 w-6"
                />
                <div className="ml-2 flex items-center
                    gap-x-2"
                >
                    <p className="text-sm font-medium text-gray-900">
                        u/{comment.author.username}
                    </p>
                    <p className="max-h-40 truncate text-xs
                        text-zinc-500"
                    >
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>
            <p className="text-sm text-zinc-900 mt-2">
                {comment.text}
            </p>
            <div className="flex gap-2 items-center">

                {/*TODO: COMMENT VOTE*/}

            </div>
        </div>
    );
};

export default SingleComment;