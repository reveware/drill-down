import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post.schema';
import { PostController } from './post.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
