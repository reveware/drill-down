import { UiActions, Toast } from './ui.store.types';


export const showToast = (toast: Toast) => {
    return { type: UiActions.SHOW_TOAST, payload: toast };
};
