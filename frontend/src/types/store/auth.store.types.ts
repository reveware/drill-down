export interface AuthState {
    token: null | string;
}

export enum AuthActions {
    UPDATE_AUTH = 'UPDATE_AUTH',
}

interface updateAuth {
    type: AuthActions.UPDATE_AUTH;
    payload: {
        token: string | null;
        expires: number;
    };
}

export type AuthActionTypes = updateAuth;
