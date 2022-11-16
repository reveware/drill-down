import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from 'src/user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostSchema } from './post.schema';
import { CommentSchema } from './comment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Post', schema: PostSchema },
            { name: 'Comment', schema: CommentSchema },
        ]),
        UserModule,
        MulterModule,
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
