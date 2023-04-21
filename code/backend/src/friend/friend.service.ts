import { Injectable } from '@nestjs/common';
import { UserOverview } from '@drill-down/interfaces';
import { FriendRequest, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as _ from 'lodash';
import { UserService } from 'src/user/user.service';
import { UserTransformer } from 'src/user/user.transformer';

@Injectable()
export class FriendService {
    constructor(private prismaService: PrismaService, private userService: UserService) {}

    public async getUserFriends(username: string): Promise<UserOverview[] | null> {
        const user = await this.userService.findUserByUsername(username);

        if (!user) {
            return null;
        }

        const friendships = await this.prismaService.friend.findMany({
            where: {
                OR: [{ requester_id: user.id }, { recipient_id: user.id }],
            },
            include: { requester: true, recipient: true },
        });

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

        return friends;
    }

    public async addFriendship(user: User, friendUsername: string): Promise<boolean> {
        const friend = await this.userService.findUserByUsername(friendUsername);

        if (!friend || user.id === friend.id) {
            return false;
        }

        const existingFriendship = await this.prismaService.friend.findFirst({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        });

        if(existingFriendship) {
            return false;
        }

        const pendingRequest = await this.prismaService.friendRequest.findFirst({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ]
            }
        });

        if(!pendingRequest) {
            await this.prismaService.friendRequest.create({data: {requester_id: user.id, recipient_id: friend.id}});
            return true;
        }

        if (pendingRequest.recipient_id == user.id) {
            await this.approveFriendRequest(pendingRequest)
            return true;
        }

        return false;

    }

    private async approveFriendRequest(friendRequest: FriendRequest) {
        const addFriend = this.prismaService.friend.create({data: {
            requester_id: friendRequest.requester_id,
            recipient_id: friendRequest.recipient_id,
        }});
        const deletePendingRequest =this.prismaService.friendRequest.delete({where: {id: friendRequest.id}});

        this.prismaService.$transaction([addFriend, deletePendingRequest]);
    }

    public async removeFriendship(user: User, friendUsername: string): Promise<boolean> {
        const friend = await this.userService.findUserByUsername(friendUsername);

        if (!friend) {
            return false;
        }

        const result = await this.prismaService.friend.deleteMany({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        });

        return result.count >= 1;
    }
}
