import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AuthState, UserState, UiState } from './types';
import { userReducer, authReducer, uiReducer } from './reducers';

export interface AppState {
    auth: AuthState;
    user: UserState;
    ui: UiState;
}

const rootReducer = combineReducers({ user: userReducer, auth: authReducer, ui: uiReducer });
export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
