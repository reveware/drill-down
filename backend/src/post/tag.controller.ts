import { Controller, Get, HttpException, HttpStatus, Param, Response, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
// TODO: Move to a new Tag Module
@ApiTags('tags')
@Controller('tags')
@UseGuards(AuthGuard(['jwt']))
export class TagController {
    constructor(private postService: PostService, private userService: UserService) {}

    @Get(':username/count')
    @ApiResponse({ status: HttpStatus.OK, description: 'Aggregated count for post tags successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found, so no post count' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error retrieving tag count' })
    async getPostsCountByTag(@Response() res, @Param('username') username: string) {
        const user = await this.userService.findUserByUsername(username);

        if (!user) {
            throw new HttpException(`username ${username} not found, so no Posts.`, HttpStatus.NOT_FOUND);
        }

        const postsCountByTag = await this.postService.getPostsCountByTag(user);

        return res.status(HttpStatus.OK).json(postsCountByTag);
    }
}
