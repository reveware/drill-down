import express from 'express';
import { Controller, Delete, HttpStatus, Param, Post, Put, UseGuards, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtUser } from 'src/shared/decorators';
import { FriendService } from './friend.service';


@Controller('friends')
export class FriendController {
    constructor(private friendService: FriendService) {}

    @Post(':username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend added successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error adding friend' })
    async addFriend(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const isRequestAdded = await this.friendService.addFriendship(user, username);
        return res.status(HttpStatus.OK).json({friendship_requested: isRequestAdded});
    }
    
    @Put(':username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend approved successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error approving friend' })
    async acceptFriend(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const isRequestAdded = await this.friendService.addFriendship(user, username);
        return res.status(HttpStatus.OK).json({friendship_approved: isRequestAdded});
    }

    @Delete(':username')
    @UseGuards(AuthGuard(['jwt']))
    @ApiResponse({ status: HttpStatus.OK, description: 'Friend removed successfuly' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error removed friend' })
    async removeFriend(@Response() res: express.Response, @JwtUser() user: User, @Param('username') username: string) {
        const isRemoved = await this.friendService.removeFriendship(user, username)
        return res.status(HttpStatus.OK).json({friendship_removed: isRemoved});
    }


}
