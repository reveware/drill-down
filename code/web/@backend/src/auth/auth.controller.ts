import { Controller, Post, Body, Response, HttpStatus, UnauthorizedException, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAttemptDTO } from '../shared/dto';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Response() response: express.Response, @Body() loginAttempt: LoginAttemptDTO) {
        const result = await this.authService.validateUserByPassword(loginAttempt);
        if (result.data.is_authorized) {
            return response.status(HttpStatus.OK).json(result);
        }
        throw new UnauthorizedException([result.data.message]);
    }

    @Get('tumblr')
    @UseGuards(AuthGuard(['tumblr']))
    async tumblr(@Request() request: express.Request, @Response() response: express.Response) {
        console.log('tumblr called with user', request.user);

        return response.status(HttpStatus.OK).json({ user: request.user });
    }

    @Get('tumblr/callback')
    @UseGuards(AuthGuard('tumblr'))
    async tumblrCallback(@Request() request: express.Request, @Response() response: express.Response) {
        // TODO: Should redirect user (?) how to handle subsequent request to tumblr (?) (https://trello.com/c/SqQLiajM)
        return response.status(HttpStatus.OK).json({ user: request.user });
    }
}
