import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module'
import { BlenderService } from './blender.service';
import { AssetsService } from './assets.service';

@Module({
    imports: [UserModule],
    providers: [BlenderService, AssetsService],
    exports: [],
})
export class BlenderModule {}
