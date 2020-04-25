import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { userReducer, UserState } from './user';
import { uiReducer, UiState } from './ui';

const rootReducer = combineReducers({ user: userReducer, ui: uiReducer });

export interface StoreState {
    user: UserState;
    ui: UiState;
}

export const store = createStore(rootReducer, applyMiddleware(thunk));
