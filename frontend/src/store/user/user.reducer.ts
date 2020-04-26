import { UserState, UserActionTypes, UserActions } from './user.store.types';

const initialState: UserState = {
    user: null,
    isSessionExpired: false,
    error: null,
};

export const userReducer = (state = initialState, action: UserActionTypes): UserState => {
    switch (action.type) {
        case UserActions.LOGIN: {
            return { ...state, user: action.payload };
        }

        default: {
            return state;
        }
    }
};
