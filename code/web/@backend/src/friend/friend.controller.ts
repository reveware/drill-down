import express from 'express';
import { Controller, Get, Post, Put, Delete, UseGuards, Param, Response, HttpStatus, Query } from '@nestjs/common';
import { UserOverview as User } from '@drill-down/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { JwtUser } from 'src/shared/decorators';
import { FriendService } from './friend.service';
import { PaginateDTO } from 'src/shared/dto';
import { userInfo } from 'os';

@Controller('friends')
export class FriendController {
    constructor(private friendService: FriendService) {}

    @Get('/pending')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend list fetched succesfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching friend list' })
    async getPendingFriends(@Response() res: express.Response,@JwtUser() user: User, @Query() params: PaginateDTO) {
        const result = await this.friendService.getPendingFriends(user, {username: user.username});
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('/pending/:username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend added successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error adding friend' })
    async addFriendRequest(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const result = await this.friendService.addFriendRequest(user, {username});
        return res.status(HttpStatus.OK).json(result);
    }

    @Put('/pending/:username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend approved successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error approving friend' })
    async approveFriendRequest(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const result = await this.friendService.approveFriendRequest(user, {username});
        return res.status(HttpStatus.OK).json(result);
    }

    @Delete('/pending/:username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend removed successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error removed friend' })
    async rejectFriendRequest(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const result = await this.friendService.rejectFriendRequest(user, { username});
        return res.status(HttpStatus.OK).json(result);
    }


    @Get('/:username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend list fetched succesfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching friend list' })
    async getUserFriends(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const result = await this.friendService.getUserFriends(user, { username });
        return res.status(HttpStatus.OK).json(result);
    }


    @Delete('/:username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend removed successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error removed friend' })
    async removeFriend(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const result = await this.friendService.deleteFriend(user, { username});
        return res.status(HttpStatus.OK).json(result);
    }
}
