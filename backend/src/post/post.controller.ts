import {
    Controller,
    Body,
    Post,
    Get,
    Response,
    HttpStatus,
} from '@nestjs/common';
import {ApiTags, ApiResponse} from '@nestjs/swagger';
import * as _ from 'lodash';

import {CreatePostDTO } from '../dto';
import { PostService } from './post.service';

@ApiTags('posts')
@Controller('post')
export class PostController {

    constructor(private postService: PostService) { }

    @Post()
    @ApiResponse({status: HttpStatus.OK, description: 'Post created successfully'})
    @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error creating Post'})
    async createPost(@Response() res, @Body() post: CreatePostDTO) {

        // TODO: get author from jtw token, check if schema referencing works. (maybe create decorator)
        const author = 'rrriki';
        const stars = [];
        const newPost = await this.postService.createPost({...post, author, stars});
        return res.status(HttpStatus.OK).json(newPost);

    }
}
