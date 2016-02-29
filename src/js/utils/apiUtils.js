import axios from 'axios';

import sessionActions from '../actions/sessionActions';

function redirectToLogin() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    window.location.assign(protocol + '//' + host + '/#/login');
}

/* eslint-disable no-console */
export function processErrorResponse(api, response) {
    if (response instanceof Error) {
        console.log('Something triggered an Error...');
        console.log(api, response.stack);
    } else {
        console.log(api, response.stack);

        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        console.log('response.data', response.data);
        console.log('response.status', response.status);
        console.log('response.headers', response.headers);
        console.log('response.config', response.config);

        if (response) {
            const apiError = /SOME_API_ERROR|ANOTHER_API_ERROR/;

            if (response.data === 'SESSION_NOT_VALID') {
                console.log(api, ' Session Timeout');
                redirectToLogin();
            } else if (apiError.test(response.data.code)) {
                console.log(api, ' Error ', response.data.message);
                sessionActions.loginError(response.data);
                redirectToLogin();
            }
        }
    }
}

/* eslint-enable */

export function sendRequest(type, resource, data = {}) {
    const url = `api/${resource}`;

    if (/delete|get/.test(type)) {
        return axios[type](url);
    }

    if (/post|put/.test(type)) {
        return axios[type](url, data);
    }

    throw new Error('apiUtils sendRequest: invalid type');
}

export default {
    processErrorResponse,
    sendRequest
};
