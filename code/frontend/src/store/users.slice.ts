import { User, Populated, CreateUser, CustomError, CountByTag } from '@drill-down/common';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit';
import { history } from '../App';
import { AppRoutes } from '../Routes';
import { AppService } from '../services';
import { ToastService } from '../services/ToastService';
import { AppState } from './store.type';

export interface UserWithTagCount extends Populated<User> {
    tagCount?: Array<CountByTag>;
}

type UsersState = EntityState<UserWithTagCount> & {
    isLoading: boolean;
    error: null | CustomError;
    isLoadingTagCount: boolean;
    tagCountError: null | CustomError;
};

const usersAdapter = createEntityAdapter<UserWithTagCount>({
    selectId: (user) => user.username,
});

const initialState: UsersState = usersAdapter.getInitialState({
    isLoading: false,
    error: null,
    isLoadingTagCount: false,
    tagCountError: null,
});

export const createUser = createAsyncThunk('users/createUser', async (user: CreateUser, { rejectWithValue, dispatch }) => {
    try {
        const newUser = await AppService.createUser(user);

        if (newUser) {
            ToastService.success({ title: 'Welcome Aboard!', message: 'Please log in, now!' });
            history.push(AppRoutes.HOME);
        }
    } catch (e) {
        ToastService.error(AppService.makeError('createUser', e));
        return rejectWithValue(AppService.makeError('createUser', e));
    }
});

export const fetchUserByUsername = createAsyncThunk(
    'users/fetchUserByUsername',
    async (username: string, { rejectWithValue, dispatch }) => {
        try {
            return await AppService.fetchUserByUsername(username);
        } catch (e) {
            return rejectWithValue(AppService.makeError('fetchUserByUsername', e));
        }
    }
);

export const fetchTagCountByUsername = createAsyncThunk(
    'users/fetchTagCountByUsername', 
    async (username: string, { rejectWithValue }) => {
        try {
            const count = await AppService.getPostsCountByTag(username);
            return { username, count };
        } catch (error) {
            return rejectWithValue(AppService.makeError('users/fetchTagCountByUsername', error));
        }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserByUsername.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });

        builder.addCase(fetchUserByUsername.fulfilled, (state, action) => {
            state.isLoading = false;
            const user = action.payload;
            if (user) {
                usersAdapter.upsertOne(state, user);
            }
        });

        builder.addCase(fetchUserByUsername.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as CustomError;
        });

        builder.addCase(fetchTagCountByUsername.pending, (state, action) => {
            state.isLoadingTagCount = true;
            state.tagCountError = null;
        });

        builder.addCase(fetchTagCountByUsername.fulfilled, (state, action) => {
            state.isLoadingTagCount = false;
            const { username, count } = action.payload;
            const user = state.entities[username];

            if (user) {
                user.tagCount = count;
            }
        });
    },
});

export const usersReducer = usersSlice.reducer;

export const { selectAll: selectallUsers, selectById: selectUserByUsername } = usersAdapter.getSelectors((state: AppState) => state.users);

export const selectUserTagCount = createSelector([selectUserByUsername], (user) => user?.tagCount);
