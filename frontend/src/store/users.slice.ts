import { User, Populated, CreateUser } from '@drill-down/interfaces';
import {  createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { history } from '../App';
import { AppRoutes } from '../Routes';
import { AppService } from '../services';
import { ToastService } from '../services/ToastService';

export const createUser = createAsyncThunk('users/createUser', async (user: CreateUser, { rejectWithValue, dispatch }) => {
    try {
        const app = new AppService();

        const newUser = await app.createUser(user);

        if (newUser) {
            ToastService.success({ title: 'Welcome Aboard!', message: 'Please log in, now!' });
            history.push(AppRoutes.HOME);
        }
    } catch (e) {
        ToastService.error(AppService.makeError('createUser', e));
        return rejectWithValue(AppService.makeError('createUser', e));
    }
});

const initialState: {user: null | Populated<User>} = {
    user: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
});

export const { reducer: usersReducer } = usersSlice;
