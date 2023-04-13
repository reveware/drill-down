import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from 'src/dto';
import { User } from '@prisma/client';
import { UserWithoutPassword } from 'src/shared/interfaces';
import { UniqueConstraintError } from 'src/shared/errors';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');

    constructor(private prismaService: PrismaService) {}

    private async isValidPassword(user: User, password: string) {
        try {
            return await bcrypt.compare(password, user.password);
        } catch (e) {
            this.logger.error(e.message);
            throw e;
        }
    }



    public static isValidFriendship(user: any, stranger: string): boolean {
        const friends = new Set(user.friends as string[]);
        return friends.has(stranger);
    }

    public async createUser(user: CreateUserDTO): Promise<UserWithoutPassword> {
        try {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
            const newUser = await this.prismaService.user.create({ data: user });
            this.logger.log(`New user created for ${user.email}`);
            return newUser;
        } catch (e) {
            this.logger.error('Error creating user', e.message);
            console.log('error code', e.code);
            if (e.code === 'P2002') {
                throw new UniqueConstraintError('user already exists');
            }
            throw e;
        }
    }

    public async findAllUsers(): Promise<Array<UserWithoutPassword>> {
        return await this.prismaService.user.findMany({});
    }

    public async findUserById(id: number): Promise<UserWithoutPassword | null> {
        return await this.prismaService.user.findUnique({ where: { id } });
    }

    public async findUserByEmail(email: string): Promise<UserWithoutPassword | null> {
        return await this.prismaService.user.findUnique({ where: { email } });
    }

    public async findUserByUsername(username: string): Promise<UserWithoutPassword | null> {
        return await this.prismaService.user.findUnique({ where: { username }, include: { friends: true } });
    }

    public async validateUserByPassword(email: string, password: string): Promise<UserWithoutPassword | null> {
        const user = await this.prismaService.findUserWithPasswordByEmail(email);

        if (user && (await this.isValidPassword(user, password))) {
            return user;
        }

        return null;
    }

    public async getUserLikes(username: string): Promise<any> {
        // TODO: implement
    }

    public async likePost(user: User, postId: string): Promise<void> {
        // TODO: implement
    }

    public async unlikePost(user: User, postId: string): Promise<void> {
        // TODO: implement
    }

}
