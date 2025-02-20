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
import { UniqueConstraintError } from 'src/shared/errors';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

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
        // TODO: FileUploads are not validated in the Pipe (https://trello.com/c/ulc4CAww)
        const avatarS3Location = _.get(avatar, 'location');
        if (_.isNil(avatar) || _.isNil(avatarS3Location)) {
            throw new BadRequestException(['avatar photo is required'], 'Validation Failed');
        }

        try {
            const result = await this.userService.createUser(user, avatarS3Location);
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException(error);
            }

            throw new InternalServerErrorException(['Unknown error occurred']);
        }
    }

    @Get(':username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'User fetched successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching user' })
    async getUserDetails(@Response() res: express.Response, @Param('username') username: string) {
        const result = await this.userService.findUserDetails(username)

        if (_.isNil(result)) {
            throw new NotFoundException(['User not found']);
        }

        return res.status(HttpStatus.OK).json(result);
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
}
