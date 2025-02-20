import { AuthApi, UsersApi, PostsApi, FriendsApi } from 'src/services';

export const { useLoginAttemptMutation } = AuthApi;

export const { useCreateUserMutation, useGetUserDetailQuery } = UsersApi;

export const {
    useGetPostsQuery,
    useGetPostDetailQuery,
    useCreatePhotoPostMutation,
    useCreateQuotePostMutation,
    useCreateCommentMutation,
    useDeletePostMutation,
} = PostsApi;


export const { 
    useGetPendingFriendsQuery,
    useGetUserFriendsQuery, 
    useAddFriendRequestMutation,
    useApproveFriendRequestMutation, 
    useRejectFriendRequestMutation,
    useRemoveFriendMutation,
    
} = FriendsApi;

