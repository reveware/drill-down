import { Post } from '@drill-down/interfaces';
import { Toast, UiActions } from '../../types';

export const setToast = (toast: Toast | null) => {
    return { type: UiActions.SET_TOAST, payload: toast };
};

export const setPostForDetailsModal = (post: Post | null)=>{
    return {type: UiActions.SET_POST_FOR_DETAILS_MODAL, payload: post}
}