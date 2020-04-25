import { AppService } from '../../services';
import { JwtPayload } from '../../../../interfaces';
import { history } from '../../App';
import { AppRoutes } from '../../routes';
import jwt_decode from 'jwt-decode';
import { UserActions } from '.';
import { showErrorToast } from '../ui';

export const LogIn = (email: string, password: string) => {
    return async (dispatch: any) => {
        try {
            const app = new AppService();
            const { isAuthorized, token, message } = await app.login(email, password);

            if (isAuthorized) {
                const payload: JwtPayload = jwt_decode(token);

                dispatch({
                    type: UserActions.LOGIN,
                    payload: payload.user,
                });

                history.push(AppRoutes.HOME);
                return;
            }
            throw new Error(message);
        } catch (e) {
            dispatch(showErrorToast(e));
        }
    };
};
