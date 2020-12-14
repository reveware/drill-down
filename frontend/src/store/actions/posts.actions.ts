import { Post, CountByTag, PostTypes } from '@drill-down/interfaces';
import { PostsActions, ToastTypes } from '../../types';
import { setToast } from './ui.actions';
import { AppService } from '../../services';
import { history } from '../../App';
import { AppRoutes } from '../../Routes';

export const getUserPosts = (username: string) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const posts = await app.getUserPosts(username);
            dispatch(setUserPosts(posts));
        } catch (e) {
            dispatch(setToast({ type: ToastTypes.ERROR, content: e }));
        }
    };
};

export const createPhotoPost = (formData: FormData) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const newPost = await app.createPhotoPost(formData as any);
            if (newPost) {
                const toast = { type: ToastTypes.SUCCESS, content: { title: 'Post Created!', message: 'Remember Sammy' } };
                dispatch(setToast(toast));
                dispatch(addUserPost(newPost));
                history.push(AppRoutes.HOME);
            }
        } catch (e) {
            dispatch(setToast({ type: ToastTypes.ERROR, content: e }));
        }
    };
};

export const setUserPosts = (posts: Post[]) => {
    return {
        type: PostsActions.SET_USER_POSTS,
        payload: posts,
    };
};

export const addUserPost = (post: Post) => {
    return {
        type: PostsActions.ADD_USER_POST,
        payload: post,
    };
};

export const getPostsCountByTag = (username: string) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const postsCountByTag = await app.getPostsCountByTag(username);
            dispatch(updatePostsCountByTag(postsCountByTag));
        } catch (e) {
            dispatch(setToast({ type: ToastTypes.ERROR, content: e }));
        }
    };
};

export const updatePostsCountByTag = (postCountByTag: CountByTag[]) => {
    return {
        type: PostsActions.UPDATE_POST_COUNT_BY_TAG,
        payload: postCountByTag,
    };
};
