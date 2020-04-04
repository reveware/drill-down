import React from 'react';
import { NavBar } from '../components';

export const App = () => {
    return (
        <div className="container-fluid">
            <NavBar />

            <div>
                <h2>Most common tags</h2>
                <span className="pill">movies, illustration, sexy</span>
            </div>

            <div>
                <h2>Selected tags grids</h2>
                <div>
                    <p>tag #1 posts</p>
                </div>
                <div>
                    <p>tag #2 posts</p>
                </div>
                <div>
                    <p>tag #3 posts</p>
                </div>
            </div>

            <button type="button" className="btn btn-primary">
                Primary
            </button>

            <button type="button" className="btn btn-danger">
                Danger
            </button>
        </div>
    );
};
