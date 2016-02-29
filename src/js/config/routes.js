import React from 'react';
import {Route} from 'react-router';

import sessionStore from '../stores/sessionStore';

import App from '../components/App';
import Login from '../components/Login';

import AnotherSection from '../components/anotherSection/AnotherSection';

import BasicTable from '../components/widgets/BasicTable';
import TableTabsToggle from '../components/widgets/TableTabsToggle';
import TableToolbarModal from '../components/widgets/TableToolbarModal';
import TableNestedTable from '../components/widgets/TableNestedTable';

import Dashboard from '../components/dashboard/Dashboard';

function requireAuth(nextState, replace) {
    if (!sessionStore.getState().get('isAuthenticated')) {
        replace({
            pathname: '/login',
            state: {
                nextPathname: nextState.location.pathname
            }
        });
    }
}

/* eslint-disable react/jsx-max-props-per-line */
export default (
    <Route component={App}>
        <Route component={Dashboard} onEnter={requireAuth} path="/" />
        <Route component={AnotherSection} onEnter={requireAuth} path="another-section" />
        <Route component={BasicTable} onEnter={requireAuth} path="widgets" />
        <Route component={BasicTable} onEnter={requireAuth} path="widgets/basic-table" />
        <Route component={TableTabsToggle} onEnter={requireAuth} path="widgets/table-tabs-toggle" />
        <Route component={TableToolbarModal} onEnter={requireAuth} path="widgets/table-toolbar-modal" />
        <Route component={TableNestedTable} onEnter={requireAuth} path="widgets/table-nested-table" />
        <Route component={Dashboard} onEnter={requireAuth} path="dashboard" />
        <Route component={Login} path="login" />
    </Route>
);
/* eslint-disable */
