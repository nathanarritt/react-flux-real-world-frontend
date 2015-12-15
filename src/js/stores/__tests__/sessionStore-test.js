jest.dontMock('../sessionStore');

describe('sessionStore', () => {

    const actionTypes = require('../../constants/actionTypes');
    let appDispatcher;
    let sessionStore;
    let callback;

    const authValid = {
        "authType": "ADMIN_LOGIN",
        "obfuscateApiKey": false
    };

    const authInvalid = {
        "authType": null,
        "obfuscateApiKey": false
    };

    const errorInvalid = {
        "code": "INVALID_USERNAME_OR_PASSWORD",
        "message": ""
    };

    const errorServer = {
        "code": "CONNECTION_CLOSED",
        "message": "Connection is lost"
    };

    const loginUsername = 'admin@zscm.net';

    const selectedThingIdDefault = 'THING_ONE';
    const selectedThingIdNew = 'THING_ID';

    // mock actions
    const actionAuthStatusValid = {
        actionType: actionTypes.SESSION_AUTH_STATUS,
        data: authValid
    };

    const actionAuthStatusInvalid = {
        actionType: actionTypes.SESSION_AUTH_STATUS,
        data: authInvalid
    };

    const actionSend = {
        actionType: actionTypes.SESSION_SEND
    };

    const actionSendErrorInvalid = {
        actionType: actionTypes.SESSION_SEND_ERROR,
        data: errorInvalid
    };

    const actionSendErrorServer = {
        actionType: actionTypes.SESSION_SEND_ERROR,
        data: errorServer
    };

    const actionSendSuccess = {
        actionType: actionTypes.SESSION_SEND_SUCCESS,
        responseData: authValid,
        username: loginUsername
    };

    const actionRememberUsername = {
        actionType: actionTypes.SESSION_SET_REMEMBER_USERNAME,
        rememberUsername: true
    };

    const actionSelectedThingId = {
        actionType: actionTypes.SESSION_SET_SELECTED_THING_ID,
        selectedThingId: selectedThingIdNew
    };

    const actionLogout = {
        actionType: actionTypes.SESSION_LOGOUT_SUCCESS
    };

    beforeEach(() => {
        appDispatcher = require('../../dispatcher/appDispatcher');
        sessionStore = require('../sessionStore');
        callback = appDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(appDispatcher.register.mock.calls.length).toBe(1);
    });

    it('is initialized', () => {
        const loginState = sessionStore.getState().toJS();

        // initializes with no errors
        const errorResponse = loginState.errorResponse;
        const hasError = loginState.hasError;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);

        // initializes as not authorized
        const isAuthenticated = loginState.isAuthenticated;
        expect(isAuthenticated).toBe(false);

        // initializes as valid (not invalid)
        const isInvalid = loginState.isInvalid;
        expect(isInvalid).toBe(false);

        // initializes as not loading
        const isLoading = loginState.isLoading;
        expect(isLoading).toBe(false);

        // initializes as don't remember
        const rememberUsername = loginState.rememberUsername;
        expect(rememberUsername).toBe(false);

        // initializes as don't remember
        const selectedThingId = loginState.selectedThingId;
        expect(selectedThingId).toBe(selectedThingIdDefault);

        // initializes as don't remember
        const username = loginState.username;
        expect(username).toBe('');
    });

    it('handles logged in auth status', () => {
        callback(actionAuthStatusValid);

        const loginState = sessionStore.getState().toJS();

        // is authenticated
        const isAuthenticated = loginState.isAuthenticated;
        expect(isAuthenticated).toBe(true);

        // is not loading
        const isLoading = loginState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles logged out auth status', () => {
        callback(actionAuthStatusInvalid);

        const loginState = sessionStore.getState().toJS();

        // is not authenticated
        const isAuthenticated = loginState.isAuthenticated;
        expect(isAuthenticated).toBe(false);

        // is not loading
        const isLoading = loginState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('is loading while sending', () => {
        callback(actionSend);
        const isLoading = sessionStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('handles send error with invalid credentials', () => {
        callback(actionSendErrorInvalid);

        const loginState = sessionStore.getState().toJS();

        // is not authenticated
        const isAuthenticated = loginState.isAuthenticated;
        expect(isAuthenticated).toBe(false);

        // resets error attributes
        const errorResponse = loginState.errorResponse;
        const hasError = loginState.hasError;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);

        // is invalid
        const isInvalid = loginState.isInvalid;
        expect(isInvalid).toBe(true);

        // is not loading
        const isLoading = loginState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles send error with server error', () => {
        callback(actionSendErrorServer);

        const loginState = sessionStore.getState().toJS();

        // is not authenticated
        const isAuthenticated = loginState.isAuthenticated;
        expect(isAuthenticated).toBe(false);

        // sets error attributes
        const errorResponse = loginState.errorResponse;
        const hasError = loginState.hasError;
        expect(errorResponse).toEqual(errorServer);
        expect(hasError).toBe(true);

        // resets is invalid
        const isInvalid = loginState.isInvalid;
        expect(isInvalid).toBe(false);

        // is not loading
        const isLoading = loginState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles send success', () => {
        callback(actionSendSuccess);

        const loginState = sessionStore.getState().toJS();

        // resets error and invalid attributes
        const errorResponse = loginState.errorResponse;
        const hasError = loginState.hasError;
        const isInvalid = loginState.isInvalid;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);
        expect(isInvalid).toBe(false);

        // is authenticated
        const isAuthenticated = loginState.isAuthenticated;
        expect(isAuthenticated).toBe(true);

        // is not loading
        const isLoading = loginState.isLoading;
        expect(isLoading).toBe(false);

        // sets the username
        const username = loginState.username;
        expect(username).toBe(loginUsername);
    });

    it('handles remember login email address', () => {
        callback(actionRememberUsername);

        const rememberUsername = sessionStore.getState().get('rememberUsername');
        expect(rememberUsername).toBe(true);
    });

    it('handles the selected thing id', () => {
        callback(actionSelectedThingId);

        const selectedThingId = sessionStore.getState().get('selectedThingId');
        expect(selectedThingId).toBe(selectedThingIdNew);
    });

    it('handles logout', () => {
        callback(actionLogout);

        const isAuthenticated = sessionStore.getState().get('isAuthenticated');
        expect(isAuthenticated).toBe(false);
    });

});
