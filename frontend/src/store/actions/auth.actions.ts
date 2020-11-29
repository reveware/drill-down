import { AuthActions, StorageKeys } from '../../types';

export const updateAuth = (token: string | null) => {
    if (token === null) {
        sessionStorage.removeItem(StorageKeys.AUTH_TOKEN);
    } else {
        sessionStorage.setItem(StorageKeys.AUTH_TOKEN, token);
    }

    return {
        type: AuthActions.UPDATE_AUTH,
        payload: { token },
    };
};
