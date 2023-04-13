import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { CreateCommentDTO, CreatePhotoPostDTO, GetPostsFiltersDTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Post, Comment, Prisma } from '@prisma/client';
import { TagCount, PostTypes } from 'src/shared/interfaces';

@Injectable()
export class PostService {
    private logger = new Logger('PostService');

    constructor(private prismaService: PrismaService) {}

    private static isAuthor(post: Post, user: User): boolean {
        return post.author_id === user.id;
    }

    private static getMeOrMyFriendsWhereQuery = (user: User): Prisma.PostWhereInput => ({
        author: {
            OR: [
                { id: user.id },
                {
                    friends: {
                        some: {
                            user_id: user.id,
                        },
                    },
                },
            ],
        },
    });

    public async getPosts(user: User, params?: GetPostsFiltersDTO): Promise<Post[]> {
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

        return await this.prismaService.post.findMany({ where, skip, take: pageSize });
    }

    public async getPostDetails(user: User, postId: number): Promise<Post | null> {
        const where = PostService.getMeOrMyFriendsWhereQuery(user);
        where.id = postId;
        const post = await this.prismaService.post.findFirst({
            where,
            include: { author: true, comments: { include: { author: true } }, likes: { include: { author: true } } },
        });

        return post;
    }

    public async createPhotoPost(user: User, post: CreatePhotoPostDTO, photos: string[]): Promise<Post> {
        const newPost = await this.prismaService.post.create({
            data: {
                type: PostTypes.PHOTO,
                author_id: +user.id,
                content: {
                    urls: photos,
                },
                tags: post.tags,
                description: post.description,
            },
            include: { comments: true },
        });

        return newPost;
    }

    public async createComment(user: User, postId: number, comment: CreateCommentDTO): Promise<Comment | null> {
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

        return newComment;
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

    public async getPostsCountByTag(username: string): Promise<TagCount> {
        const posts = await this.prismaService.post.findMany({ where: { author: { username } }, select: { tags: true } });

        const count = _.reduce(
            posts,
            (acc, curr) => {
                for (const tag of curr.tags) {
                    acc[tag] = (acc[tag] || 0) + 1;
                }
                return acc;
            },
            {} as TagCount
        );

        return count;
    }
}
