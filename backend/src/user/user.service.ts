import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Populated, Unpopulated, User } from '@drill-down/interfaces';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');

    constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

    public static isValidFriendship(user: Populated<User>, stranger: string): boolean{
        const friends = new Set(user.friends as  unknown as string[]);
        return friends.has(stranger);
    }

    public async createUser(user: Unpopulated<User>): Promise<Populated<User>> {
        try {
            const newUser = await this.userModel.create(user);
            this.logger.log(`New user created for ${user.email}`);
            return UserService.filterSensitiveData(newUser);
        } catch (e) {
            if (e.code === 11000) {
                throw new HttpException(`User ${user.email} already exists`, HttpStatus.CONFLICT);
            }

            throw new HttpException(`ERROR creating user ${user.email}: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async findUserByEmail(email: string): Promise<Populated<User>> {
        const user = await this.userModel.findOne({ email });
        return UserService.filterSensitiveData(user);
    }

    public async findUserByUsername(username: string): Promise<Populated<User>> {
        const user = await this.userModel.findOne({ username });
        return UserService.filterSensitiveData(user);
    }

    public async validateUserByPassword(email: string, password: string): Promise<Populated<User> | null>{
        const user = await this.userModel.findOne({ email });

        if(user && user.isValidPassword(password)) {
            return UserService.filterSensitiveData(user);
        }

        return null;
    }

    private static filterSensitiveData(user: UserDocument): Populated<User> {
        if(user) {
            user.password = undefined;
        }
        return user as Populated<User>;
    }

    
}
