import {Toast, UiActions} from "../types";


export const showToast = (toast: Toast) => {
    return { type: UiActions.SHOW_TOAST, payload: toast };
};