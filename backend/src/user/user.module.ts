import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {MulterModule} from '@nestjs/platform-express';
import {UserService} from './user.service';
import {UserSchema} from './User.schema';
import * as multerS3 from 'multer-s3';
import {Configuration} from '../configuration';

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MulterModule.register({
            storage: multerS3(Configuration.getMulterConfig('users')),
        }),],
    providers: [UserService]
})
export class UserModule {
}
