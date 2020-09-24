import {Post} from "@drill-down/interfaces";
import {PostsActions, ToastTypes} from "../../types";
import {showToast} from "./ui.actions";
import {AppService} from "../../services";

export const getUserPosts = (username: string) => {
    return async (dispatch: any) => {
        try {

            const app = new AppService();
            const posts = await app.getUserPosts(username);
            dispatch(updateUserPosts(posts));
        } catch (e) {
            dispatch(showToast({type: ToastTypes.ERROR, content: e}));
        }
    }
}

export const updateUserPosts = (posts: Post[]) => {
    return {
        type: PostsActions.UPDATE_USER_POSTS,
        payload: posts,
    };
};