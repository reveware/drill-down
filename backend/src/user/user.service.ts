import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../interfaces';
import { CreateUserDTO } from '../dto';
import { UserDocument } from './User.schema';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');

    constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

    async createUser(user: CreateUserDTO, avatar: any): Promise<UserDocument> {
        try {
            const newUserModel = await new this.userModel({ ...user, avatar });
            const newUser = await newUserModel.save();
            this.logger.log(`New user created for ${user.email}`);
            return newUser;
        } catch (e) {
            if (e.code === 11000) {
                throw new HttpException('User already exists', HttpStatus.CONFLICT);
            }

            throw new HttpException(`ERROR creating user: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findUserByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email });
    }

    public static filterSensitiveData(user: User): User {
        user.password = undefined;
        return user;
    }
}
