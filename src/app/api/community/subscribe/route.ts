import {getAuthSession} from "@/lib/auth";
import {subscriptionValidators} from "@/lib/validators/community";
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
        const {communityId} = subscriptionValidators.parse(body);

        const existedSubscription = await db.subscription.findFirst({
            where: {
                communityId: communityId,
                userId: session.user.id
            }
        });

        if (existedSubscription) {
            return new Response(
                "You are already subscribed to this community", {status: 400}
            );
        }

        await db.subscription.create({
            data: {
                communityId: communityId,
                userId: session.user.id
            }
        })

        return new Response(communityId);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                error.message, {status: 422}
            );
        }

        return new Response(
            "Could not subscribe to this community", {status: 500}
        );
    }
}