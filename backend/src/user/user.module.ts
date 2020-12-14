import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { UserController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MulterModule,
    ],
    controllers: [UserController],
    providers: [UserService, UserController],
    exports: [UserService],
})
export class UserModule {}
