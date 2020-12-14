import {
    Controller,
    Body,
    Param,
    Post,
    Get,
    Response,
    HttpStatus,
    HttpException,
    UseGuards,
    Query,
    Logger,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import * as multerS3 from 'multer-s3';
import * as _ from 'lodash';
import * as moment from 'moment';

import { GetPostsFiltersDTO, FindByUsernameDTO, CreatePhotoPostDTO } from '../dto';
import { PostService } from './post.service';
import { UserService } from 'src/user/user.service';
import { JwtUser } from 'src/shared/decorators';
import { User, Providers, PostTypes } from '@drill-down/interfaces';
import { UserDocument } from 'src/user/user.schema';

import { Configuration } from 'src/configuration';

@ApiTags('posts')
@Controller('posts')
@UseGuards(AuthGuard(['jwt']))
export class PostController {
    logger = new Logger('PostController');

    constructor(private postService: PostService, private userService: UserService) {}

    @Get()
    async getPosts(@Response() res, @JwtUser() user: User, @Query() params?: GetPostsFiltersDTO) {
        // class-validator DTO doesn't throw if additional fields are passed, manually validate filters.
        const allowedFilters = new Set(['tags', 'author', 'provider']);

        const filters = _.reduce(
            params,
            (accumulator, value, key) => {
                if (allowedFilters.has(key)) {
                    accumulator[key] = value;
                }
                return accumulator;
            },
            {}
        );

        if (_.isEmpty(filters)) {
            this.logger.warn(`user ${user.username} didn't passed valid filters, returning their posts`);
            const userPosts = await this.postService.getPosts({author: (user as UserDocument).id});
            return res.status(HttpStatus.OK).json(userPosts);
        }

        // TODO: Check if author is on friend list to be able to view their posts
        const posts = await this.postService.getPosts(filters);
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
    async createPhotoPost(@Response() res, @JwtUser() user, @Body() post: CreatePhotoPostDTO, @UploadedFiles() photos) {
        if (_.isEmpty(photos)) {
            throw new BadRequestException(['photos are required'], 'Validation Failed');
        }

        const newPost = await this.postService.createPost({
            type: PostTypes.PHOTO,
            author: user.id,
            body: {
                urls: photos.map((photo) => photo.location),
            },
            tags: (post.tags || '').split(','),
            description: post.description,
            provider: Providers.REVEWARE,
            stars: [],
            createdAt: moment().unix(),
        });
        return res.status(HttpStatus.OK).json(newPost);
    }

    @Get(':username')
    @ApiResponse({ status: HttpStatus.OK, description: 'User posts retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found, so no Posts' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error retrieving Posts' })
    async getUserPosts(@Response() res, @Param() param: FindByUsernameDTO) {
        const username = param.username;
        const user = await this.userService.findUserByUsername(username);

        if (!user) {
            throw new HttpException(`username ${username} not found, so no Posts.`, HttpStatus.NOT_FOUND);
        }

        const posts = await this.postService.getPosts({author: user.id});
        return res.status(HttpStatus.OK).json(posts);
    }
}
