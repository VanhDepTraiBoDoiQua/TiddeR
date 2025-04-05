import {FC, useRef} from 'react';
import {ExtendedPost} from "@/types/db";
import {formatTimeToNow} from "@/lib/utils";
import {MessageSquare} from "lucide-react";
import EditorOutput from "@/components/community/EditorOutput";

interface PostProps {
    post: ExtendedPost;
}

const Post: FC<PostProps> = ({post}) => {

    const postRef = useRef<HTMLDivElement>(null);

    return (
        <div className="rounded-md bg-white shadow">
            <div className="px-6 py-4 flex
                justify-between"
            >

                {/*TODO: ADD POST VOTE*/}

                <div className="w-0 flex-1">
                    <div className="max-h-40 mt-1 text-xs
                        text-gray-500"
                    >
                        {post.community.name ? (
                            <>
                                <a
                                    className="underline text-zinc-900 text-sm
                                        underline-offset-2"
                                    href={`/t/${post.community.name}`}
                                >
                                    t/{post.community.name}
                                </a>
                                <span className="px-1">•</span>
                            </>
                        ) : null}
                        <span>Posted by u/{post.author.name}</span>
                        {" "}
                        {formatTimeToNow(new Date(post.createdAt))}
                    </div>
                    <a
                        href={`/t/${post.community.name}/post/${post.id}`}
                    >
                        <h1 className="text-lg font-semibold py-2
                            leading-6 text-gray-900"
                        >
                            {post.title}
                        </h1>
                    </a>
                    <div
                        className="relative text-sm max-h-40
                            w-full overflow-clip"
                        ref={postRef}
                    >

                        <EditorOutput content={post.content}/>

                        {postRef.current?.clientHeight === 160 ? (
                            <div className="absolute bottom-0 left-0
                                h-24 w-full bg-gradient-to-t
                                from-white to-transparent"
                            />
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 z-20 text-sm
                p-4 sm:p-6"
            >
                <a
                    className="w-fit flex items-center
                        gap-2"
                    href={`/t/${post.community.name}`}
                >
                    <MessageSquare className="h-4 w-4"/>
                    {post.comments.length} comments
                </a>
            </div>
        </div>
    );
};

export default Post;