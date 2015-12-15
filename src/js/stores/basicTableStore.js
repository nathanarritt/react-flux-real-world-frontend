import {fromJS, List, Map} from 'immutable';

import actionTypes from '../constants/actionTypes.js';
import appDispatcher from '../dispatcher/appDispatcher.js';
import Store from './Store.js';

import {sortCollection} from '../utils/storeUtils';

let store = Map({
    basicTables: List(),
    errorResponse: null,
    hasError: false, // error response from server
    isLoading: false
});

/**
 * BasicTableStore class.
 *
 * @class BasicTableStore
 */
class BasicTableStore extends Store {
    constructor() {
        super();
        this.dispatchToken = appDispatcher.register(action => {
            switch (action.actionType) {
                case actionTypes.BASIC_TABLE_FETCH:
                    store = store.set('isLoading', true);
                    this.emitChange();
                    break;

                case actionTypes.BASIC_TABLE_FETCH_ERROR:
                    store = store.merge({
                        errorResponse: fromJS(action.data),
                        hasError: true,
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.BASIC_TABLE_FETCH_SUCCESS:
                    store = store.merge({
                        basicTables: fromJS(sortCollection(action.data)),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.BASIC_TABLE_RESET_ACTION_ERROR:
                    store = store.merge({
                        errorResponse: null,
                        hasError: false
                    });
                    this.emitChange();
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

export default new BasicTableStore();
