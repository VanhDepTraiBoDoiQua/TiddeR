import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import SingleComment from "@/components/comment/SingleComment";
import CreateComment from "@/components/comment/CreateComment";

interface CommentsSectionProps {
    postId: string;
}

const CommentsSection = async ({postId}: CommentsSectionProps) => {

    const session = await getAuthSession();

    const comments = await db.comment.findMany({
        where: {
            postId: postId,
            replyToId: null,
        },
        include: {
            author: true,
            commentVotes: true,
            replies: {
                include: {
                    author: true,
                    commentVotes: true,
                }
            }
        }
    });

    return (
        <div className="flex flex-col gap-y-4
            mt-4"
        >
            <hr className="w-full h-px my-6"/>

            {/*CREATE COMMENT*/}
            <CreateComment postId={postId}/>

            <div className="flex flex-col gap-y-6
                mt-4"
            >
                {comments.filter(
                    (comment) => !comment.replyToId).map(
                    topLevelComment => {
                        const topLevelCommentVotesAmount = topLevelComment.commentVotes.reduce(
                            (acc, vote) => {
                                if (vote.type === "UP") {
                                    return acc + 1;
                                }
                                if (vote.type === "DOWN") {
                                    return acc - 1;
                                }
                                return acc;
                            }, 0
                        );

                        const topLevelCommentVote = topLevelComment.commentVotes.find(
                            (vote) => vote.userId === session?.user.id
                        );

                        return (
                            <div
                                key={topLevelComment.id}
                                className="flex flex-col"
                            >
                                <div className="mb-2">
                                    <SingleComment comment={topLevelComment}/>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

export default CommentsSection;