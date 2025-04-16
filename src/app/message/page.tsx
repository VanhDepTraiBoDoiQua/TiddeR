import {FC} from 'react';
import EmptyState from "@/components/message/EmptyState";

interface MessagePageProps {

}

const MessagePage: FC<MessagePageProps> = () => {

    return (
        <div className="hidden lg:block lg:pl-64 h-full">
            <EmptyState/>
        </div>
    );
};

export default MessagePage;