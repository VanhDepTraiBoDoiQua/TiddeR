import {Post, PostVote, User, VoteType} from "@prisma/client";
import {getAuthSession} from "@/lib/auth";
import {notFound} from "next/navigation";
import PostVoteClient from "@/components/post-vote/PostVoteClient";

interface PostVoteServerProps {
    postId: string;
    initialVotesAmount?: number;
    initialVotes?: VoteType | null;
    getData?: () => Promise<
        (Post & { postVotes: PostVote[], author: User }) | null
    >;
}

const PostVoteServer = async (
    {initialVotes, postId, initialVotesAmount, getData}: PostVoteServerProps
) => {

    const session = await getAuthSession();

    let _voteAmount = 0;
    let _currentVote: VoteType | null | undefined = undefined;

    if (getData) {
        const post = await getData();
        if (!post) {
            return notFound();
        }

        _voteAmount = post.postVotes.reduce((acc, vote) => {
            if (vote.type === "UP") {
                return acc + 1;
            }
            if (vote.type === "DOWN") {
                return acc - 1;
            }
            return acc;
        }, 0);

        _currentVote = post.postVotes.find(
            (vote) => vote.userId === session?.user.id
        )?.type;
    } else {
        _voteAmount = initialVotesAmount!;
        _currentVote = initialVotes;
    }

    return (
        <PostVoteClient
            postId={postId}
            initialVotesAmount={_voteAmount}
            initialVote={_currentVote}
        />
    );
};

export default PostVoteServer;