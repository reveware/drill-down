import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from 'src/user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule, MulterModule, forwardRef(() => UserModule)],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
