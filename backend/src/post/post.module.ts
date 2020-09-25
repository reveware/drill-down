import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post.schema';
import { PostController } from './post.controller';
import { UserModule } from 'src/user/user.module';
import { TagController } from './tag.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), UserModule],
    controllers: [PostController, TagController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
