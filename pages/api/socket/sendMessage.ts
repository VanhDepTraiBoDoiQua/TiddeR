import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types/db";
import {messageValidator} from "@/lib/validators/message";
import {db} from "@/lib/db";
import {z} from "zod";

export default async function handler (req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {userId, conversationId, messageBody, messageImage} = messageValidator.parse(req.body);

        const sender = await db.user.findFirst({
            where: {
                id: userId,
            }
        });
        if (!sender) {
            return new Response(
                "Unauthorized", {status: 401},
            );
        }

        const newMessage = await db.message.create({
            data: {
                body: messageBody,
                image: messageImage,
                conversationId: conversationId,
                userId: userId,
                seenMessages: {
                    create: {
                        userId: userId,
                    }
                }
            },
        });

        await db.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
            }
        });

        const channelKey = `${conversationId}`;
        res?.socket?.server?.io?.to(channelKey)?.emit("message", newMessage);

        return res.status(200).json(newMessage);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json("Invalid request data passed");
        }

        return res.status(500).json("Internal Server Error");
    }
}