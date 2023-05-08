import { Prisma } from '@prisma/client';

const postOverview = Prisma.validator<Prisma.PostArgs>()(
    {
        include: {
            author: true,
            _count: {
                select: { likes: true, comments: true },
            }
        },
    }
);

const postDetail = Prisma.validator<Prisma.PostArgs>()({
    include: {
        author: true,
        likes: { select: { author: true } },
        comments: { include: { author: true } },
        _count: {
            select: { likes: true, comments: true },
        }
    },
});

export type PostOverview = Prisma.PostGetPayload<typeof postOverview>;
export type PostDetail = Prisma.PostGetPayload<typeof postDetail>;

const comment = Prisma.validator<Prisma.CommentArgs>()({
    include: { author: true },
});

export type Comment = Prisma.CommentGetPayload<typeof comment>;

const timebomb = Prisma.validator<Prisma.TimeBombArgs>()({
    include: {
        author: true,
        recipient: true
    }
})
export type TimeBomb = Prisma.TimeBombGetPayload<typeof timebomb>
