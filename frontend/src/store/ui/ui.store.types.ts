import { CustomError } from '../../../../interfaces';

export enum UiActions {
    SHOW_TOAST = 'SHOW_TOAST',
}

export enum ToastTypes {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export interface UiState {
    toast: Toast | null;
}

export interface SuccessMessage {
    title: string;
    message: string;
    highlights?: string[];
}

export interface Toast {
    type: ToastTypes;
    content: SuccessMessage | CustomError | React.Component;
}

interface showToast {
    type: typeof UiActions.SHOW_TOAST;
    payload: Toast;
}

export type UiActionTypes = showToast;
