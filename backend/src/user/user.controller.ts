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
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { CreateUserDTO, FindByEmailDTO } from '../dto';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @ApiResponse({ status: HttpStatus.OK, description: 'User created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error creating user' })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User already exists' })
    @UseInterceptors(FileInterceptor('avatar'))
    async createUser(@Response() res, @UploadedFile() avatar, @Body() user: CreateUserDTO) {
        // FileUploads are not validated in the Pipe
        const avatarS3Location = _.get(avatar, 'location');
        if (_.isNil(avatar) || _.isNil(avatarS3Location)) {
            throw new BadRequestException(['avatar photo is required'], 'Validation Failed');
        }
        const newUser = await this.userService.createUser(user, avatarS3Location);
        return res.status(HttpStatus.OK).json({ user: UserService.filterSensitiveData(newUser) } as object);
    }

    @Get(':email')
    @ApiResponse({ status: HttpStatus.OK, description: 'User fetched successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching user' })
    async findUserByEmail(@Response() res, @Param() params: FindByEmailDTO) {
        const user = await this.userService.findUserByEmail(params.email);
        if (_.isNil(user)) {
            throw new NotFoundException(['User not found']);
        }
        return res.status(HttpStatus.OK).json({ user: UserService.filterSensitiveData(user) } as object);
    }
}
