import {Injectable} from '@nestjs/common';
import {LoginAttemptDTO} from '../dto/LoginAttempt.dto';
import {User} from '../../../types/User';
import {JwtService} from '@nestjs/jwt';
import * as _ from 'lodash';
import {UserService} from '../user/user.service';

interface AuthResponse {
    isAuthorized: boolean;
    user: User | null;
    message: string;
}

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly  jwtService: JwtService) {}

    async validateUserByPassword(loginAttempt: LoginAttemptDTO): Promise<AuthResponse> {

        const user = await this.userService.findUserByEmail(loginAttempt.email);

        if (_.isNil(user)) {
            return {isAuthorized: false, user: null, message: `User not found for ${loginAttempt.email}`}
        }

        if (await user.isValidPassword(loginAttempt.password)) {
            return {isAuthorized: true, user: UserService.filterSensitiveData(user), message: 'Login successful'}
        }

        return {isAuthorized: false, user: null, message: 'Wrong password'}

    }
}
