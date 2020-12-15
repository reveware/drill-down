import { Injectable, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, CountByTag, Comment } from '@drill-down/interfaces';
import { PostDocument } from './post.schema';
import { UserDocument } from 'src/user/user.schema';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { GetPostsFiltersDTO } from 'src/dto';
import { CommentDocument } from './comment.schema';

@Injectable()
export class PostService {
    private logger = new Logger('PostService');
    constructor(
        @InjectModel('Post') private postModel: Model<PostDocument>,
        @InjectModel('Comment') private commentModel: Model<CommentDocument>
    ) {
        this.commentModel.createCollection();
    }

    public async createPost(post: Post): Promise<PostDocument> {
        try {
            const newPost = new this.postModel(post);
            return await newPost.save();
        } catch (e) {
            throw new HttpException(`ERROR creating ${post.type} Post: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getPosts(filters?: mongoose.FilterQuery<PostDocument>): Promise<PostDocument[]> {
        const authorProperties = 'firstName lastName username avatar';
        return this.postModel
            .find(filters)
            .sort('-createdAt')
            .populate('author', authorProperties)
            .populate({
                path: 'comments',
                model: 'Comment',
                limit: 50,
                populate: {
                    path: 'author',
                    model: 'User',
                    select: authorProperties,
                },
            });
    }

    public async getPostsCountByTag(user: UserDocument): Promise<CountByTag[]> {
        return new Promise(async (resolve, reject) => {
            return await this.postModel.aggregate(
                [
                    { $match: { author: mongoose.Types.ObjectId(user.id) } },
                    { $project: { tags: true } },
                    { $unwind: '$tags' },
                    { $sortByCount: '$tags' },
                ],
                (err, result) => {
                    if (err) {
                        reject(err);
                    }

                    const postsCountByTag = _.map(result, (doc): CountByTag => ({ tag: `${doc._id}`, count: doc.count }));

                    return resolve(postsCountByTag);
                }
            );
        });
    }

    public async createComment(postId: string, comment: Comment): Promise<CommentDocument> {
        // Use transaction to avoid orphan comments
        const session = await this.postModel.db.startSession();
        session.startTransaction();

        try {
            const [newComment] = await this.commentModel.create([comment], { session: session });
            const updatedPost = await this.postModel.findOneAndUpdate(
                { _id: postId },
                { $push: { comments: newComment._id } },
                { session: session }
            );

            if (!updatedPost) {
                throw new NotFoundException([], 'Post not found for commenting');
            }

            await session.commitTransaction();

            return newComment;
        } catch (e) {
            this.logger.error('ERROR creating comment: ', e.message);
            await session.abortTransaction();
            throw e;
        } finally {
            await session.endSession();
        }
    }

    public getMongooseFilterQuery(params: GetPostsFiltersDTO): mongoose.FilterQuery<PostDocument> {
        // class-validator DTO doesn't throw if additional fields are passed, manually validate filters.
        const allowedFilters = new Set(['_id', 'tags', 'author', 'provider']);
        const query = _.reduce(
            params,
            (accumulator, value, key) => {
                if (allowedFilters.has(key)) {
                    const search = value.split(',').map((item) => item.trim());
                    if (search.length > 1) {
                        accumulator[key] = { $in: search };
                    } else {
                        accumulator[key] = value;
                    }
                }
                return accumulator;
            },
            {}
        );

        return query;
    }
}
