import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {z} from "zod";
import {postValidator} from "@/lib/validators/post";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response(
                "Unauthorized", {status: 401}
            );
        }

        const body = await req.json();

        const {communityId, content, title} = postValidator.parse(body);

        const existedSubscription = await db.subscription.findFirst({
            where: {
                communityId: communityId,
                userId: session.user.id
            }
        });

        if (!existedSubscription) {
            return new Response(
                "Subscribe to post", {status: 400}
            );
        }

        await db.post.create({
            data: {
                title: title,
                content: content,
                communityId: communityId,
                authorId: session.user.id,
            }
        })

        return new Response("OK");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                error.message, {status: 422}
            );
        }

        return new Response(
            "Could not post to this community, please try again later.", {status: 500}
        );
    }
}