import { Injectable} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Friendships } from 'src/shared/interfaces';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendService {

    constructor(private prismaService: PrismaService, private userService: UserService) {}

    public async getUserFriends(username: string): Promise<Friendships | null> {
        const user = await this.userService.findUserByUsername(username);

        if (!user) {
            return null;
        }

        const friendships = await this.prismaService.friend.findMany({
            where: {
                OR: [{ user_id: user.id }, { friend_id: user.id }],
            },
            include: { friend: true, user: true },
        });

        const result = { pending: [], friends: [] } as Friendships;

        for (const friendship of friendships) {
            const initiatedByUser = user.id === friendship.user_id;
            const friend = initiatedByUser ? friendship.user : friendship.friend;

            if (friendship.approved) {
                result.friends.push(friend);
            } else {
                result.pending.push(friend);
            }
        }

        return result;
    }

    public async addFriendship(user: User, friendUsername: string): Promise<boolean> {
        const friend = await this.userService.findUserByUsername(friendUsername);

        if (!friend || user.id === friend.id) {
            return false;
        }

        const existingOrPendingFriendship = await this.prismaService.friend.findFirst({
            where: {
                OR: [
                    { user_id: user.id, friend_id: friend.id },
                    { user_id: friend.id, friend_id: user.id },
                ],
                // no approve check returns both approved and pending
            },
        });

        if (existingOrPendingFriendship) {
            const initiatedByFriend = existingOrPendingFriendship.user_id === friend.id;
            const isPendingApproval = !existingOrPendingFriendship.approved;

            if (initiatedByFriend && isPendingApproval) {
                await this.prismaService.friend.update({
                    where: {
                        id: existingOrPendingFriendship.id,
                    },
                    data: { approved: true, approved_at: new Date() },
                });
            }

            return false;
        }

       const result = await this.prismaService.friend.create({ data: { user_id: user.id, friend_id: friend.id } });
        return !!result;
    }

    public async removeFriendship(user: User, friendUsername: string): Promise<boolean> {
        const friend = await this.userService.findUserByUsername(friendUsername);

        if (!friend) {
            return false;
        }

        const result = await this.prismaService.friend.deleteMany({
            where: {
                OR: [
                    { user_id: user.id, friend_id: friend.id },
                    { user_id: friend.id, friend_id: user.id },
                ],
            },
        });

        return result.count >= 1;
    }
}
