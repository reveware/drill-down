import React from 'react';
import { useSelector } from 'react-redux';
import { Route, RouteProps, Routes as ReactRoutes } from 'react-router-dom';
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

type AppRouteProps = RouteProps & {
    isProtected: boolean;
};

const routes: AppRouteProps[] = [
    { path: AppRoutes.LOGIN, isProtected: false, element: <Login /> },
    { path: AppRoutes.REGISTER, isProtected: false, element: <Register /> },
    { path: AppRoutes.HOME, isProtected: true, element: <Home /> },
    { path: AppRoutes.POSTS_FOR_TAG, isProtected: true, element: <PostForTag /> },
    { path: AppRoutes.CREATE_POST, isProtected: true, element: <CreatePost /> },
    { path: AppRoutes.USER_PROFILE, isProtected: true, element: <UserProfile /> },
    { path: AppRoutes.CHAT, isProtected: true, element: <Chat /> },
    { path: '*', isProtected: true, element: <Home /> },
];

export const Routes: React.FC = () => {
    const loggedInUser = useSelector(selectLoggedInUser);
    return (
        <React.Fragment>
            <ReactRoutes>
                {routes.map((route, i) => {
                    const isAuthorized = !!loggedInUser || !route.isProtected;
                    return <Route key={i} {...route} element={isAuthorized ? route.element : <Login/>} />;
                })}
            </ReactRoutes>
        </React.Fragment>
    );
};
