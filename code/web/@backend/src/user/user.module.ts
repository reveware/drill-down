import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { FriendModule } from 'src/friend/friend.module';
import { PostModule } from 'src/post/post.module';

@Module({
    imports: [PrismaModule, MulterModule, forwardRef(() => PostModule), forwardRef(() => FriendModule)],
    controllers: [UserController],
    providers: [UserService, UserController],
    exports: [UserService],
})
export class UserModule {}
