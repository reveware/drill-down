import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import { LoginAttemptDTO } from '../dto';
import { Configuration } from '../configuration';
import { JwtPayload, AuthResponse, UserOverview } from '@drill-down/interfaces';

@Injectable()
export class AuthService {
    private authConfig = Configuration.getAuthConfig();

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    public async validateUserByPassword(loginAttempt: LoginAttemptDTO): Promise<AuthResponse> {
        const user = await this.userService.validateUserByPassword(loginAttempt.email, loginAttempt.password);

        if (user) {
            return {
                is_authorized: true,
                message: 'Login successful',
                token: this.generateTokenFromPayload({ user }),
            };
        }

        return { is_authorized: false, message: 'Wrong email or password', token: null };
    }

    public async validateUserByJwt(payload: JwtPayload): Promise<UserOverview> {
        const { email } = payload.user;
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid JWT');
        }
        return user;
    }

    private generateTokenFromPayload(payload: Partial<JwtPayload>): string {
        const expiresIn = this.authConfig.jwt_expiration_seconds;
        return this.jwtService.sign(payload, { expiresIn });
    }
}
