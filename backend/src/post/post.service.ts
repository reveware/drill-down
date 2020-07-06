import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../../interfaces';
import { PostDocument } from './post.schema';

@Injectable()
export class PostService {
    constructor(@InjectModel('Post') private postModel: Model<PostDocument>) {}

    public async createPost(post: Post): Promise<PostDocument> {
        try {
            const newPost = await new this.postModel(post);
            return await newPost.save();
        } catch (e) {
            throw new HttpException(`ERRROR creating ${post.type} post: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
