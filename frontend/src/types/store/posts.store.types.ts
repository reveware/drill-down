import { Post, CountByTag } from '@drill-down/interfaces';

export interface PostsState {
    userPosts: Post[];
    postCountByTag: CountByTag[] | undefined;
}

export enum PostsActions {
    UPDATE_USER_POSTS = 'UPDATE_USER_POSTS',
    UPDATE_POST_COUNT_BY_TAG = 'UPDATE_POST_COUNT_BY_TAG',
}

interface updateUserPosts {
    type: PostsActions.UPDATE_USER_POSTS;
    payload: Post[];
}

interface updatePostCountByTag {
    type: PostsActions.UPDATE_POST_COUNT_BY_TAG;
    payload: CountByTag[];
}


export type PostsActionTypes = updateUserPosts | updatePostCountByTag;
