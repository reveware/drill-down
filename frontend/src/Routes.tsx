import React, { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { AppService } from './services';
import { RootState } from './store/store.type';
import { Home, Login, Register, PostForTag, CreatePost } from './views';

export enum AppRoutes {
    REGISTER = '/register',
    LOGIN = '/login',
    CREATE_POST = '/post',
    HOME = '/home',
    POSTS_FOR_TAG = '/tags/:tag',
}

export interface AppRouteProps extends RouteProps {
    isProtected: boolean;
    component: React.ComponentType<any>;
}

const routes: AppRouteProps[] = [
    { path: AppRoutes.LOGIN, isProtected: false, exact: true, component: Login },
    { path: AppRoutes.REGISTER, isProtected: false, exact: true, component: Register },
    { path: AppRoutes.HOME, isProtected: true, exact: true, component: Home },
    { path: AppRoutes.POSTS_FOR_TAG, isProtected: true, exact: true, component: PostForTag },
    { path: AppRoutes.CREATE_POST, isProtected: true, exact: true, component: CreatePost },
    { path: '*', isProtected: true, component: Home },
];

export const Routes: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AppService.isAuthValid(token));

    useLayoutEffect(() => {
        setIsAuthenticated(AppService.isAuthValid(token));
    }, [token]);

    
    return (
        <React.Fragment>
            <Switch>
                {routes.map((route, i) => {
                    if (route.isProtected && !isAuthenticated) {
                        return <Redirect key={i} to={AppRoutes.LOGIN} />;
                    }

                    return <Route key={i} {...route} />;
                })}
            </Switch>
        </React.Fragment>
    );
};
