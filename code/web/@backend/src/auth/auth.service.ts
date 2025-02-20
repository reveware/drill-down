import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';

import { Configuration } from '../configuration';
import { JwtPayload, LoginAttempt, UserOverview } from '@drill-down/interfaces';
import { LogPerformance } from 'src/shared/decorators/LogPerformance';

@Injectable()
export class AuthService {
    private authConfig = Configuration.getAuthConfig();

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    @LogPerformance()
    public async validateUserByPassword(loginAttempt: LoginAttempt.Request): Promise<LoginAttempt.Response> {
        const user = await this.userService.validateUserByPassword(loginAttempt.email, loginAttempt.password);

        if (user) {
            return {
                data: { is_authorized: true, message: 'Login successful', token: this.generateTokenFromPayload({ user }) },
            };
        }

        return { data: { is_authorized: false, message: 'Wrong email or password', token: null } };
    }

    @LogPerformance()
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
