import {
    Controller,
    Body,
    Post,
    Get,
    Response,
    HttpStatus,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    NotFoundException,
    UseGuards,
    Put,
    Delete,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { CreateUserDTO } from '../dto';
import { Configuration } from 'src/configuration';
import { AuthGuard } from '@nestjs/passport';
import { JwtUser } from 'src/shared/decorators';
import express from 'express';
import { User } from '@prisma/client';
import { FriendService } from 'src/friend/friend.service';
import { UniqueConstraintError } from 'src/shared/errors';
import { PostService } from 'src/post/post.service';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService, private postService: PostService, private friendService: FriendService) {}

    @Post()
    @ApiResponse({ status: HttpStatus.OK, description: 'User created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error creating user' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User already exists' })
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: multerS3(Configuration.getMulterConfig('profile', ['png', 'jpg', 'jpeg'])),
        })
    )
    async createUser(@Response() res: express.Response, @UploadedFile() avatar: Express.MulterS3.File, @Body() user: CreateUserDTO) {
        // TODO: FileUploads are not validated in the Pipe
        const avatarS3Location = _.get(avatar, 'location');
        if (_.isNil(avatar) || _.isNil(avatarS3Location)) {
            throw new BadRequestException(['avatar photo is required'], 'Validation Failed');
        }

        try {
            const newUser = await this.userService.createUser({
                ...user,
                avatar: avatarS3Location,
            });
            return res.status(HttpStatus.OK).json({ user: newUser });
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException(error);
            }

            throw new InternalServerErrorException(['Unknown error occurred']);
        }
    }

    @Get(':usernameOrEmail')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'User fetched successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching user' })
    async findUserByUsernameOrEmail(@Response() res: express.Response, @Param('usernameOrEmail') usernameOrEmail: string) {
        let user = null;
        // TODO: move to @common to share with frontend
        const validEmailRegex = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

        const isValidEmail = validEmailRegex.test(usernameOrEmail);

        if (isValidEmail) {
            user = await this.userService.findUserByEmail(usernameOrEmail);
        } else {
            user = await this.userService.findUserByUsername(usernameOrEmail);
        }

        if (_.isNil(user)) {
            throw new NotFoundException(['User not found']);
        }

        return res.status(HttpStatus.OK).json({ user } as object);
    }

    @Get('/:username/friends')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend list fetched succesfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching friend list' })
    async getUserFriends(@Response() res: express.Response, @Param('username') username: string) {
        const friends = await this.friendService.getUserFriends(username);
        return res.status(HttpStatus.OK).json({ friends });
    }

    @Get('/:username/likes')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Likes list fetched succesfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching likes list' })
    async getUserLikes(@Response() res: express.Response, @Param('username') username: string) {
        const likes = await this.userService.getUserLikes(username);
        return res.status(HttpStatus.OK).json({ likes });
    }

    @Put('likes/:postId')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Post liked successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error starring post' })
    async starPost(@Response() res: express.Response, @JwtUser() user: User, @Param('postId') postId: string) {
        await this.userService.likePost(user, postId);
        return res.status(HttpStatus.OK).json({});
    }

    @Delete('likes/:postId')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Post unliked successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error unstarring post' })
    async unstarPost(@Response() res: express.Response, @JwtUser() user: User, @Param('postId') postId: string) {
        this.userService.unlikePost(user, postId);
        return res.status(HttpStatus.OK).json({});
    }

    @Get(':username/tags/count')
    @ApiResponse({ status: HttpStatus.OK, description: 'Aggregated count for post tags successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found, so no post count' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error retrieving tag count' })
    async findUserPotsCountByTag(@Response() res: express.Response, @Param('username') username: string) {
        const postsCountByTag = await this.postService.getPostsCountByTag(username);
        return res.status(HttpStatus.OK).json(postsCountByTag);
    }
}
