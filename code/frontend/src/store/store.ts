import { configureStore, combineReducers, createAction } from '@reduxjs/toolkit';
import { authReducer, usersReducer, postsReducer } from '.';

const combinedReducers = combineReducers({
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
});

export const resetState = createAction('root/reset');

const rootReducer = (state: any, action: any) => {
    if (action.type === resetState.toString()) {
        console.log('clearing state');
        state = undefined;
    }
    return combinedReducers(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    devTools: true,
});
