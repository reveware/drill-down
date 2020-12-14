import { AppService } from '../../services';
import { JwtPayload, User } from '@drill-down/interfaces';
import { ToastTypes, UserActions } from '../../types';
import { AppRoutes } from '../../Routes';
import { setToast } from './ui.actions';

import JwtDecode from 'jwt-decode';
import { updateAuth } from './auth.actions';

import { history } from '../../App';

export const createUser = (user: FormData) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const newUser = await app.createUser(user);

            if (newUser) {
                const toast = {
                    type: ToastTypes.SUCCESS,
                    content: { title: 'Woo-hoo', message: 'Your user was created!' },
                };
                dispatch(setToast(toast));
                history.push(AppRoutes.LOGIN);
            }
        } catch (e) {
            dispatch(setToast({ type: ToastTypes.ERROR, content: e }));
        }
    };
};

export const logIn = (email: string, password: string) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const { isAuthorized, token, message } = await app.login(email, password);

            if (isAuthorized) {
                const jwtPayload: JwtPayload = JwtDecode(token);
                dispatch(updateAuth(token));
                dispatch(updateUser(jwtPayload.user as User));
                history.push(AppRoutes.HOME);
                return;
            }
            throw new Error(message);
        } catch (e) {
            dispatch(setToast({ type: ToastTypes.ERROR, content: e }));
        }
    };
};

export const logOut = () => {
    return async (dispatch: any) => {
        dispatch(updateAuth(null));
        dispatch(updateUser(null));

    };
};

export const updateUser = (user: User | null) => {
    return {
        type: UserActions.UPDATE_USER,
        payload: user,
    };
};
