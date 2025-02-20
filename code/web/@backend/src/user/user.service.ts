import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { CreateUser, GetUser, UserOverview } from '@drill-down/interfaces';
import { UserTransformer } from './user.transformer';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UniqueConstraintError } from 'src/shared/errors';
import { PostService } from 'src/post/post.service';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');

    constructor(private prismaService: PrismaService, private postService: PostService) {}

    private async isValidPassword(user: User, password: string) {
        try {
            return await bcrypt.compare(password, user.password);
        } catch (e) {
            this.logger.error(e.message);
            throw e;
        }
    }


    public async createUser(user: CreateUser.Request, avatarUrl: string): Promise<CreateUser.Response> {
        try {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
            
            const newUser = await this.prismaService.user.create({ data: {...user, avatar: avatarUrl} });
            const userOverview = UserTransformer.toUserOverview(newUser);

            this.logger.log(`New user created for ${user.email}`);
            return { data: userOverview };
        } catch (e) {
            this.logger.error('Error creating user', e.message);
            console.log('error code', e.code);
            if (e.code === 'P2002') {
                throw new UniqueConstraintError('user already exists');
            }
            throw e;
        }
    }

    public async findAllUsers(): Promise<Array<UserOverview>> {
        const users = await this.prismaService.user.findMany({});
        return users.map(UserTransformer.toUserOverview);
    }

    public async findUserById(id: number): Promise<UserOverview | null> {
        const user = await this.prismaService.user.findUnique({ where: { id } });
        if (user) {
            return UserTransformer.toUserOverview(user);
        }
        return null;
    }

    public async findUserByEmail(email: string): Promise<UserOverview | null> {
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (user) {
            return UserTransformer.toUserOverview(user);
        }
        return null;
    }

    public async findUserByUsername(username: string): Promise<UserOverview | null> {
        const user = await this.prismaService.user.findUnique({ where: { username } });
        if (user) {
            return UserTransformer.toUserOverview(user);
        }
        return null;
    }

    public async findUserDetails(username: string): Promise<GetUser.Response | null> {
        // TODO: does prisma have the concept of "scopes"
        const user = await this.prismaService.user.findUnique({
            where: { username },
            include: {
                posts: {
                    take: 50,
                    orderBy: { created_at: 'desc' },
                    include: { author: true, _count: { select: { likes: true, comments: true } } },
                },
                likes: {
                    include: { post: { include: { author: true, _count: { select: { likes: true, comments: true } } } } },
                },
                requested_friends: { take: 25, orderBy: { created_at: 'desc' }, include: { recipient: true } },
                approved_friends: { take: 25, orderBy: { created_at: 'desc' }, include: { requester: true } },
                created_time_bombs: { take: 25, orderBy: { created_at: 'desc' }, include: { author: true, recipient: true } },
                received_time_bombs: { take: 25, orderBy: { created_at: 'desc' }, include: { author: true, recipient: true } },
            },
        });

        if (user) {
            const postsByTag = await this.postService.getPostByTagForUser(username);
            return {data:  UserTransformer.toUserDetail(user, postsByTag)}
        }
        return null;
    }

    public async validateUserByPassword(email: string, password: string): Promise<UserOverview | null> {
        const user = await this.prismaService.findUserWithPasswordByEmail(email);

        if (user && (await this.isValidPassword(user, password))) {
            return UserTransformer.toUserOverview(user);
        }

        return null;
    }

    public async getUserLikes(username: string): Promise<any> {
        // TODO: implement (https://trello.com/c/RZCsyDOq)
    }

    public async likePost(user: User, postId: string): Promise<void> {
        // TODO: implement (https://trello.com/c/RZCsyDOq)
    }

    public async unlikePost(user: User, postId: string): Promise<void> {
        // TODO: implement (https://trello.com/c/RZCsyDOq)
    }
}
