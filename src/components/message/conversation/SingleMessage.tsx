"use client"

import {ExtendedMessage} from "@/types/db";
import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import UserAvatar from "@/components/navbar/UserAvatar";
import {format} from "date-fns";
import Image from "next/image";

interface SingleMessageProps {
    message: ExtendedMessage;
}

const SingleMessage: React.FC<SingleMessageProps> = ({message}) => {

    const {data: session} = useSession();

    const isOwn = session?.user.id === message.userId;

    const seenList = message.seenMessages.filter(
        (seenMessage) => seenMessage.userId === session?.user.id
    ).map(
        (seenMessage) => seenMessage.user.username
    ).join(', ');

    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);

        // TODO: CREATE SEEN MESSAGE
    }, []);

    if (!ready) {
        return (
            <Loader2 className="m-auto animate-spin"/>
        );
    }

    return (
        <div className={"flex gap-3 p-4 "
            + (isOwn ? "justify-end" : "")}
        >
            <div className={(isOwn ? "order-2" : "")}>
                <UserAvatar user={{
                    name: session?.user.username,
                    image: session?.user.image,
                }}/>
            </div>
            <div className={"flex flex-col gap-2 "
                + (isOwn ? "items-end" : "")}
            >
                <div className={"flex items-center gap-1"}>
                    <div className="text-sm text-zinc-500">
                        {session?.user?.username}
                    </div>
                    <div className="text-xs text-zinc-400">
                        {format(new Date(message.createdAt), "p")}
                    </div>
                </div>
                <div className={"text-sm w-fit overflow-hidden "
                    + (isOwn ? "bg-sky-500 text-white " : " ")
                    + (message.image ? "rounded-md p-0" : "rounded-full py-2 px-3")}
                >
                    {message.image ? (
                        <Image
                            src={message.image}
                            alt={"image"}
                            height="288"
                            width={"288"}
                            className="object-cover cursor-pointer hover:scale-110
                                transition translate"
                        />
                    ) : (
                        <div>
                            {message.body}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleMessage;