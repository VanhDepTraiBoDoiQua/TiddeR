import EmptyState from "@/components/message/EmptyState";
import Header from "@/components/message/conversation/Header";
import {db} from "@/lib/db";
import {getAuthSession} from "@/lib/auth";
import Body from "@/components/message/conversation/Body";
import MessageForm from "@/components/message/conversation/MessageForm";

interface ConversationPageProps {
    params: {
        conversationId: string;
    }
}

const ConversationPage = async ({params}: ConversationPageProps) => {

    const session = await getAuthSession();

    const conversation = await db.conversation.findFirst({
        where: {
            id: params.conversationId,
        },
        include: {
            conversationMembers: {
                include: {
                    user: true,
                }
            }
        }
    });

    const otherUser = conversation?.
        conversationMembers.find((
            {user}) => user.id !== session?.user.id
        )?.user;

    // TODO: GET MESSAGES
    const messages = [];

    if (!conversation) {
        return (
            <div className="lg:pl-64 h-full">
                <EmptyState/>
            </div>
        );
    }

    return (
        <div className="lg:pl-64 h-full absolute inset-0
            pt-20 lg:static lg:pt-0"
        >
            <div className="lg:ml-1 lg:-mr-16 -mt-4
             h-full rounded-2xl bg-zinc-200
             flex flex-col"
            >
                <Header otherUser={otherUser} />
                <Body />
                <MessageForm
                    conversationId={conversation.id}
                    userId = {session!.user.id}
                />
            </div>
        </div>
    );
};

export default ConversationPage;