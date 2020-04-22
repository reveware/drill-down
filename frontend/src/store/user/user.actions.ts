import { AppService } from '../../services';
import { User, JwtPayload } from '../../../../interfaces';
import { history } from '../../App';
import { AppRoutes } from '../../routes';
import jwt_decode from 'jwt-decode';

export enum UserActions {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_ERROR = 'LOGIN_ERROR',
    LOGOUT = 'LOGOUT',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export const LogIn = (email: string, password: string) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const { isAuthorized, token, message } = await app.login(email, password);

            if (isAuthorized) {
                const payload: JwtPayload = jwt_decode(token);
                dispatch(loginSuccess(payload.user as User));
                history.push(AppRoutes.HOME);
                return;
            }
            throw new Error(message);
        } catch (e) {
            console.log(e);
            dispatch(loginError(e));
        }
    };
};

const loginSuccess = (user: User) => {
    return {
        type: UserActions.LOGIN_SUCCESS,
        payload: user,
    };
};

const loginError = (error: Error) => {
    return {
        type: UserActions.LOGIN_ERROR,
        payload: error,
    };
};
