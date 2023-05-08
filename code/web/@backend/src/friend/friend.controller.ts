import express from 'express';
import { Controller, Get, Post, Put, Delete, UseGuards, Param, Response, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtUser } from 'src/shared/decorators';
import { FriendService } from './friend.service';

@Controller('friends')
export class FriendController {
    constructor(private friendService: FriendService) {}

    @Get('/:username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend list fetched succesfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error fetching friend list' })
    async getUserFriends(@Response() res: express.Response, @Param('username') username: string) {
        const result = await this.friendService.getUserFriends({ username });
        return res.status(HttpStatus.OK).json(result);
    }

    @Post(':username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend added successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error adding friend' })
    async addFriend(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const result = await this.friendService.addFriendship(user, {friend_username: username});
        return res.status(HttpStatus.OK).json(result);
    }

    @Put(':username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend approved successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error approving friend' })
    async acceptFriend(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const result = await this.friendService.addFriendship(user, {friend_username: username});
        return res.status(HttpStatus.OK).json(result);
    }

    @Delete(':username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend removed successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error removed friend' })
    async removeFriend(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const isRemoved = await this.friendService.deleteFriend(user, {friend_username: username});
        return res.status(HttpStatus.OK).json({ friendship_removed: isRemoved });
    }
}
