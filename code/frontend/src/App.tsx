import React from 'react';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NavBar } from './components';
import { Routes } from './Routes';
import { store } from './store';
import { ToastContainer } from 'react-toastify';

library.add(far, fas);

export const history = createBrowserHistory();

export const App: React.FC = () => {
    return (
        <Container fluid>
            <Provider store={store}>
                <div className="app">
                    <Router history={history}>
                        <NavBar />
                        <Routes />
                    </Router>
                    <ToastContainer className="toast-container" />
                </div>
            </Provider>
        </Container>
    );
};
