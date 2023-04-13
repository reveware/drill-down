import { Prisma } from '@prisma/client';

const user = Prisma.validator<Prisma.UserArgs>()({});

const userWithComments = Prisma.validator<Prisma.UserArgs>()({
    include: { posts: true },
});

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export type Friendships = { pending: UserWithoutPassword[]; friends: UserWithoutPassword[] };
export type User = Prisma.UserGetPayload<typeof user>;
export type UserWithPosts = Prisma.UserGetPayload<typeof userWithComments>;
export type UserWithoutPassword = Omit<User, 'password'>;
