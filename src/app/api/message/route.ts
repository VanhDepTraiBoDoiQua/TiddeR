import {db} from "@/lib/db";
import {z} from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);

    try {
        const {conversationId, limit, page} = z.object({
            limit: z.string(),
            page: z.string(),
            conversationId: z.string(),
        }).parse({
            limit: url.searchParams.get("limit"),
            page: url.searchParams.get("page"),
            conversationId: url.searchParams.get("conversationId"),
        });

        const messages = await db.message.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc"
            },
            include: {
                seenMessages: {
                    include: {
                        user: true,
                    }
                },
                user: true,
            },
            where: {
                conversationId: conversationId,
            }
        });

        return new Response(JSON.stringify(messages));
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                "Invalid request data passed", {status: 422}
            );
        }

        return new Response(
            "Could not fetch more messages", {status: 500}
        );
    }
}