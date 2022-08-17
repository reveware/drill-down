import { HttpException, HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Populated, Unpopulated, User } from '@drill-down/interfaces';
import { UserDocument } from './user.schema';
import { PostService } from 'src/post/post.service';
import _ = require('lodash');
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UserService implements OnModuleInit {
    private logger = new Logger('UserService');
    private postService: PostService;

    constructor(@InjectModel('User') private userModel: mongoose.Model<UserDocument>, private postModuleRef: ModuleRef) {}

    public onModuleInit() {
        // https://docs.nestjs.com/fundamentals/module-ref
        // This allows injecting PostService even with Circular Dependency 
        this.postService = this.postModuleRef.get(PostService, { strict: false });
    }

    public static isValidFriendship(user: Populated<User>, stranger: string): boolean {
        const friends = new Set((user.friends) as string[]);
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

    public async validateUserByPassword(email: string, password: string): Promise<Populated<User> | null> {
        const user = await this.userModel.findOne({ email });

        if (user && user.isValidPassword(password)) {
            return UserService.filterSensitiveData(user);
        }

        return null;
    }

    public async starPost(user: Populated<User>, postId: string): Promise<void> {
        const [post] = await this.postService.getPosts(user, { _id: postId });

        if (!post) {
            throw new NotFoundException();
        }

        await this.userModel.update({ _id: user._id }, { $addToSet: { starredPosts: mongoose.Types.ObjectId(postId) } });
    }

    public async unstarPost(user: Populated<User>, postId: string): Promise<void> {
        await this.userModel.update({ _id: user._id }, { $pull: { starredPosts: mongoose.Types.ObjectId(postId) } });
    }

    private static filterSensitiveData(user: UserDocument): Populated<User> {
        if (user) {
            user.password = undefined;
        }
        return user as Populated<User>;
    }
}
