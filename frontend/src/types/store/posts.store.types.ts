import { Post, CountByTag } from '@drill-down/interfaces';

export interface PostsState {
    userPosts: Post[];
    postCountByTag: CountByTag[] | undefined;
}

export enum PostsActions {
    SET_USER_POSTS = 'SET_USER_POSTS',
    UPDATE_POST_COUNT_BY_TAG = 'UPDATE_POST_COUNT_BY_TAG',
    ADD_USER_POST = 'ADD_USER_POST',
}

interface setUserPosts {
    type: PostsActions.SET_USER_POSTS;
    payload: Post[];
}

interface updatePostCountByTag {
    type: PostsActions.UPDATE_POST_COUNT_BY_TAG;
    payload: CountByTag[];
}

interface addPost {
    type: PostsActions.ADD_USER_POST;
    payload: Post
}

export type PostsActionTypes = setUserPosts | addPost | updatePostCountByTag;
