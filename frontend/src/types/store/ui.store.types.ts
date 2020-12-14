import { CustomError, Post } from '@drill-down/interfaces';
import React from 'react';

export enum UiActions {
    SET_TOAST = 'SET_TOAST',
    SET_POST_FOR_DETAILS_MODAL = 'SET_POST_FOR_DETAILS_MODAL',
}

export enum ToastTypes {
    CUSTOM = 'CUSTOM',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export interface UiState {
    toast: Toast | null;
    postForDetailsModal: Post | null;
}

export interface SuccessMessage {
    title: string;
    message: string;
    highlights?: string[];
}

export interface Toast {
    type: ToastTypes;
    content: SuccessMessage | CustomError | React.FC;
}

interface setToast {
    type: typeof UiActions.SET_TOAST;
    payload: Toast;
}

interface setPostForDetailsModal {
    type: typeof UiActions.SET_POST_FOR_DETAILS_MODAL;
    payload: Post | null;
}

export type UiActionTypes = setToast | setPostForDetailsModal;
