import { AuthState, AuthActionTypes, AuthActions } from '../../types/store/auth.store.types';
import { StorageKeys } from '../../types/storage.types';

const initialState: AuthState = {
    token: sessionStorage.getItem(StorageKeys.AUTH_TOKEN) || null,
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
