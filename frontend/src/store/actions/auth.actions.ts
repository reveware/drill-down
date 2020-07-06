import { AuthActions, storageKeys } from '../types';

export const updateAuth = (token: string) => {
    sessionStorage.setItem(storageKeys.AUTH_TOKEN, token);
    return {
        type: AuthActions.UPDATE_AUTH,
        payload: { token },
    };
};
