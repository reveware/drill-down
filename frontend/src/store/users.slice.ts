import { User, Populated, CreateUser, CustomError } from '@drill-down/interfaces';
import {  createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';
import { history } from '../App';
import { AppRoutes } from '../Routes';
import { AppService } from '../services';
import { ToastService } from '../services/ToastService';
import { AppState } from './store.type';

type UsersState = EntityState<Populated<User>> & {
    isLoading: boolean;
    error: null | CustomError;
};


const usersAdapter = createEntityAdapter<Populated<User>>({
    selectId: (user) => user.username,
});

const initialState: UsersState = usersAdapter.getInitialState({
    isLoading: false,
    error: null,
});


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

export const fetchUserById = createAsyncThunk('users/fetchUserByUsername', async (username: string, {rejectWithValue, dispatch }) => {
    try {
        const app = new AppService();

        const user = await app.fetchUserByUsername(username);
        return user;


    } catch (e) {
        return rejectWithValue(AppService.makeError('fetchUserByUsername', e));
    }
});


const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserById.pending, (state)=> {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(fetchUserById.fulfilled, (state, action)=> {
            state.isLoading = false;
            const user = action.payload;          
            if(user){
                usersAdapter.upsertOne(state, user);
            }  
        });

        builder.addCase(fetchUserById.rejected, (state, action)=> {
            state.isLoading = false;
            state.error = action.payload as CustomError;
        })
    }
});

export const usersReducer = usersSlice.reducer;

export const { selectAll: selectallUsers, selectById: selectUserByUsername } = usersAdapter.getSelectors((state: AppState) => state.users);