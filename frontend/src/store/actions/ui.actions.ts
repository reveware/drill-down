import { CustomError } from '../../../../interfaces';
import { UiActions } from '../types';

export const showErrorToast = (payload: CustomError) => {
    console.log('SHOWING ERROR TOAST:', JSON.stringify(payload));
    return { type: UiActions.SHOW_TOAST, payload };
};
