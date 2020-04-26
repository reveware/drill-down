import { User } from '../../../../interfaces';

export interface UserState {
    user: User | null;
    isSessionExpired: boolean;
    error: Error | null;
}

export enum UserActions {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
}

interface Login {
    type: typeof UserActions.LOGIN;
    payload: User;
}

export type UserActionTypes = Login;
