import {PostsActions, PostsActionTypes, PostsState } from "../../types";
import {Post } from "@drill-down/interfaces";

export const initialState: PostsState = {
    userPosts: []
}

export const postsReducer = (state = initialState, action: PostsActionTypes): PostsState => {

    switch (action.type) {
        case PostsActions.UPDATE_USER_POSTS: {
            const userPosts = action.payload as Post[];
            state = { userPosts  };
            break;
        }
    }
    return state;
};