import { AuthState, AuthActionTypes, AuthActions } from '../types/auth.store.types';
import { storageKeys } from '../types/storage.types';

const initialState: AuthState = {
    token: sessionStorage.getItem(storageKeys.AUTH_TOKEN) || null,
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
    switch (action.type) {
        case AuthActions.UPDATE_AUTH: {
            const { token } = action.payload;
            state = { token };
            break;
        }
    }

    return state;
};
