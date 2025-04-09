import {redis} from "@/lib/redis";
import {CachedPost} from "@/types/redis";
import {Post, PostVote, User} from "@prisma/client";
import {db} from "@/lib/db";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import {buttonVariants} from "@/components/ui/Button";
import {ArrowBigDown, ArrowBigUp, Loader2} from "lucide-react";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import {formatTimeToNow} from "@/lib/utils";
import EditorOutput from "@/components/community/EditorOutput";
import CommentsSection from "@/components/comment/CommentsSection";
import UserAvatar from "@/components/navbar/UserAvatar";

interface PostDetailPageProps {
    params: {
        postId: string;
        slug: string;
    }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const PostDetailPage = async ({params}: PostDetailPageProps) => {

    const cachedPost = await redis.hgetall(
        `posts:${params.postId}`
    ) as CachedPost;

    let post: (Post & {
        postVotes: PostVote[],
        author: User,
    }) | null = null;

    if (!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: params.postId,
            },
            include: {
                author: true,
                postVotes: true,
            },
        });
    }

    if (!post && !cachedPost) {
        return notFound();
    }

    return (
        <div>
            <div className="h-full flex flex-col
                md:flex-row items-center sm:items-start
                justify-between"
            >
                <Suspense fallback={<PostVoteShell/>}>
                    {/* @ts-expect-error server component */}
                    <PostVoteServer
                        postId={post?.id ?? cachedPost?.id}
                        getData={async () => {
                            return db.post.findUnique({
                                where: {
                                    id: params.postId,
                                },
                                include: {
                                    postVotes: true,
                                    author: true,
                                },
                            });
                        }}
                    />
                </Suspense>
                <div className="sm:w-0 w-full flex-1
                    bg-white p-4 rounded-sm"
                >
                    <div className="flex flex-row items-center">
                        <UserAvatar user={{
                            name: post?.author.name || null,
                            image: post?.author.image || null,
                        }}/>
                        <div className="ml-2">
                            <p className="max-h-40 mt-1 truncate
                                text-xs text-gray-500"
                            >
                                <a
                                    className="text-zinc-900 text-sm font-medium"
                                    href={`/t/${params.slug}`}
                                >
                                    t/{params.slug}
                                </a>
                                <span className="px-1">•</span>
                                {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.content))}
                            </p>
                            <p className="max-h-40 mt-1 truncate
                                text-xs text-gray-500"
                            >
                                {post?.author.username || cachedPost.authorUsername}
                            </p>
                        </div>
                    </div>
                    <h1 className="text-xl font-semibold py-2
                        leading-6 text-gray-900"
                    >
                        {post?.title ?? cachedPost.title}
                    </h1>
                    <EditorOutput content={post?.content ?? cachedPost.content}/>
                    <Suspense
                        fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500"/>}
                    >

                        {/*COMMENT SECTION*/}
                        {/* @ts-expect-error server component */}
                        <CommentsSection postId={params.postId}/>

                    </Suspense>
                </div>
            </div>
        </div>
    );
};

function PostVoteShell() {
    return (
        <div className="flex items-center flex-col
            pr-6 w-20"
        >
            <div className={buttonVariants({variant: "ghost"})}>
                <ArrowBigUp className="h-5 w-5 text-zinc-700"/>
            </div>
            <div className="text-center py-2 font-medium
                text-sm text-zinc-900"
            >
                <Loader2 className="h-3 w-3 animate-spin"/>
            </div>
            <div className={buttonVariants({variant: "ghost"})}>
                <ArrowBigDown className="h-5 w-5 text-zinc-700"/>
            </div>
        </div>
    );
}

export default PostDetailPage;