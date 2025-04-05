import {Comment, Community, Post, PostVote, User} from "@prisma/client";

export type ExtendedPost = Post & {
    community: Community;
    postVotes: PostVote[];
    author: User;
    comments: Comment[];
};