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
import * as moment from 'moment';

import { GetPostsFiltersDTO, CreatePhotoPostDTO, LeaveCommentDTO, FindByObjectId } from '../dto';
import { PostService } from './post.service';
import { JwtUser } from 'src/shared/decorators';
import { User, Populated } from '@drill-down/interfaces';

import { Configuration } from 'src/configuration';

@ApiTags('posts')
@Controller('posts')
@UseGuards(AuthGuard(['jwt']))
export class PostController {
    logger = new Logger('PostController');

    constructor(private postService: PostService) {}

    @Get()
    @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error retrieving Posts' })
    async getPosts(@Response() res, @JwtUser() user: Populated<User>, @Query() params?: GetPostsFiltersDTO) {       
        const posts = await this.postService.getPosts(user, params);
        return res.status(HttpStatus.OK).json(posts);
    }


    @Post('/photo')
    @ApiResponse({ status: HttpStatus.OK, description: 'Post created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error creating Post' })
    @UseInterceptors(
        FilesInterceptor('photos', undefined, {
            storage: multerS3(Configuration.getMulterConfig('posts/photos', ['png', 'jpg', 'jpeg', 'gif'])),
        })
    )
    async createPhotoPost(@Response() res, @JwtUser() user: Populated<User>, @Body() post: CreatePhotoPostDTO, @UploadedFiles() photos) {
        if (_.isEmpty(photos)) {
            throw new BadRequestException(['photos are required'], 'Validation Failed');
        }

        const photoUrls = photos.map((photo) => photo.location);
        const newPost = await this.postService.createPhotoPost(user, post, photoUrls);

        return res.status(HttpStatus.OK).json(newPost);
    }

    @Put('/:id/comments')
    @ApiResponse({ status: HttpStatus.OK, description: 'Comment created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error leaving comment' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found for commenting' })
    async leaveComment(@Response() res, @JwtUser() user: Populated<User>, @Body() comment: LeaveCommentDTO, @Param() params: FindByObjectId) {
        const { id } = params;
        const newComment = await this.postService.createComment(id, {
            author: user.id,
            postId: id,
            createdAt: moment().unix(),
            ...comment,
        });

        return res.status(HttpStatus.OK).json(newComment);
    }

    @Delete('/:id')
    async deletePost(@Response() res, @JwtUser() user: Populated<User>, @Param() params: FindByObjectId) {
        const {id} = params;
        await this.postService.deletePostAndComments(id, user);
        return res.status(HttpStatus.OK).json();
    }
}
