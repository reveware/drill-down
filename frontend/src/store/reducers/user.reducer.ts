import { UserState, UserActionTypes, UserActions } from '../types/user.store.types';

const initialState: UserState = {
    user: null,
    error: null,
};

export const userReducer = (state = initialState, action: UserActionTypes): UserState => {
    switch (action.type) {
        case UserActions.UPDATE_USER: {
            return { ...state, user: action.payload };
        }

        default: {
            return state;
        }
    }
};
