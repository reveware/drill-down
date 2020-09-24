import {Post } from "@drill-down/interfaces";

export interface PostsState {
    userPosts: Post[];
}

export enum PostsActions {
    UPDATE_USER_POSTS = 'UPDATE_USER_POSTS',
}

interface setUserPosts {
    type: PostsActions.UPDATE_USER_POSTS;
    payload: Post[]
}


export type PostsActionTypes = setUserPosts;