import { Prisma } from '@prisma/client';

const userOverview = Prisma.validator<Prisma.UserArgs>()({});

const userDetail = Prisma.validator<Prisma.UserArgs>()({
    include: {
        posts: {
            include: {
                author: true,
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        },
        likes: { include: { post: { include: { author: true, _count: { select: { likes: true, comments: true } } } } } },
        requested_friends: { include: { recipient: true } },
        approved_friends: { include: { requester: true } },
        created_time_bombs: {include: {author: true, recipient: true}},
        received_time_bombs: {include: {author: true, recipient: true}},
    },
});

export type UserOverview = Prisma.UserGetPayload<typeof userOverview>;
export type UserDetail = Prisma.UserGetPayload<typeof userDetail>;
