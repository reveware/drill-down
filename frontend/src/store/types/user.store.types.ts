import { User } from '../../../../interfaces';

export interface UserState {
    user: User | null;
    error: Error | null;
}

export enum UserActions {
    UPDATE_USER = 'UPDATE_USER',
    LOGOUT = 'LOGOUT',
}

interface Login {
    type: typeof UserActions.UPDATE_USER;
    payload: User;
}

export type UserActionTypes = Login;
