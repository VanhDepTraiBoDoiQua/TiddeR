"use client"

import {FC, useEffect, useRef} from 'react';
import SingleMessage from "@/components/message/conversation/SingleMessage";
import {ExtendedMessage} from "@/types/db";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {INFINITE_SCROLLING_PAGINATION_RESULTS} from "@/config";
import axios from "axios";
import {useSocket} from "@/components/contexts/socket-provider";
import {useIntersection} from "@mantine/hooks";

interface BodyProps {
    initialMessages: ExtendedMessage[];
    conversationId: string;
}

const Body: FC<BodyProps> = ({initialMessages, conversationId}) => {

    const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ["messages", conversationId],
        queryFn: async ({pageParam = 1}) => {
            const query = `/api/message?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}&conversationId=${conversationId}`

            const {data} = await axios.get(query);
            return data as ExtendedMessage[];
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1;
        },
        initialData: {
            pages: [initialMessages],
            pageParams: [1]
        }
    });

    const messages = data?.pages.flatMap(
        (page) => page
    ) ?? initialMessages;

    const {socket} = useSocket();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        socket.emit("join", conversationId);

        const handleNewMessage = () => {
            queryClient.invalidateQueries(["messages", conversationId]);
        };

        socket.on("message", handleNewMessage);

        return () => {
            socket.off("message", handleNewMessage);
            socket.emit("leave", conversationId);
        };
    }, [socket, conversationId]);

    const lastMessageRef = useRef<HTMLElement>(null);

    const {ref, entry} = useIntersection({
        root: lastMessageRef.current,
        threshold: 1
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map(
                (message, index) => {
                    return (
                        <div
                            key={message.id}
                            ref={index === messages.length-1 ? ref : null}
                        >
                            <SingleMessage
                                message={message}
                            />
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default Body;