import {Controller, Post, Body, Response, HttpStatus, HttpException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginAttemptDTO} from '../dto/LoginAttempt.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Response() response, @Body() loginAttempt: LoginAttemptDTO) {

        try {
            const result = await this.authService.validateUserByPassword(loginAttempt);
            if (result.isAuthorized) {
                return response.status(HttpStatus.OK).json(result as object);
            }
            return response.status(HttpStatus.UNAUTHORIZED);
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
