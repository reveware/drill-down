import { Controller, Post, Body, Response, HttpStatus, UnauthorizedException, Get, UseGuards, Request, Logger, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAttemptDTO } from '../dto';
import { AuthResponse } from "@drill-down/interfaces";
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');

    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Response() response, @Body() loginAttempt: LoginAttemptDTO) {
        const result: AuthResponse = await this.authService.validateUserByPassword(loginAttempt);
        if (result.isAuthorized) {
            return response.status(HttpStatus.OK).json(result as object);
        }
        throw new UnauthorizedException([result.message]);
    }

    @Get('tumblr')
    @UseGuards(AuthGuard(['tumblr']))
    async tumblr(@Request() request, @Response() response) {
        console.log('tumblr called with user', request.user);

        return response.status(HttpStatus.OK).json({ user: request.user });
    }

    @Get('tumblr/callback')
    @UseGuards(AuthGuard('tumblr'))
    async tumblrCallback(@Request() request, @Response() response) {
        // TODO: Should redirect user (?) how to handle subsequent request to tumblr (?)
        return response.status(HttpStatus.OK).json({ user: request.user });
    }
}
