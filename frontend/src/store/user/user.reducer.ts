import { UserActions } from './user.actions';
import { UserState, UserActionTypes } from './user.store.types';

const initialState: UserState = {
    user: null,
    isSessionExpired: false,
    error: null,
};

export const userReducer = (state = initialState, action: UserActionTypes): UserState => {
    switch (action.type) {
        case UserActions.LOGIN_SUCCESS: {
            return { ...state, user: action.payload };
        }

        default: {
            return state;
        }
    }
};
