"use client"

import {FC, useState} from 'react';
import {User} from "@prisma/client";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {ConversationRequest} from "@/lib/validators/conversation";
import {toast} from "@/hooks/use-toast";
import {useCustomToast} from "@/hooks/use-custom-toast";
import UserAvatar from "@/components/navbar/UserAvatar";

interface UserBoxProps {
    user: User;
}

const UserBox: FC<UserBoxProps> = ({user}) => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {loginToast} = useCustomToast();

    const {mutate: conversation} = useMutation({
        mutationFn: async ({userId, isGroup, members, name}: ConversationRequest) => {
            setIsLoading(true);

            const payload: ConversationRequest = {
                userId: userId,
                isGroup: isGroup ?? false,
                name: name ?? "",
                members: members,
            };

            const {data} = await axios.post("/api/conversation", payload);

            setIsLoading(false);

            return data;
        },

        onSuccess: (data) => {
            router.push(`/message/${data.id}`);
        },

        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    return toast({
                        title: "Invalid conversation request.",
                        description: "Invalid conversation request.",
                        variant: "destructive"
                    });
                }

                if (error.response?.status === 401) {
                    return loginToast();
                }
            }

            toast({
                title: "There was an error.",
                description: "Please try again later.",
                variant: "destructive"
            });
        }
    })

    return (
        <div
            className="w-full relative flex
                items-center space-x-3
                p-3 hover:bg-zinc-50 rounded-lg
                transition cursor-pointer"
            onClick={() => conversation({
                userId: user.id,
                members: [user.id],
            })}
        >
            <UserAvatar user={{
                name: user.username,
                image: user.image
            }}/>
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-zinc-900">
                            {user.username}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBox;