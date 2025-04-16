import {z} from "zod";
import {getAuthSession} from "@/lib/auth";
import {conversationValidators} from "@/lib/validators/conversation";
import {db} from "@/lib/db";

export async function POST (req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response(
                "Unauthorized", {status: 401},
            );
        }

        const body = await req.json();

        const {userId, members, isGroup, name} = conversationValidators.parse(body);

        if (isGroup) {
            const newConversation = await db.conversation.create({
                data: {
                    name: name,
                    isGroup: isGroup,
                    createdBy: session.user.id,
                }
            });

            const allMemberIds = [...members, session.user.id];

            await db.conversationMember.createMany({
                data: allMemberIds.map((memberId) => ({
                    userId: memberId,
                    conversationId: newConversation.id,
                })),
            });

            return new Response(JSON.stringify(newConversation));
        }

        const existedConversation = await db.conversation.findFirst({
            where: {
                isGroup: isGroup,
                AND: [
                    {
                        conversationMembers: {
                            some: {
                                userId: session.user.id,
                            }
                        },
                    },
                    {
                        conversationMembers: {
                            some: {
                                userId: userId,
                            }
                        },
                    },
                ],
            },
            include: {
                conversationMembers:true
            }
        });

        if (existedConversation) {
            return new Response(JSON.stringify(existedConversation));
        }

        const newConversation = await db.conversation.create({
            data: {
                isGroup: isGroup,
                conversationMembers: {
                    create: [
                        {userId: session.user.id},
                        {userId: userId},
                    ],
                },
            },
        });

        return new Response(JSON.stringify(newConversation));

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                "Invalid request data passed", {status: 422}
            );
        }

        return new Response(
            "Internal Error", {status: 500}
        );
    }
}