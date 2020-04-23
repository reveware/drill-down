import React from 'react';
import { Container } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NavBar } from './components';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Routes } from './routes';
import { Provider } from 'react-redux';
import { store } from './store';

library.add(far, fas);

export const history = createBrowserHistory();

export const App = () => {
    return (
        <Container fluid>
            <Provider store={store}>
                <NavBar />
                <Router history={history}>
                    <Routes />
                </Router>
            </Provider>
        </Container>
    );
};
