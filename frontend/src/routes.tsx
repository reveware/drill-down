import React from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { Home, Login } from './views';
import { ProtectedRoute } from './components';

export enum AppRoutes {
    HOME = '/',
    LOGIN = '/login',
    REGISTER = '/register',
}

export interface AppRouteProps extends RouteProps {
    isProtected: boolean;
    component: React.ComponentType<any>;
}

const routes: AppRouteProps[] = [
    { path: AppRoutes.LOGIN, isProtected: false, exact: true, component: Login },
    { path: AppRoutes.HOME, isProtected: true, exact: true, component: Home },
];

export const Routes = () => {
    return (
        <React.Fragment>
            <Switch>
                {routes.map((route, i) => {
                    if (route.isProtected) {
                        return <ProtectedRoute key={i} route={route} />;
                    }
                    return <Route key={i} {...route} />;
                })}
            </Switch>
        </React.Fragment>
    );
};
