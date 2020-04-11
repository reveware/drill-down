import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from '../../../types/User';
import {CreateUserDTO} from '../dto/CreateUser.dto';


@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async createUser(user: CreateUserDTO, profilePhoto: any): Promise<User> {
        const newUser = await new this.userModel({...user, profilePhoto: profilePhoto.location});
        return newUser.save();
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email});
    }


    public static filterSensitiveData(user: any): User{
        return user;
    }
}
