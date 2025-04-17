import {Comment, CommentVote, Community, Post, PostVote, SeenMessage, Subscription, User, Message} from "@prisma/client";

export type ExtendedPost = Post & {
    community: Community;
    postVotes: PostVote[];
    author: User;
    comments: Comment[];
};

export type PartialPostVote = Pick<PostVote, "type">;

export type ExtendedComment = Comment & {
    author: User;
    commentVotes: CommentVote[];
};

export type PartialCommentVote = Pick<CommentVote, "type">;

export type ExtendedCommunity = Community & {
    _count: Prisma.CommunityCountOutputType
};

export type ExtendedSubscription = Subscription & {
    community: ExtendedCommunity;
};

export type ExtendedMessage = Message & {
    seenMessages: ExtendedSeenMessage[];
}

export type ExtendedSeenMessage = SeenMessage & {
    user: User;
}