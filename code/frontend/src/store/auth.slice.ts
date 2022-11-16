import { CustomError, JwtPayload, Populated, User } from '@drill-down/interfaces';
import { createSelector, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import JwtDecode from 'jwt-decode';
import { resetState } from '.';
import { AppService } from '../services';
import { ToastService } from '../services/ToastService';
import { StorageKeys } from './storage.types';

import { AppState } from './store.type';

type AuthState = { user: null | Populated<User>; token: string | null; isLoading: boolean; error: null | CustomError };

export const logIn = createAsyncThunk(
    'auth/login',
    async (loginAttempt: { email: string; password: string }, { rejectWithValue }) => {
        try {
    
            const { isAuthorized, token, message } = await AppService.login(loginAttempt);

            if (isAuthorized && token) {
                const decodedToken = JwtDecode<JwtPayload>(token);
                const user = decodedToken.user;
                ToastService.success({ title: `Welcome back, ${user.username}!`, message });
                localStorage.setItem(StorageKeys.AUTH_TOKEN, token);
                return { user, token };
            }

            throw new Error(message);
        } catch (e) {
            const customError = AppService.makeError('login', e);
            ToastService.error(customError);
            return rejectWithValue(customError);
        }
    }
);

export const logOut = createAsyncThunk('auth/logout', async (user: Populated<User>, { dispatch }) => {
    localStorage.clear();
    dispatch(resetState());
});

const storedToken = localStorage.getItem(StorageKeys.AUTH_TOKEN);

const initialState: AuthState = {
    user: storedToken ? JwtDecode<JwtPayload>(storedToken).user : null,
    token: storedToken,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logIn.pending, (state) => {
                return (state = { isLoading: true, user: null, token: null, error: null });
            })
            .addCase(logIn.rejected, (state, action) => {
                return (state = { isLoading: false, user: null, token: null, error: action.payload as CustomError });
            })
            .addCase(logIn.fulfilled, (state, action) => {
                const { token, user } = action.payload;
                return (state = { isLoading: false, user, token, error: null });
            });
    },
});

export const { reducer: authReducer } = authSlice;

export const selectLoggedInUser = createSelector([(state: AppState) => state.auth.user], (user) => user);
