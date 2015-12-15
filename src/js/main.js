import React from 'react';
import ReactDom from 'react-dom';
import {Router} from 'react-router';

import routes from './config/routes';
import sessionActions from './actions/sessionActions';

import Loader from './components/library/Loader';

function renderApp(response) {
    let content;

    if (response) {
        content = (
            <Router>
                {routes}
            </Router>
        );
    } else {
        content = (
            <Loader />
        );
    }

    ReactDom.render(content, document.getElementById('rfrwf'));
}

sessionActions.getAuthenticatedStatus(renderApp);

renderApp();
