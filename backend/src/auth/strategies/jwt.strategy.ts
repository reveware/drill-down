import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthService} from '../auth.service';
import {Configuration} from '../../configuration';
import {User, JwtPayload} from '../../../../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Configuration.getAuthConfig().jwt_secret,
        });
    }

    /**
     * The return value of this method will be attached to the request (by default under the property user)
     * @param payload - Decoded token payload
     */
    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.authService.validateUserByJwt(payload);

        if (user) {
            return user;
        }

        throw new UnauthorizedException();


    }
}
