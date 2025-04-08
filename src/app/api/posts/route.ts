import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {z} from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);

    const session = await getAuthSession();

    let followedCommunityIds: string[] = [];

    if (session) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                community: true
            }
        });

        followedCommunityIds = followedCommunities.map(
            ({community}) => community.id
        );
    }

    try {
        const {communityName, limit, page} = z.object({
            limit: z.string(),
            page: z.string(),
            communityName: z.string().nullish().optional(),
        }).parse({
            limit: url.searchParams.get("limit"),
            page: url.searchParams.get("page"),
            communityName: url.searchParams.get("communityName"),
        });

        let whereClause = {};

        if (communityName) {
            whereClause = {
                community: {
                    name: communityName
                }
            };
        } else if (session) {
            whereClause = {
                community: {
                    id: {
                        in: followedCommunityIds
                    }
                }
            };
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: "desc"
            },
            include: {
                community: true,
                postVotes: true,
                author: true,
                comments: true,
            },
            where: whereClause
        });

        return new Response(JSON.stringify(posts));
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                "Invalid request data passed", {status: 422}
            );
        }

        return new Response(
            "Could not fetch more posts", {status: 500}
        );
    }
}