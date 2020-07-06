import JwtDecode from 'jwt-decode';
import { history } from '../../App';
import { AppService } from '../../services';
import { JwtPayload, User } from '../../../../interfaces';
import { AppRoutes } from '../../routes';
import { updateAuth, showErrorToast } from '.';
import { UserActions } from '../types';

export const logIn = (email: string, password: string) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const { isAuthorized, token, message } = await app.login(email, password);
            console.log('JWT token:', token);
            if (isAuthorized) {
                const jwtPayload: JwtPayload = JwtDecode(token);
                console.log('JWT Payload:', JSON.stringify(jwtPayload));

                dispatch(updateAuth(token));

                dispatch(updateUser(jwtPayload.user as User));

                history.push(AppRoutes.HOME);
                return;
            }
            throw new Error(message);
        } catch (e) {
            dispatch(showErrorToast(e));
        }
    };
};

export const updateUser = (user: User) => {
    return {
        type: UserActions.UPDATE_USER,
        payload: user,
    };
};
