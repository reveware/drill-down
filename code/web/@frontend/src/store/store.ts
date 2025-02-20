import { configureStore, combineReducers, createAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { authReducer } from '.';
import { AuthApi, UsersApi, PostsApi, FriendsApi } from 'src/services';
import { AppDispatch, AppState } from './store.types';

const combinedReducers = combineReducers({
    auth: authReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [PostsApi.reducerPath]: PostsApi.reducer,
    [FriendsApi.reducerPath]: FriendsApi.reducer,
});

export const resetState = createAction('root/reset');

const rootReducer = (state: any, action: any) => {
    if (action.type === resetState.toString()) {
        state = undefined;
    }
    return combinedReducers(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), AuthApi.middleware, UsersApi.middleware, PostsApi.middleware, FriendsApi.middleware],
    devTools: true,
});

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;