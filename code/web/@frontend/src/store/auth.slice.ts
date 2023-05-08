import { AuthResponse, CustomError, JwtPayload, UserOverview } from '@drill-down/interfaces';
import { createSelector, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { resetState } from '.';
import { StorageKeys, AppState } from './store.types';
import { ToastService } from 'src/services';

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

const initialState = {
    isAuthorized: false,
    user: null,
    authToken: null,
} as AuthState;

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
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
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logOut.fulfilled, (state) => initialState);
    },
});

export const { reducer: authReducer } = authSlice;

export const {
    actions: { logIn },
} = authSlice;

export const logOut = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    localStorage.clear();
    dispatch(resetState());
});

export const validateAuth = createAsyncThunk('auth/validate', async (_, { dispatch }) => {
    const storedToken = localStorage.getItem(StorageKeys.AUTH_TOKEN);
    if (storedToken) {
        const payload: JwtPayload = JwtDecode(storedToken);
        const now = moment();
        const expires = moment.unix(payload.exp);
        const isValid = expires.isAfter(now);

        if (isValid) {
            dispatch(logIn({ is_authorized: true, token: storedToken, message: 'Valid token in local storage' }));
            return;
        }
    }

    ToastService.error({ message: 'Please Log back in', errors: ['Invalid Auth'] } as CustomError);
    dispatch(logOut());
});

export const selectLoggedInUser = createSelector([(state: AppState) => state.auth.user], (user) => user);
