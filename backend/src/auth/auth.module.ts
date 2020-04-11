import { Module } from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {Configuration} from '../configuration';
import {UserModule} from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const authConfig = Configuration.getAuthConfig();

@Module({
    imports:[
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: authConfig.jwt_secret,
            signOptions: {
                expiresIn: 36000
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
