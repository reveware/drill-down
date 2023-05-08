import { Injectable } from '@nestjs/common';
import { UserOverview, GetUserFriends, AddFriend, DeleteFriend } from '@drill-down/interfaces';
import { FriendRequest, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as _ from 'lodash';
import { UserService } from 'src/user/user.service';
import { UserTransformer } from 'src/user/user.transformer';

@Injectable()
export class FriendService {
    constructor(private prismaService: PrismaService, private userService: UserService) {}

    private async approveFriendRequest(friendRequest: FriendRequest) {
        const addFriend = this.prismaService.friend.create({
            data: {
                requester_id: friendRequest.requester_id,
                recipient_id: friendRequest.recipient_id,
            },
        });
        const deletePendingRequest = this.prismaService.friendRequest.delete({ where: { id: friendRequest.id } });

        this.prismaService.$transaction([addFriend, deletePendingRequest]);
    }

    public async getUserFriends(params: GetUserFriends.Request): Promise<GetUserFriends.Response | null> {
        const { username } = params;
        const user = await this.userService.findUserByUsername(username);

        if (!user) {
            return null;
        }

        const pageNumber = params?.page_number || 1;
        const pageSize = params?.page_size || 25;

        const skip = pageSize * (pageNumber - 1);

        const where = {
            OR: [{ requester_id: user.id }, { recipient_id: user.id }],
        };

        const [friendships, total] = await Promise.all([
            this.prismaService.friend.findMany({
                where,
                skip,
                take: pageSize,
                include: { requester: true, recipient: true },
            }),
            this.prismaService.friend.count({ where }),
        ]);

        const friends = _.reduce(
            friendships,
            (acc, curr) => {
                const initiatedByUser = user.id === curr.requester_id;
                const friend = initiatedByUser ? curr.recipient : curr.requester;
                acc.push(UserTransformer.toUserOverview(friend));
                return acc;
            },
            [] as UserOverview[]
        );

        return {
            data: friends,
            page: pageNumber,
            total,
        };
    }

    public async addFriendship(user: User, params: AddFriend.Request): Promise<AddFriend.Response> {
        const { friend_username } = params;
        const friend = await this.userService.findUserByUsername(friend_username);

        if (!friend || user.id === friend.id) {
            return { data: { added: false } };
        }

        const existingFriendship = await this.prismaService.friend.findFirst({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        });

        if (existingFriendship) {
            return { data: { added: false } };
        }

        const pendingRequest = await this.prismaService.friendRequest.findFirst({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        });

        if (!pendingRequest) {
            await this.prismaService.friendRequest.create({ data: { requester_id: user.id, recipient_id: friend.id } });
            return { data: { added: true } };
        }

        if (pendingRequest.recipient_id == user.id) {
            await this.approveFriendRequest(pendingRequest);
            return { data: { added: true } };
        }

        return { data: { added: false } };
    }


    public async deleteFriend(user: User, params: DeleteFriend.Request): Promise<DeleteFriend.Response> {
        const {friend_username} = params;

        const friend = await this.userService.findUserByUsername(friend_username);

        if (!friend) {
            return { data: { deleted: false } };
        }

        const result = await this.prismaService.friend.deleteMany({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        });

        return { data: { deleted: result.count >= 1 } };
    }
}
