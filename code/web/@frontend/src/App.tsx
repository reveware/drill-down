import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FloatingActionsMenu, NavBar } from './components';
import { Routes } from './Routes';
import { store, useAppDispatch, validateAuth } from './store';
import { ToastContainer } from 'react-toastify';
import './App.scss';

library.add(far, fas);

export const history = createBrowserHistory();

export const DrillDown: React.FC = () => {
    return (
        <Container fluid>
            <Provider store={store}>
                <App />
            </Provider>
        </Container>
    );
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(validateAuth());
    }, [dispatch]);

    return (
        <div className="app">
            <Router history={history}>
                <NavBar />
                <div className="body">
                    <Routes />
                    <FloatingActionsMenu />
                </div>
            </Router>
            <ToastContainer className="toast-container" />
        </div>
    );
};
