import React from 'react';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';
import { NavBar, Toast } from './components';
import { Routes } from './routes';
import { store } from './store';

console.log('store:', JSON.stringify(store));

library.add(far, fas);

export const history = createBrowserHistory();

export const App: React.FC = () => {
    return (
        <Container fluid>
            <Provider store={store}>
                <div className="app">
                    <NavBar />
                    <Router history={history}>
                        <Routes />
                    </Router>
                    <ToastContainer className="toast-container" />
                    <Toast />
                </div>
            </Provider>
        </Container>
    );
};
