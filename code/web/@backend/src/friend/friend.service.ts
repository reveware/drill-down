import { Injectable } from '@nestjs/common';
import { UserOverview, GetFriends, AddFriend, DeleteFriend } from '@drill-down/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import * as _ from 'lodash';
import { UserService } from 'src/user/user.service';
import { UserTransformer } from 'src/user/user.transformer';
import { LogPerformance } from 'src/shared/decorators/LogPerformance';

@Injectable()
export class FriendService {
    DEFAULT_PAGE_SIZE = 25
    DEFAULT_PAGE_NUMBER = 1

    constructor(private prismaService: PrismaService, private userService: UserService) {}

    @LogPerformance()
    public async getPendingFriends(user: UserOverview, params: GetFriends.Request): Promise<GetFriends.Response> {
        
        const targetUser = await this.userService.findUserByUsername(params.username);
        
        if(!targetUser || targetUser.id !== user.id) {
            return {data: null,  total: 0, page: 1 }
        }
        
        const pageNumber = params?.page_number || this.DEFAULT_PAGE_NUMBER;
        const take = params?.page_size || this.DEFAULT_PAGE_SIZE;
        const skip = take * (pageNumber - 1);

        const where = { recipient_id: targetUser.id }

        const [pendingRequest, total] = await Promise.all([
            this.prismaService.friendRequest.findMany({where, take, skip, include: {requester: true}}),
            this.prismaService.friendRequest.count({where})
        ])

        const pendingFriends = _.map(pendingRequest, (request)=> UserTransformer.toUserOverview(request.requester))

        return {
            data: pendingFriends,
            total,
            page: pageNumber,
        }
    }

    @LogPerformance()
    public async addFriendRequest(user: UserOverview, params: AddFriend.Request): Promise< AddFriend.Response > {
        const friend = await this.userService.findUserByUsername(params.username);

        if(!friend || user.id === friend.id){
           return {data: {added: false}};
        }

        
        const promises =  [
            this.prismaService.friend.findFirst({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        }),
        this.prismaService.friendRequest.findFirst({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        })
    ];

        const [existingFriendship, existingFriendRequest] = await Promise.all(promises);

        if (existingFriendship || existingFriendRequest) {
            return { data: { added: false } };
        }

        await this.prismaService.friendRequest.create({ data: { requester_id: user.id, recipient_id: friend.id } });
        
        return { data: { added: true } };


    }

    @LogPerformance()
    public async approveFriendRequest(user: UserOverview, params: AddFriend.Request): Promise<AddFriend.Response> {
        const friend = await this.userService.findUserByUsername(params.username);

        if(!friend){
            return {data:{added: false}};
        }

        const pendingRequest = await this.prismaService.friendRequest.findFirst({
            where: {
                requester_id: friend.id,
                recipient_id: user.id
            },
        });

        

        if(!pendingRequest) {
            return {data:{added: false}};
        }

        
        const addFriend = this.prismaService.friend.create({data: {recipient_id: pendingRequest.recipient_id, requester_id: pendingRequest.requester_id}})
        const deletePendingRequest = this.prismaService.friendRequest.delete({ where: { id: pendingRequest.id } });

        await this.prismaService.$transaction([addFriend, deletePendingRequest]);

        return {data: {added: true}}
    }


    @LogPerformance()
    public async rejectFriendRequest(user: UserOverview, params: DeleteFriend.Request): Promise<DeleteFriend.Response> {

        
        const friend = await this.userService.findUserByUsername(params.username);

        if (!friend) {
            return { data: { deleted: false } };
        }

        const result = await this.prismaService.friendRequest.deleteMany({
            where: {
                OR: [
                    { requester_id: user.id, recipient_id: friend.id },
                    { requester_id: friend.id, recipient_id: user.id },
                ],
            },
        });

        return { data: { deleted: result.count >= 1 } };
        

    }

    @LogPerformance()
    public async getUserFriends(user: UserOverview, params: GetFriends.Request): Promise<GetFriends.Response | null> {

        const targetUser = await this.userService.findUserByUsername(params.username);

        
        if (!targetUser) {
            return null;
        }

        const pageNumber = params?.page_number || this.DEFAULT_PAGE_NUMBER;
        const pageSize = params?.page_size || this.DEFAULT_PAGE_SIZE;

        const skip = pageSize * (pageNumber - 1);

        const where = {
            OR: [{ requester_id: targetUser.id }, { recipient_id: targetUser.id }],
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
                const initiatedByUser = targetUser.id === curr.requester_id;
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


    @LogPerformance()
    public async deleteFriend(user: UserOverview, params: DeleteFriend.Request): Promise<DeleteFriend.Response> {
        
        const friend = await this.userService.findUserByUsername(params.username);

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
