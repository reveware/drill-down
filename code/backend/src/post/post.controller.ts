import {
    Controller,
    Body,
    Param,
    Post,
    Get,
    Response,
    HttpStatus,
    UseGuards,
    Query,
    Logger,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
    Put,
    Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import * as multerS3 from 'multer-s3';
import * as _ from 'lodash';
import express from 'express';
import { GetPostsFiltersDTO, CreatePhotoPostDTO, CreateCommentDTO } from '../dto';
import { PostService } from './post.service';
import { JwtUser } from 'src/shared/decorators';

import { Configuration } from 'src/configuration';
import { User } from '@prisma/client';

@ApiTags('posts')
@Controller('posts')
@UseGuards(AuthGuard(['jwt']))
export class PostController {
    logger = new Logger('PostController');

    constructor(private postService: PostService) {}

    @Get()
    @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error retrieving Posts' })
    async getPosts(@Response() res: express.Response, @JwtUser() user: User, @Query() params?: GetPostsFiltersDTO) {       
        const posts = await this.postService.searchPostsForUser(user, params);
        return res.status(HttpStatus.OK).json(posts);
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, description: 'Post detail retrieved successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error retrieving Post detail' })
    async getPostDetaoñ(@Response() res: express.Response, @JwtUser() user: User, @Param('id') id: string) {       
        const post = await this.postService.getPostDetail(user, +id);
        return res.status(HttpStatus.OK).json(post);
    }

    @Post('/photo')
    @ApiResponse({ status: HttpStatus.OK, description: 'Post created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error creating Post' })
    @UseInterceptors(
        FilesInterceptor('photos', undefined, {
            storage: multerS3(Configuration.getMulterConfig('posts/photos', ['png', 'jpg', 'jpeg', 'gif'])),
        })
    )
    async createPhotoPost(@Response() res: express.Response, @JwtUser() user: User, @Body() post: CreatePhotoPostDTO, @UploadedFiles() photos: Express.MulterS3.File[]) {
        if (_.isEmpty(photos)) {
            throw new BadRequestException(['photos are required'], 'Validation Failed');
        }

        const photoUrls = photos.map((photo) => photo.location);
        const newPost = await this.postService.createPhotoPost(user, {...post, photos: photoUrls});

        return res.status(HttpStatus.OK).json(newPost);
    }

    @Put('/:id/comments')
    @ApiResponse({ status: HttpStatus.OK, description: 'Comment created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error leaving comment' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found for commenting' })
    async leaveComment(@Response() res: express.Response, @JwtUser() user: User, @Body() comment: CreateCommentDTO, @Param('id') postId: string) {
        const newComment = await this.postService.createComment(user, +postId, comment);
        return res.status(HttpStatus.OK).json(newComment);
    }



    @Delete('/:id')
    async deletePost(@Response() res: express.Response, @JwtUser() user: User, @Param('id') postId: number) {
        await this.postService.deletePostAndComments(user, postId);
        return res.status(HttpStatus.OK).json();
    }
}
