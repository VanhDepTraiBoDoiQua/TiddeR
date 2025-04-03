import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {INFINITE_SCROLLING_PAGINATION_RESULTS} from "@/config";
import {notFound} from "next/navigation";
import MiniCreatePost from "@/components/community/MiniCreatePost";

interface CommunityPageProps {
    params: {
        slug: string;
    }
}

const CommunityPage = async ({params}: CommunityPageProps) => {

    const {slug} = params;

    const session = await getAuthSession();

    const community = await db.community.findFirst({
        where: {
            name: slug,
        },
        include: {
            posts: {
                include: {
                    author: true,
                    postVotes: true,
                    comments: true,
                    community: true,
                },

                take: INFINITE_SCROLLING_PAGINATION_RESULTS,
            },
        },
    });

    if (!community) {
        return notFound();
    }

    return (
        <>
            <h1 className="font-bold text-3xl md:text-4xl
                h-14"
            >
                t/{community.name}
            </h1>

            {/*MINI CREATE POST*/}
            <MiniCreatePost session={session}/>

            {/*TODO: SHOW POSTS IN USER FEED*/}

        </>
    );
};

export default CommunityPage;