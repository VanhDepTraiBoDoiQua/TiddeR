"use client"

import {FC, useState} from 'react';
import {Label} from "@/components/ui/Label";
import {Textarea} from "@/components/ui/TextArea";
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import {CommentRequest} from "@/lib/validators/comment";
import axios, {AxiosError} from "axios";
import {toast} from "@/hooks/use-toast";
import {useCustomToast} from "@/hooks/use-custom-toast";
import {useRouter} from "next/navigation";

interface CreateCommentProps {
    postId: string;
    replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({replyToId, postId}) => {

    const [input, setInput] = useState<string>("");

    const {loginToast} = useCustomToast();

    const router = useRouter();

    const {mutate: comment, isLoading} = useMutation({
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
    })

    return (
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
                <div className="mt-2 flex justify-end">
                    <Button
                        isLoading={isLoading}
                        disabled={input.length === 0}
                        onClick={() => comment({postId, text: input, replyToId})}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateComment;