import actionTypes from '../constants/actionTypes';
import {sendRequest, processErrorResponse} from '../utils/apiUtils';
import appDispatcher from '../dispatcher/appDispatcher';
import localStorageUtils from '../utils/localStorageUtils';

const apiResource = 'session';

function authenticatedStatus(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_AUTH_STATUS,
        data
    });
}

export function getAuthenticatedStatus(callback) {
    sendRequest('get', apiResource)
        .then(response => {
            authenticatedStatus(response.data);

            if (typeof callback === 'function') {
                callback(response);
            }
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
        });
}

export function loginError(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_SEND_ERROR,
        data
    });
}

function loginSuccess(responseData, username) {
    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_SEND_SUCCESS,
        responseData,
        username
    });
}

export function login(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_SEND
    });

    if (localStorageUtils.isEnabled) {
        const rememberUsername = localStorageUtils.get('rememberUsername');

        if (rememberUsername) {
            localStorageUtils.set('username', data.username);
        } else {
            localStorageUtils.remove('username');
        }
    }

/*
    sendRequest('post', apiResource, data)
        .then(response => {
            loginSuccess(response.data, data.username);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
            loginError(response.data);
        });
*/

    sendRequest('put', apiResource, {
            authType: 'ADMIN_LOGIN'
        })
        .then(response => {
            loginSuccess(response.data, data.username);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
            loginError(response.data);
        });
}

export function logout() {
    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_LOGOUT_SUCCESS
    });

/*
    sendRequest('delete', apiResource)
        .then(response => {
            console.log('apiUtils auth logout successful', response);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
        });
*/

    sendRequest('put', apiResource, {
            authType: null
        })
        .then(response => {
            console.log('apiUtils auth logout successful', response);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
        });
}

export function setRememberUsername(rememberUsername) {
    if (localStorageUtils.isEnabled) {
        if (rememberUsername) {
            localStorageUtils.set('rememberUsername', rememberUsername);
        } else {
            localStorageUtils.remove('rememberUsername');
        }
    }

    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_SET_REMEMBER_USERNAME,
        rememberUsername
    });
}

export function setSelectedThingId(selectedThingId) {
    if (localStorageUtils.isEnabled) {
        localStorageUtils.set('selectedThingId', selectedThingId);
    }

    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_SET_SELECTED_THING_ID,
        selectedThingId
    });
}

export function updateMarginTop(marginTop) {
    appDispatcher.dispatch({
        actionType: actionTypes.SESSION_LOGIN_MARGIN_TOP,
        marginTop
    });
}

export default {
    getAuthenticatedStatus,
    login,
    loginError,
    logout,
    setRememberUsername,
    setSelectedThingId,
    updateMarginTop
};
