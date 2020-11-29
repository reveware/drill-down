import React from 'react';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { Home, Login, Register, PostForTag } from './views';
import { useSelector } from 'react-redux';
import { AppState } from './store';
import { JwtPayload } from '@drill-down/interfaces';
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { AppService } from './services';

export enum AppRoutes {
    HOME = '/home',
    LOGIN = '/login',
    REGISTER = '/register',
    POSTS_FOR_TAG = '/tags/:tag',
}

export interface AppRouteProps extends RouteProps {
    isProtected: boolean;
    component: React.ComponentType<any>;
}

const NotAllowed = () => <Redirect to={AppRoutes.LOGIN} />;

const routes: AppRouteProps[] = [
    { path: AppRoutes.LOGIN, isProtected: false, exact: true, component: Login },
    { path: AppRoutes.REGISTER, isProtected: false, exact: true, component: Register },
    { path: AppRoutes.HOME, isProtected: true, exact: true, component: Home },
    { path: AppRoutes.POSTS_FOR_TAG, isProtected: true, exact: true, component: PostForTag },
    { path: '*', isProtected: true, component: Home },
];

export const Routes = () => {
    const { token } = useSelector((state: AppState) => state.auth);
    const appService = new AppService();
    const isAuthenticated = appService.isAuthValid(token);

    return (
        <React.Fragment>
            <Switch>
                {routes.map((route, i) => {
                    if (route.isProtected && !isAuthenticated) {
                        return <Route key={i} {...route} component={NotAllowed} />;
                    }
                    return <Route key={i} {...route} />;
                })}
            </Switch>
        </React.Fragment>
    );
};
