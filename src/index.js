import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Store from './Store';
import { BrowserRouter as Router } from 'react-router-dom';
ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Store>
                <App />
            </Store>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
