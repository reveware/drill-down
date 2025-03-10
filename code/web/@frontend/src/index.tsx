import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './styles/index.scss';
import { App } from './App';
import * as serviceWorker from './serviceWorker';


const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container!)
root.render(<App/>)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
