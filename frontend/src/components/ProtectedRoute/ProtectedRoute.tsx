import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { AppRoutes, AppRouteProps } from '../../routes';
import { AppState } from '../../store';
import { JwtPayload, User } from '../../../../interfaces';
import { updateUser } from '../../store/actions';

interface ProtectedRouteProps {
    route: AppRouteProps;
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const { route } = props;
    const auth = useSelector((state: AppState) => state.auth);
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

    useEffect(() => {
        const { token } = auth;
        if (token) {
            const { exp, user }: JwtPayload = JwtDecode(token);

            const now = moment();
            const expires = moment.unix(exp);

            if (expires.isBefore(now)) {
                setIsAuthenticated(false);
            } else {
                // TODO: set timer to refresh token
                dispatch(updateUser(user as User));
                setIsAuthenticated(true);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, [auth, dispatch]);

    if (isAuthenticated === null) {
        return <h1>hmm</h1>;
    }

    if (isAuthenticated) {
        return <Route {...route} />;
    }

    return <Redirect to={AppRoutes.LOGIN}/>;
};
