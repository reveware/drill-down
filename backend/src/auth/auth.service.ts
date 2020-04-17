import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as _ from 'lodash';
import {UserService} from '../user/user.service';
import {LoginAttemptDTO} from '../dto';

import {Configuration} from '../configuration';
import {User, JwtPayload} from '../../../types';

interface AuthResponse {
    isAuthorized: boolean;
    message: string;
    token: string | null,
}

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly  jwtService: JwtService) {}

    public async validateUserByPassword(loginAttempt: LoginAttemptDTO): Promise<AuthResponse> {
        const user = await this.userService.findUserByEmail(loginAttempt.email);

        if (_.isNil(user)) {
            return {isAuthorized: false, message: `User not found for ${loginAttempt.email}`, token: null,}
        }

        if (await user.isValidPassword(loginAttempt.password)) {
            return {
                isAuthorized: true,
                message: 'Login successful',
                token: this.generateTokenFromPayload({
                    user: UserService.filterSensitiveData(user),
                })
            }
        }

        return {isAuthorized: false, message: 'Wrong password', token: null,}

    }

    public async validateUserByJwt(payload: JwtPayload): Promise<User> {
        const {email} = payload.user;
        return this.userService.findUserByEmail(email);
    }

    private generateTokenFromPayload(payload: JwtPayload) : string {
        const expiresIn = Configuration.getAuthConfig().jwt_expiration_seconds;
        return this.jwtService.sign(payload, {expiresIn})
    }
}
