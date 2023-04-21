import { UserDetail, UserOverview, UserRole } from '@drill-down/interfaces';
import { PostTransformer } from 'src/post/post.transformer';
import { UserDetail as PrismaDetailResult, UserOverview as PrismaOverviewResult } from 'src/shared/interfaces';

export class UserTransformer {
    public static toUserOverview(user: PrismaOverviewResult): UserOverview {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            tagline: user.tagline,
            avatar: user.avatar,
            role: user.role as UserRole,
            first_name: user.first_name,
            last_name: user.last_name,
            date_of_birth: user.date_of_birth,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }

    public static toUserDetail(user: PrismaDetailResult): UserDetail {
        const overview = UserTransformer.toUserOverview(user);

        
        return { 
            ...overview,
            posts: user.posts.map(PostTransformer.toPostOverview),
            friends: this.getFriends(user),
            likes: user.likes.map(l => PostTransformer.toPostOverview(l.post)),
            created_time_bombs: user.created_time_bombs.map(PostTransformer.toTimeBomb),
            received_time_bombs: user.received_time_bombs.map(PostTransformer.toTimeBomb),
            
            
        };
    }

    private static getFriends(user: PrismaDetailResult): UserOverview[] {
        const approvedFriends = user.approved_friends.map((f)=> f.requester);
        const requestedFriends = user.requested_friends.map(f => f.recipient);
        const friends = [...approvedFriends, ...requestedFriends]
        .map(this.toUserOverview)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

        return friends
    }
}
