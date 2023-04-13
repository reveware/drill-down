import { Module, forwardRef } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [PrismaModule, forwardRef(()=> UserModule)],
    providers: [FriendService],
    controllers: [FriendController],
    exports: [FriendService]
    
})
export class FriendModule {}
