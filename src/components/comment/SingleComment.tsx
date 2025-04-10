"use client"

import {FC, useRef, useState} from 'react';
import UserAvatar from "@/components/navbar/UserAvatar";
import {ExtendedComment, PartialCommentVote} from "@/types/db";
import {formatTimeToNow} from "@/lib/utils";
import CommentVotes from "@/components/comment-vote/CommentVotes";
import {Button} from "@/components/ui/Button";
import {MessageSquare} from "lucide-react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {Label} from "@/components/ui/Label";
import {Textarea} from "@/components/ui/TextArea";
import {useMutation} from "@tanstack/react-query";
import {CommentRequest} from "@/lib/validators/comment";
import axios, {AxiosError} from "axios";
import {toast} from "@/hooks/use-toast";
import {useCustomToast} from "@/hooks/use-custom-toast";

interface SingleCommentProps {
    comment: ExtendedComment;
    votesAmount: number;
    currentVote?: PartialCommentVote;
    postId: string;
}

const SingleComment: FC<SingleCommentProps> = ({comment, postId, votesAmount, currentVote}) => {

    const commentRef = useRef<HTMLDivElement>();

    const router = useRouter();

    const [isReplying, setIsReplying] = useState<boolean>(false);

    const [input, setInput] = useState<string>("");

    const {loginToast} = useCustomToast();

    const {data: session} = useSession();

    const {mutate: reply, isLoading} = useMutation({
        mutationFn: async ({postId, text, replyToId}: CommentRequest) => {
            const payload: CommentRequest = {
                postId: postId,
                text: text,
                replyToId: replyToId,
            };

            const {data} = await axios.post(`/api/community/post/comment`, payload);
            return data;
        },

        onError: (error: Error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    return toast({
                        title: "Invalid comment request.",
                        description: "Invalid comment request.",
                        variant: "destructive"
                    });
                }

                if (error.response?.status === 401) {
                    return loginToast();
                }
            }

            toast({
                title: "There was an error.",
                description: "Could not create comment, please try again later.",
                variant: "destructive"
            });
        },

        onSuccess: () => {
            router.refresh();
            setInput("");
        }
    });

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
            <div className="flex gap-2 items-center
                flex-wrap"
            >

                {/*COMMENT VOTE*/}
                <CommentVotes
                    commentId={comment.id}
                    initialVotesAmount={votesAmount}
                    initialVote={currentVote?.type}
                />

                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                        if (!session) {
                            return router.push("/sign-in");
                        }
                        setIsReplying(true);
                    }}
                >
                    <MessageSquare className="h-4 w-4 mr-1.5"/>
                    Reply
                </Button>
                {isReplying ? (
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="comment">
                            Your comment
                        </Label>
                        <div className="mt-2">
                            <Textarea
                                id="comment"
                                rows={1}
                                placeholder="Write a comment..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <div className="mt-2 flex justify-end
                                gap-2"
                            >
                                <Button
                                    tabIndex={-1}
                                    variant="subtle"
                                    onClick={() => {
                                        setIsReplying(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    disabled={input.length === 0}
                                    onClick={() => reply({
                                        postId,
                                        text: input,
                                        replyToId: comment.replyToId ?? comment.id
                                    })}
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SingleComment;