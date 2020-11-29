import { JwtPayload, User } from '@drill-down/interfaces';
import JwtDecode from 'jwt-decode';
import { UserState, UserActionTypes, UserActions, StorageKeys } from '../../types';

const storedToken = sessionStorage.getItem(StorageKeys.AUTH_TOKEN);
let storedUser = storedToken ? (JwtDecode(storedToken) as JwtPayload).user : null;

const initialState: UserState = {
    user: storedUser as User,
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
