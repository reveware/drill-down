import { AuthResponse, JwtPayload, UserOverview } from '@drill-down/interfaces';
import { createSelector, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { resetState } from '.';
import { StorageKeys, AppState } from './store.types';
import { ToastService, Prompts } from 'src/services';

type AuthState =
    | {
          isAuthorized: false;
          authToken: null;
          user: null;
      }
    | {
          isAuthorized: true;
          authToken: string;
          user: UserOverview;
      };


const isValidToken = (token: JwtPayload): boolean => {
    const now = moment();
    const expires = moment.unix(token.exp);
    return expires.isAfter(now);
}

export const getInitialState = (): AuthState => {
    const storedToken = localStorage.getItem(StorageKeys.AUTH_TOKEN);

    if (storedToken) {
        const payload: JwtPayload = JwtDecode(storedToken);
        if (isValidToken(payload)) {
            
            return {
                isAuthorized: true,
                user: payload.user,
                authToken: storedToken,
            };
        }
    }

    return {
        isAuthorized: false,
        user: null,
        authToken: null,
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState,
    reducers: {
        logIn: (state, action: PayloadAction<AuthResponse>) => {
            const { is_authorized, token } = action.payload;

            if (is_authorized && token) {
                const payload: JwtPayload = JwtDecode(token);
                const user = payload.user;
                localStorage.setItem(StorageKeys.AUTH_TOKEN, token);
                state.authToken = token;
                state.isAuthorized = is_authorized;
                state.user = user;
                return;
            }
            ToastService.prompt(Prompts.InvalidAuth);
        },
    }
});

export const { reducer: authReducer } = authSlice;

export const {
    actions: { logIn },
} = authSlice;

export const logOut = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    localStorage.clear();
    dispatch(resetState());
});

export const validateTokenExpiration = createAsyncThunk('auth/validateTokenExpiration', async (_, { dispatch, getState }) => {
    const {authToken} = (getState() as AppState).auth;

    if(authToken){
        const payload: JwtPayload = JwtDecode(authToken);
        if( isValidToken(payload) ) {
            dispatch(resetState());
        }        
    }
});

export const selectLoggedInUser = createSelector([(state: AppState) => state.auth.user], (user) => user);
