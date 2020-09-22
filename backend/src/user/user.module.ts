import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import * as multerS3 from 'multer-s3';
import { Configuration } from '../configuration';
import { UserController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MulterModule.register({
            storage: multerS3(Configuration.getMulterConfig('users')),
        }),
    ],
    controllers: [UserController],
    providers: [UserService, UserController],
    exports: [UserService],
})
export class UserModule {}
