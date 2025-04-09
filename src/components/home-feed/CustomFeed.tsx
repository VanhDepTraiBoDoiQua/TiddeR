import {db} from "@/lib/db";
import {INFINITE_SCROLLING_PAGINATION_RESULTS} from "@/config";
import PostFeed from "@/components/community/PostFeed";
import {getAuthSession} from "@/lib/auth";

const CustomFeed = async () => {

    const session = await getAuthSession();

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            community: true,
        }
    });

    const posts = await db.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            postVotes: true,
            author: true,
            comments: true,
            community: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
        where: {
            community: {
                name: {
                    in: followedCommunities.map(
                        ({community}) => community.id
                    ),
                },
            },
        },
    });

    return (
        <PostFeed initialPosts={posts}/>
    );
};

export default CustomFeed;