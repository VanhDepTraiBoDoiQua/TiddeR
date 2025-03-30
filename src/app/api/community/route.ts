import {getAuthSession} from "@/lib/auth";
import {communityValidators} from "@/lib/validators/community";
import {db} from "@/lib/db";
import {z} from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response(
                "Unauthorized", {status: 401}
            );
        }

        const body = await req.json();
        const {name} = communityValidators.parse(body);

        const existedCommunity = await db.community.findFirst({
            where: {
                name: name
            }
        });

        if (existedCommunity) {
            return new Response(
                "Community already exists", {status: 409}
            );
        }

        const newCommunity = await db.community.create({
            data: {
                name: name,
                creatorId: session.user.id
            }
        });


        await db.subscription.create({
            data: {
                userId: session.user.id,
                communityId: newCommunity.id
            }
        });

        return new Response(newCommunity.name);

    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return new Response(
                error.message, {status: 422}
            );
        }

        return new Response(
            "Could not create new community", {status: 500}
        );
    }
}