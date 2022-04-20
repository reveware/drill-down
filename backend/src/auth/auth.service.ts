import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import { LoginAttemptDTO } from '../dto';

import { Configuration } from '../configuration';
import { JwtPayload, AuthResponse, User, Populated } from "@drill-down/interfaces";
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class AuthService {
    private authConfig = Configuration.getAuthConfig();

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    public async validateUserByPassword(loginAttempt: LoginAttemptDTO): Promise<AuthResponse> {
        const user = await this.userService.validateUserByPassword(loginAttempt.email, loginAttempt.password);

        if (user) {
            return {
                isAuthorized: true,
                message: 'Login successful',
                token: this.generateTokenFromPayload({user}),
            };
        }

        return { isAuthorized: false, message: 'Wrong email or password', token: null };
    }

    public async validateUserByJwt(payload: JwtPayload): Promise<Populated<User>> {
        const { email } = payload.user;
        return this.userService.findUserByEmail(email);
    }

    private generateTokenFromPayload(payload: Partial<JwtPayload>): string {
        const expiresIn = this.authConfig.jwt_expiration_seconds;
        return this.jwtService.sign(payload, { expiresIn });
    }
}
