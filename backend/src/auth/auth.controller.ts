import {Controller, Post, Body, Response, HttpStatus, UnauthorizedException, Get, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginAttemptDTO} from '../dto';
import {AuthResponse} from '../../../interfaces';
import { TumblrGuard } from './guards/tumblr.guard';

@Controller('auth')
export class AuthController {
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
    @UseGuards(TumblrGuard)
    async tumblr(){
        console.log('tumblr called');
    }
    @Get('tumblr/callback')
    async tumblrCallback(@Response() response, @Body() body) {
        console.log('tumblr callback called');
    }
}
