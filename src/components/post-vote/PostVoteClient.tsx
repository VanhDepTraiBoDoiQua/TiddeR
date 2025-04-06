"use client"

import {FC, useEffect, useState} from 'react';
import {VoteType} from "@prisma/client";
import {useCustomToast} from "@/hooks/use-custom-toast";
import {usePrevious} from "@mantine/hooks";
import {Button} from "@/components/ui/Button";
import {ArrowBigDown, ArrowBigUp} from "lucide-react";
import {cn} from "@/lib/utils";
import {useMutation} from "@tanstack/react-query";
import {PostVoteRequest} from "@/lib/validators/vote";
import axios from "axios";

interface PostVoteClientProps {
    postId: string;
    initialVotesAmount: number;
    initialVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClientProps> = ({initialVote, initialVotesAmount, postId}) => {

    const {loginToast} = useCustomToast();

    const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);

    const [currentVote, setCurrentVote] = useState(initialVote);

    const prevVote = usePrevious(currentVote);

    const {} = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId: postId,
                voteType: voteType,
            };

            await axios.patch("/api/community/post/vote", payload);
        }
    })

    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote]);

    return (
        <div className="flex sm:flex-col gap-4
            sm:gap-0 pr-6 sm:w-20
            pb-4 sm:pb-0"
        >
            <Button
                size="sm"
                variant="ghost"
                aria-label="upvote"
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 text-zinc-700", {
                        "text-emerald-500 fill-emerald-500": currentVote === "UP"
                    })}
                />
            </Button>
            <p className="text-center py-2 font-medium
                text-sm text-zinc-900"
            >
                {votesAmount}
            </p>
            <Button
                size="sm"
                variant="ghost"
                aria-label="upvote"
            >
                <ArrowBigDown
                    className={cn("h-5 w-5 text-zinc-700", {
                        "text-red-500 fill-red-500": currentVote === "DOWN"
                    })}
                />
            </Button>
        </div>
    );
};

export default PostVoteClient;