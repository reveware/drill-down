import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Post, Comment, Prisma } from '@prisma/client';
import { CreatePhotoPost, CreateComment, GetPosts, PostDetail, PostTypes, CountPerTag } from '@drill-down/interfaces';
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

    public async getPostDetail(user: User, postId: number): Promise<PostDetail | null> {
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

        return PostTransformer.toPostDetail(post);
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

    public async createPhotoPost(user: User, post: CreatePhotoPost.Request): Promise<CreatePhotoPost.Response> {
        const newPost = await this.prismaService.post.create({
            data: {
                type: PostTypes.PHOTO,
                author_id: +user.id,
                content: {
                    urls: post.photos,
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

    public async deletePostAndComments(user: User, postId: number): Promise<boolean> {
        const post = await this.prismaService.post.findUnique({ where: { id: postId } });

        if (!post) {
            return false;
        }

        if (!PostService.isAuthor(post, user)) {
            return false;
        }

        const deletePost = this.prismaService.post.delete({ where: { id: postId } });
        const deleteComments = this.prismaService.comment.deleteMany({ where: { post_id: postId } });
        this.prismaService.$transaction([deletePost, deleteComments]);

        this.logger.log(`deleted post ${postId} by ${user.username}`);

        return true;
    }

    public async getPostsCountByTag(username: string): Promise<CountPerTag> {
        const posts = await this.prismaService.post.findMany({ where: { author: { username } }, select: { tags: true } });

        const count = _.reduce(
            posts,
            (acc, curr) => {
                for (const tag of curr.tags) {
                    acc[tag] = (acc[tag] || 0) + 1;
                }
                return acc;
            },
            {} as CountPerTag
        );

        return count;
    }
}
