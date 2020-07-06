import { CustomError } from '../../../../interfaces';

export interface UiState {
    toast: Toast | null;
}

export interface Toast {
    type: 'ERROR' | 'SUCCES';
    message: CustomError | React.Component;
}

export enum UiActions {
    SHOW_TOAST = 'SHOW_TOAST',
}

interface showToast {
    type: typeof UiActions.SHOW_TOAST;
    payload: CustomError | React.Component;
}

export type UiActionTypes = showToast;
