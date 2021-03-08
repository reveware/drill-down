import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Populated, User } from '@drill-down/interfaces';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');

    constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

    async createUser(user: Omit<User, '_id'>): Promise<UserDocument> {
        try {
            const newUser = await this.userModel.create(user);
            this.logger.log(`New user created for ${user.email}`);
            return newUser;
        } catch (e) {
            if (e.code === 11000) {
                throw new HttpException(`User ${user.email} already exists`, HttpStatus.CONFLICT);
            }

            throw new HttpException(`ERROR creating user ${user.email}: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findUserByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email });
    }

    async findUserByUsername(username: string): Promise<UserDocument> {
        return this.userModel.findOne({ username });
    }

    public static filterSensitiveData(user: Populated<User>): Populated<User> {
        user.password = undefined;
        return user as Populated<User>;
    }
}
