import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TumblrModule } from './providers/tumblr/tumblr.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Configuration } from './configuration';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { FriendModule } from './friend/friend.module';

const mongoDBConfig = Configuration.getMongoDBConfig();

@Module({
    imports: [AuthModule, UserModule, PostModule, TumblrModule, MongooseModule.forRoot(mongoDBConfig.uri, mongoDBConfig.options), PrismaModule, FriendModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
