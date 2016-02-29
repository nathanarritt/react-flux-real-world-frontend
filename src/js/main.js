import React from 'react';
import ReactDom from 'react-dom';
import {hashHistory, Router} from 'react-router';

import routes from './config/routes';
import sessionActions from './actions/sessionActions';

import Loader from './components/library/Loader';

function renderApp(response) {
    let content;

    if (response) {
        // eslint-disable-next-line no-extra-parens
        content = (
            <Router history={hashHistory}>
                {routes}
            </Router>
        );
    } else {
        // eslint-disable-next-line no-extra-parens
        content = (
            <Loader />
        );
    }

    ReactDom.render(content, document.getElementById('rfrwf'));
}

sessionActions.getAuthenticatedStatus(renderApp);

renderApp();
