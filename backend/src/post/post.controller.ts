import { Controller, Body, Post, Get, Response, HttpStatus, Param, HttpException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import * as _ from 'lodash';
import * as moment from 'moment';

import { CreatePostDTO, FindByUsernameDTO } from '../dto';
import { PostService } from './post.service';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { JWTUser } from 'src/shared/decorators';

@ApiTags('posts')
@Controller('posts')
@UseGuards(AuthGuard(['jwt']))
export class PostController {
    constructor(private postService: PostService, private userService: UserService) {}

    @Post()
    @ApiResponse({ status: HttpStatus.OK, description: 'Post created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error creating Post' })
    async createPost(@Response() res, @JWTUser() user, @Body() post: CreatePostDTO) {
        const stars = [];
        const newPost = await this.postService.createPost({
            ...post,
            author: user.id,
            stars,
            provider: null,
            providerId: null,
            createdAt: moment().unix(),
        });
        return res.status(HttpStatus.OK).json(newPost);
    }

    @Get(':username')
    @ApiResponse({ status: HttpStatus.OK, description: 'User posts retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found, so no Posts' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error retrieving Posts' })
    async getUserPosts(@Response() res, @Param() param: FindByUsernameDTO) {
        const user = await this.userService.findUserByUsername(param.username);

        if (!user) {
            throw new HttpException(`username ${param.username} not found, so no Posts.`, HttpStatus.NOT_FOUND);
        }

        const posts = await this.postService.getPostsByUser(user);

        return res.status(HttpStatus.OK).json(posts);
    }
}
