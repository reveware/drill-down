import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { selectLoggedInUser } from './store';
import { Home, Login, Register, PostForTag, CreatePost, Chat, UserProfile } from './views';

export enum AppRoutes {
    REGISTER = '/register',
    LOGIN = '/login',
    CREATE_POST = '/post',
    HOME = '/home',
    POSTS_FOR_TAG = '/tags/:tag',
    USER_PROFILE = '/user/:username',
    CHAT = '/chat',
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
    { path: AppRoutes.USER_PROFILE, isProtected: true, exact: true, component: UserProfile },
    { path: AppRoutes.CHAT, isProtected: true, exact: true, component: Chat },
    { path: '*', isProtected: true, component: Home },
];

export const Routes: React.FC = () => {
    const loggedInUser = useSelector(selectLoggedInUser);

    return (
        <React.Fragment>
            <Switch>
                {routes.map((route, i) => {
                    if (route.isProtected && !loggedInUser) {
                        return <Redirect key={i} to={AppRoutes.LOGIN} />;
                    }

                    return <Route key={i} {...route} />;
                })}
            </Switch>
        </React.Fragment>
    );
};
