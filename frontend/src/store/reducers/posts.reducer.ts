import {PostsActions, PostsActionTypes, PostsState } from "../../types";
import {Post, PostCountByTag} from "@drill-down/interfaces";

export const initialState: PostsState = {
    userPosts: [],
    postCountByTag: undefined,
}

export const postsReducer = (state = initialState, action: PostsActionTypes): PostsState => {

    switch (action.type) {
        case PostsActions.UPDATE_USER_POSTS: {
            const userPosts = action.payload as Post[];
            state = {...state, userPosts };
            break;
        }

        case PostsActions.UPDATE_POST_COUNT_BY_TAG: {
            const postCountByTag = action.payload as PostCountByTag[];
            state = { ...state , postCountByTag};
            break;
        }
    }
    return state;
};