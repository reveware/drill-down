import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {AuthState, UserState, UiState, PostsState} from '../types';
import { userReducer, authReducer, uiReducer, postsReducer } from './reducers';

export interface AppState {
    ui: UiState;
    auth: AuthState;
    user: UserState;
    posts: PostsState;
}

const rootReducer = combineReducers({ user: userReducer, auth: authReducer, ui: uiReducer, posts: postsReducer});
export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
