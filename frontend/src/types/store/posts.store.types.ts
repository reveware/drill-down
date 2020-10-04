import {Post, PostCountByTag} from "@drill-down/interfaces";

export interface PostsState {
    userPosts: Post[];
    postCountByTag: PostCountByTag[] | undefined;
}

export enum PostsActions {
    UPDATE_USER_POSTS = 'UPDATE_USER_POSTS',
    UPDATE_POST_COUNT_BY_TAG = 'UPDATE_POST_COUNT_BY_TAG',
}

interface updateUserPosts {
    type: PostsActions.UPDATE_USER_POSTS;
    payload: Post[]
}

interface updatePostCountByTag {
    type: PostsActions.UPDATE_POST_COUNT_BY_TAG;
    payload: PostCountByTag[]
}

export type PostsActionTypes = updateUserPosts | updatePostCountByTag;