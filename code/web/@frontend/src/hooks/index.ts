import {AuthApi, UsersApi ,PostsApi } from 'src/services';


export const {useLoginAttemptMutation} = AuthApi;

export const {useCreateUserMutation, useGetUserDetailQuery} = UsersApi;

export const { useGetPostsQuery, useGetPostDetailQuery, useCreatePhotoPostMutation, useCreateCommentMutation, useDeletePostMutation } = PostsApi;

