import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, Post, CountByTag } from '@drill-down/interfaces';
import { PostDocument } from './post.schema';
import { UserDocument } from 'src/user/user.schema';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { GetPostsFiltersDTO } from 'src/dto';

@Injectable()
export class PostService {
    constructor(@InjectModel('Post') private postModel: Model<PostDocument>) {}

    public async createPost(post: Post): Promise<PostDocument> {
        try {
            const newPost = await new this.postModel(post);
            return await newPost.save();
        } catch (e) {
            throw new HttpException(`ERROR creating ${post.type} Post: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getPosts(filters?: GetPostsFiltersDTO): Promise<PostDocument[]> {
        return this.postModel.find(filters as object);
    }

    public async getPostsByUser(user: UserDocument): Promise<PostDocument[]> {
        return this.postModel.find({ author: user.id });
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
}
