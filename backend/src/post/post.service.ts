import { Injectable,  Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post, CountByTag, Comment, Populated, User, PostTypes, Providers } from '@drill-down/interfaces';
import { PostDocument } from './post.schema';
import * as _ from 'lodash';
import { CreatePhotoPostDTO, GetPostsFiltersDTO } from 'src/dto';
import { CommentDocument } from './comment.schema';
import moment = require('moment');
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
    private logger = new Logger('PostService');
    private authorProperties = 'firstName lastName username avatar';

    constructor(
        @InjectModel('Post') private postModel: mongoose.Model<PostDocument>,
        @InjectModel('Comment') private commentModel: mongoose.Model<CommentDocument>
    ) {
        this.commentModel.createCollection();
    }

    public static isAuthor(post: PostDocument, user: Populated<User>): boolean {
        return mongoose.Types.ObjectId(post.author as string).equals(user._id);
    }


    private static getMongooseFilterQuery(user: Populated<User>, params: GetPostsFiltersDTO = {}): mongoose.FilterQuery<PostDocument> {

        if (_.isEmpty(params)) {
            // user didn't passed valid filters, return their posts
            return { author: user.id };
        }

        // class-validator DTO doesn't throw if additional fields are passed, manually validate filters.
        const allowedFilters = new Set(['_id', 'tags', 'author', 'provider']);


        const query = _.reduce(
            params,
            (accumulator, value, key) => {
                if (allowedFilters.has(key)) {
                    const search = `${value}`.split(',').map((item) => item.trim());
                    if(key == 'author') {
                        search.forEach((author)=> {                    
                            const isMySelf = mongoose.Types.ObjectId(user._id).equals(author);
                            
                            const isMyFriend = UserService.isValidFriendship(user, author);

                            if(!isMySelf || !isMyFriend) {
                                throw new ForbiddenException(`not allowed to see ${author} posts`);
                            }
                        });
                        
                    }

                    if (search.length > 1) {
                        accumulator[key] = { $in: search };
                    } else {
                        accumulator[key] = value; // TODO: check if this works, it might be setting as {tags: [sexy]}
                    }
                }
                return accumulator;
            },
            {}
        );

        console.log('mongoose post query', query);
        return query;
    }

    public async createPhotoPost(
        user: Populated<User>,
        post: CreatePhotoPostDTO,
        photos: string[],
        provider?: Providers
    ): Promise<Populated<Post>> {
        const newPost = await this.postModel.create({
            type: PostTypes.PHOTO,
            author: user.id,
            body: {
                urls: photos,
            },
            tags: (post.tags || '').split(','),
            description: post.description,
            provider: provider ?? Providers.REVEWARE,
            comments: [],
            stars: [],
            createdAt: moment().unix(),
        });

        return _.first(await this.getPosts(user, { _id: newPost._id }));
    }

    public async deletePostAndComments(postId: string, user: Populated<User>): Promise<void>{
        const session = await this.postModel.db.startSession();
        session.startTransaction();

        
        const post = await this.postModel.findById(postId);

        if(!post) {
            throw new NotFoundException(`cannot delete post id ${postId}`)
        }

        const isAuthor = PostService.isAuthor(post, user);

        if (!isAuthor) {
            throw new ForbiddenException(`User ${user.email} is not the author of post ${postId}`);
        }

        await this.postModel.deleteOne({ _id: postId });
        await this.commentModel.deleteMany({ postId });

        this.logger.log(`deleted post ${postId} by ${post.author}`);
    }

    public async getPosts(user: Populated<User>, params?: GetPostsFiltersDTO): Promise<Populated<Post>[]> {
        const query = PostService.getMongooseFilterQuery(user, params);       
        const posts = (await this.postModel
            .find(query)
            .sort('-createdAt')
            .populate('author', this.authorProperties)
            .populate({
                path: 'comments',
                model: 'Comment',
                limit: 50,
                populate: {
                    path: 'author',
                    model: 'User',
                    select: this.authorProperties,
                },
            })) as Populated<Post>[];

        return posts;
    }

    public async getPostsCountByTag(user: Populated<User>): Promise<CountByTag[]> {
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

    public async createComment(postId: string, comment: Omit<Comment, '_id'>): Promise<Populated<Comment>> {
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

            return (await newComment.populate('author', this.authorProperties).execPopulate()) as Populated<Comment>;
        } catch (e) {
            this.logger.error('ERROR creating comment: ', e.message);
            await session.abortTransaction();
            throw e;
        } finally {
            await session.endSession();
        }
    }
}