import axios from 'axios';

import sessionActions from '../actions/sessionActions';

function redirectToLogin() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    console.log('window.location.href=', protocol + '//' + host + '/#/login');
    window.location.assign(protocol + '//' + host + '/#/login');
}

export function processErrorResponse(api, response) {
    if (response instanceof Error) {

        // Something happened in setting up the request that triggered an Error
        console.log(api, ' Error', response.message);
    } else {
        console.log(api, ' Error Response ', response);

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
