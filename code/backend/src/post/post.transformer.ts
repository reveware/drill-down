import { CountPerTag, PostOverview, PostDetail, PostContent, TimeBomb } from '@drill-down/interfaces';
import { UserTransformer } from 'src/user/user.transformer';
import {
    PostOverview as PrismaOverviewResult,
    PostDetail as PrismaDetailResult,
    Comment as PrismaCommentResult,
    TimeBomb as PrismaTimeBombResult,
} from 'src/shared/interfaces';
import * as _ from 'lodash';

export class PostTransformer {
    public static toPostOverview(post: PrismaOverviewResult): PostOverview {
        const content = {
            type: post.type,
            content: post.content as object,
        } as PostContent;

        return {
            id: post.id,
            description: post.description,
            ...content,
            created_at: post.created_at,
            updated_at: post.updated_at,
            author: UserTransformer.toUserOverview(post.author),
            like_count: post._count.likes,
            comment_count: post._count.comments,
            tags: post.tags,
        };
    }

    public static toPostDetail(post: PrismaDetailResult): PostDetail {
        const tagCount = _.reduce(
            post.tags,
            (acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            },
            {} as CountPerTag
        );

        const overview = PostTransformer.toPostOverview(post);

        const details = {
            likes: post.likes.map((l) => UserTransformer.toUserOverview(l.author)),
            comments: post.comments.map(PostTransformer.toComment),
        };

        return {
            ...overview,
            ...details,
            tag_count: tagCount,
        };
    }

    public static toComment(comment: PrismaCommentResult) {
        return {
            id: comment.id,
            author: UserTransformer.toUserOverview(comment.author),
            post_id: comment.post_id,
            message: comment.message,
            reply_to: comment.reply_to,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
        };
    }

    public static toTimeBomb(timebomb: PrismaTimeBombResult): TimeBomb {
        return {
            id: timebomb.id,

            author: UserTransformer.toUserOverview(timebomb.author),
            recipient: UserTransformer.toUserOverview(timebomb.recipient),
            content: timebomb.content as object,
            visible_at: timebomb.visible_at,
            created_at: timebomb.created_at,
            updated_at: timebomb.updated_at,
        };
    }
}
