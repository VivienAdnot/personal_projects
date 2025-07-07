import React from 'react';
import ReactDOM from 'react-dom';
import { EmitProvider } from 'react-emit';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AppProvider } from './AppProvider';
import './style/index.css';

// split is necessary to fix this problem
// https://github.com/ReactTraining/react-router/issues/6072
const Provider = () => (
    <AppProvider>
        <App />
    </AppProvider>
);

ReactDOM.render((
    <EmitProvider>
        <BrowserRouter>
            <Provider/>
        </BrowserRouter>
    </EmitProvider>
), document.getElementById('root'));