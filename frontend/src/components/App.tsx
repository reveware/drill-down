import React from 'react';
import { NavBar, PostGrid } from '../components';

export const App = () => {
    return (
        <div className="container-fluid">
            <NavBar />
            <PostGrid posts={new Array(6).fill('riki')} />
        </div>
    );
};
