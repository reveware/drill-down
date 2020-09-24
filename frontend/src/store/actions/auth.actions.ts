import { AuthActions, StorageKeys } from '../../types';

export const updateAuth = (token: string) => {
    sessionStorage.setItem(StorageKeys.AUTH_TOKEN, token);
    return {
        type: AuthActions.UPDATE_AUTH,
        payload: { token },
    };
};
