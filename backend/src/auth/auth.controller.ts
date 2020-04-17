import { Controller, Post, Body, Response, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAttemptDTO } from '../dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Response() response, @Body() loginAttempt: LoginAttemptDTO) {
        const result = await this.authService.validateUserByPassword(loginAttempt);
        if (result.isAuthorized) {
            return response.status(HttpStatus.OK).json(result as object);
        }
        throw new UnauthorizedException([result.message]);
    }
}
