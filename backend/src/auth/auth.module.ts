import { Module } from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {Configuration} from '../configuration';
import {UserModule} from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtStrategy} from './strategies/jwt.strategy';
import {TumblrStrategy} from './strategies/tumblr.strategy';

const authConfig = Configuration.getAuthConfig();

@Module({
    imports:[
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: authConfig.jwt_secret,
            signOptions: {
                expiresIn: authConfig.jwt_expiration_seconds
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, TumblrStrategy]
})
export class AuthModule {}
