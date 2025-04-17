"use client"

import {FC} from 'react';
import SingleMessage from "@/components/message/conversation/SingleMessage";
import {ExtendedMessage} from "@/types/db";

interface BodyProps {
    initialMessages: ExtendedMessage[]
}

const Body: FC<BodyProps> = ({initialMessages}) => {

    // TODO: IMPLEMENT INFINITE QUERY
    const messages = initialMessages;

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map(
                (message, index) => {
                    return (
                        <div
                            key={message.id}
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