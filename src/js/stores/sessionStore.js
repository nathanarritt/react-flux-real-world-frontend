import {fromJS, Map} from 'immutable';

import actionTypes from '../constants/actionTypes.js';
import appDispatcher from '../dispatcher/appDispatcher.js';
import localStorageUtils from '../utils/localStorageUtils';
import Store from './Store.js';

let rememberUsername;
let selectedThingId;
let username;

if (localStorageUtils.isEnabled) {
    rememberUsername = !!localStorageUtils.get('rememberUsername');
    selectedThingId = localStorageUtils.get('selectedThingId');
    username = localStorageUtils.get('username');
}

let store = Map({
    errorResponse: null,
    hasError: false,
    isAuthenticated: false,
    isInvalid: false,
    isLoading: false,
    marginTop: 0,
    rememberUsername: rememberUsername || false,
    selectedThingId: selectedThingId || 'THING_ONE',
    username: username || ''
});

/**
 * SessionStore class.
 *
 * @class SessionStore
 */
class SessionStore extends Store {
    constructor() {
        super();
        this.dispatchToken = appDispatcher.register(action => {
            switch (action.actionType) {

                case actionTypes.SESSION_AUTH_STATUS:
                    store = store.merge({
                        isAuthenticated: action.data.authType === 'ADMIN_LOGIN',
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.SESSION_SEND:
                    store = store.set('isLoading', true);
                    this.emitChange();
                    break;

                case actionTypes.SESSION_SEND_ERROR:
                    store = store.merge({
                        isAuthenticated: false,
                        isLoading: false
                    });

                    if (action.data) {
                        const serverError = /CONNECTION_CLOSED|INFRASTRUCTURE_ERROR|INFRASTRUCTURE_REQUEST_TIMEOUT/;

                        if (serverError.test(action.data.code)) {
                            store = store.merge({
                                errorResponse: fromJS(action.data),
                                hasError: true,
                                isInvalid: false
                            });
                        } else if (action.data.code === 'INVALID_USERNAME_OR_PASSWORD') {
                            store = store.merge({
                                errorResponse: null,
                                hasError: false,
                                isInvalid: true
                            });
                        }
                    }

                    this.emitChange();
                    break;

                case actionTypes.SESSION_SEND_SUCCESS:
                    store = store.merge({
                        errorResponse: null,
                        hasError: false,
                        isAuthenticated: action.responseData.authType === 'ADMIN_LOGIN',
                        isInvalid: false,
                        isLoading: false,
                        username: action.username
                    });
                    this.emitChange();
                    break;

                case actionTypes.SESSION_LOGIN_MARGIN_TOP:
                    store = store.set('marginTop', action.marginTop);
                    this.emitChange();
                    break;

                case actionTypes.SESSION_SET_REMEMBER_USERNAME:
                    store = store.set('rememberUsername', action.rememberUsername);
                    this.emitChange();
                    break;

                case actionTypes.SESSION_SET_SELECTED_THING_ID:
                    store = store.set('selectedThingId', action.selectedThingId);
                    this.emitChange();
                    break;

                case actionTypes.SESSION_LOGOUT_SUCCESS:
                    store = store.set('isAuthenticated', false);
                    break;

                default:
                    break;
            }
        });
    }

    /**
     * Get the entire state for this store.
     *
     * @return {object} Store state
     */
    getState() {
        return store;
    }
}

export default new SessionStore();
