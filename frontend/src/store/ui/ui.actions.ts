import { CustomError } from '../../../../interfaces';
import { UiActions } from './ui.store.types';

export const showErrorToast = (payload: CustomError) => {
    return { type: UiActions.SHOW_TOAST, payload };
};
