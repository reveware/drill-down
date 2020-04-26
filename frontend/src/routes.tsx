import React from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { Home, Login } from './views';

export enum AppRoutes {
    HOME = '/',
    LOGIN = '/login',
    REGISTER = '/register',
}

const routes: RouteProps[] = [
    { path: AppRoutes.HOME, exact: true, component: Home },
    { path: AppRoutes.LOGIN, exact: true, component: Login },
];

export const Routes = () => {
    return (
        <React.Fragment>
            <Switch>
                {routes.map((route, i) => (
                    <Route key={i} {...route} />
                ))}
            </Switch>
        </React.Fragment>
    );
};
