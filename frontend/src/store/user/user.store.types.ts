import { User } from '../../../../interfaces';
import { UserActions } from './user.actions';

export interface StoreState {
    user: UserState;
}

export interface UserState {
    user: User | null;
    isSessionExpired: boolean;
    error: Error | null;
}

interface LoginSuccess {
    type: typeof UserActions.LOGIN_SUCCESS;
    payload: User;
}

interface LoginError {
    type: typeof UserActions.LOGIN_ERROR;
    payload: Error;
}

export type UserActionTypes = LoginSuccess | LoginError;
