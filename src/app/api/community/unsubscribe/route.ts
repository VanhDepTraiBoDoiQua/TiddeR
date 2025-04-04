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

        if (!existedSubscription) {
            return new Response(
                "You are not subscribed to this community", {status: 400}
            );
        }

        const community = await db.community.findFirst({
            where: {
                id: communityId,
                creatorId: session.user.id
            }
        });

        if (community) {
            return new Response(
                "You cannot unsubscribe from your own community", {status: 400}
            );
        }

        await db.subscription.delete({
            where: {
                userId_communityId: {
                    userId: session.user.id,
                    communityId: communityId
                }
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
            "Could not unsubscribe to this community", {status: 500}
        );
    }
}