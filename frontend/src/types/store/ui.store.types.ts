import { CustomError } from "@drill-down/interfaces";
import React from "react";

export enum UiActions {
    SHOW_TOAST = 'SHOW_TOAST',
}

export enum ToastTypes {
    CUSTOM = 'CUSTOM',
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
    content: SuccessMessage | CustomError | React.FC;
}

interface showToast {
    type: typeof UiActions.SHOW_TOAST;
    payload: Toast;
}

export type UiActionTypes = showToast;
