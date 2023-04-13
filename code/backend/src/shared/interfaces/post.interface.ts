import { Prisma } from '@prisma/client';

const post = Prisma.validator<Prisma.PostArgs>()({});

export type Post = Prisma.PostGetPayload<typeof post>;

export enum PostTypes {
    PHOTO = 'PHOTO',
    QUOTE = 'QUOTE',
}

export type TagCount = {
    [tag: string]: number;
};
