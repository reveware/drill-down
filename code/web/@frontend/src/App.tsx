import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FloatingActionsMenu, NavBar } from './components';
import { Routes } from './Routes';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
import './App.scss';

library.add(far, fas);

export const App: React.FC = () => {
    return (
        <Container fluid>
            <Provider store={store}>
                <div className="app">
                    <BrowserRouter>
                        <NavBar />
                        
                        <div className="card body">
                            <Routes />
                            <FloatingActionsMenu />
                        </div>
                    </BrowserRouter>
                    <ToastContainer className="toast-container" />
                </div>
            </Provider>
        </Container>
    );
};
