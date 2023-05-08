import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Post, Prisma } from '@prisma/client';
import { CreatePhotoPost, CreateComment, GetPosts, GetPostDetail, DeletePost, PostTypes, CountPerTag } from '@drill-down/interfaces';
import { PostTransformer } from './post.transformer';

@Injectable()
export class PostService {
    private logger = new Logger('PostService');

    constructor(private prismaService: PrismaService) {}

    private static isAuthor(post: Post, user: User): boolean {
        return post.author_id === user.id;
    }

    private static getMeOrMyFriendsWhereQuery = (user: User): Prisma.PostWhereInput => ({
        OR: [
            { author_id: user.id },
            { author: { requested_friends: { some: { requester_id: user.id } } } },
            { author: { approved_friends: { some: { recipient_id: user.id } } } },
        ],
    });

    public async getPostDetail(user: User, postId: number): Promise<GetPostDetail.Response | null> {
        const where = PostService.getMeOrMyFriendsWhereQuery(user);

        const post = await this.prismaService.post.findFirst({
            where: {
                ...where,
                id: postId,
            },
            include: {
                author: true,
                likes: { select: { author: true } },
                comments: { include: { author: true } },
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        });

        if (post === null) {
            return null;
        }

        return {
            data: PostTransformer.toPostDetail(post),
        };
    }

    public async searchPostsForUser(user: User, params?: GetPosts.Request): Promise<GetPosts.Response> {
        const where = PostService.getMeOrMyFriendsWhereQuery(user);

        if (params?.author) {
            where.author!.username = params.author;
        }

        if (params?.tags) {
            const tags = params.tags.split(',').map((t) => t.trim());
            where.tags = {
                hasSome: tags,
            };
        }

        if (params?.id) {
            where.id = params.id;
        }

        const pageNumber = params?.page_number || 1;
        const pageSize = params?.page_size || 25;

        const skip = pageSize * (pageNumber - 1);

        const [posts, total] = await Promise.all([
            this.prismaService.post.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    author: true,
                    likes: { select: { author: true } },
                    comments: { include: { author: true } },
                    _count: { select: { likes: true, comments: true } },
                },
            }),
            this.prismaService.post.count({ where }),
        ]);

        const mappedPosts = posts.map(PostTransformer.toPostOverview);

        return {
            data: mappedPosts,
            page: pageNumber,
            total,
        };
    }

    public async createPhotoPost(user: User, post: CreatePhotoPost.Request, urls: string[]): Promise<CreatePhotoPost.Response> {
        const newPost = await this.prismaService.post.create({
            data: {
                type: PostTypes.PHOTO,
                author_id: +user.id,
                content: {
                    urls,
                },
                tags: post.tags,
                description: post.description,
            },
            include: {
                _count: true,
            },
        });

        return { data: PostTransformer.toPostOverview({ ...newPost, author: user }) };
    }

    public async createComment(user: User, postId: number, comment: CreateComment.Request): Promise<CreateComment.Response | null> {
        const where = PostService.getMeOrMyFriendsWhereQuery(user);
        where.id = postId;

        const post = await this.prismaService.post.findFirst({ where });

        if (!post) {
            return null;
        }

        const newComment = await this.prismaService.comment.create({
            data: {
                post_id: postId,
                author_id: user.id,
                ...comment,
            },
        });

        return { data: PostTransformer.toComment({ ...newComment, author: user }) };
    }

    public async deletePostAndComments(user: User, params: DeletePost.Request): Promise<DeletePost.Response> {
        const postId = +params.id;
        const post = await this.prismaService.post.findUnique({ where: { id: postId } });

        if (!post) {
            return { deleted: false };
        }

        if (!PostService.isAuthor(post, user)) {
            return { deleted: false };
        }

        const deletePost = this.prismaService.post.delete({ where: { id: postId } });
        const deleteComments = this.prismaService.comment.deleteMany({ where: { post_id: postId } });
        await this.prismaService.$transaction([deleteComments, deletePost]);

        this.logger.log(`deleted post ${postId} by ${user.username}`);

        return { deleted: true };
    }

    public async getPostByTagForUser(username: string): Promise<CountPerTag> {
        // TODO: use pagination
        const posts = await this.prismaService.post.findMany({ where: { author: { username } }, select: { tags: true } });

        const count = _.reduce(
            posts,
            (countPerTag, post) => {
                for (const tag of post.tags) {
                    countPerTag[tag] = (countPerTag[tag] || 0) + 1;
                }
                return countPerTag;
            },
            {} as CountPerTag
        );

        const tags = _.keys(count);
        const sorted = tags.sort((a, b) => count[b] - count[a]);

        const topTagsCount = sorted.slice(0, 10).reduce((countPerTag, tag) => {
            countPerTag[tag] = count[tag];
            return countPerTag;
        }, {} as CountPerTag);

        return topTagsCount;
    }
}
