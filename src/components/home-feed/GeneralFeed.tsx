import {db} from "@/lib/db";
import {INFINITE_SCROLLING_PAGINATION_RESULTS} from "@/config";
import PostFeed from "@/components/community/PostFeed";

// const PostFeed = dynamic(
//     async () => (await import ("@/components/community/PostFeed")).default,
//     {ssr: false}
// );

const GeneralFeed = async () => {

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
    });

    return (
        <PostFeed initialPosts={posts}/>
    );
};

export default GeneralFeed;