import _ from 'lodash';
import {fromJS, List, Map} from 'immutable';

import actionTypes from '../constants/actionTypes.js';
import appDispatcher from '../dispatcher/appDispatcher.js';
import Store from './Store.js';

import {deleteModel, parseCollection, parseModel, sortCollection, updateModel} from '../utils/storeUtils';

const parseOptions = {
    sortAttributes: ['interfaces']
};

let store = Map({
    actionData: null,
    actionType: null, // {string} 'add', 'edit' or null
    errorResponse: null,
    hardwares: List(),
    hasError: false, // has invalid actionData (add/edit field(s))
    isLoading: false
});

/**
 * HardwaresStore class.
 *
 * @class HardwaresStore
 */
class HardwaresStore extends Store {
    constructor() {
        super();
        this.dispatchToken = appDispatcher.register(action => {
            switch (action.actionType) {
                case actionTypes.HARDWARES_CREATE:
                case actionTypes.HARDWARES_DELETE:
                case actionTypes.HARDWARES_FETCH:
                case actionTypes.HARDWARES_UPDATE:
                    store = store.set('isLoading', true);
                    this.emitChange();
                    break;

                case actionTypes.HARDWARES_CREATE_ERROR:
                case actionTypes.HARDWARES_DELETE_ERROR:
                case actionTypes.HARDWARES_FETCH_ERROR:
                case actionTypes.HARDWARES_UPDATE_ERROR:
                    store = store.merge({
                        errorResponse: fromJS(action.data),
                        hasError: true,
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.HARDWARES_CREATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        hardwares: fromJS(
                            sortCollection(
                                [...store.get('hardwares').toJS(),
                                parseModel(action.data, parseOptions)]
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.HARDWARES_DELETE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        hardwares: fromJS(
                            deleteModel(
                                store.get('hardwares').toJS(), action.id
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.HARDWARES_FETCH_SUCCESS:
                    store = store.merge({
                        hardwares: fromJS(
                            sortCollection(
                                parseCollection(action.data, parseOptions)
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.HARDWARES_RESET_ACTION_ERROR:
                    store = store.merge({
                        errorResponse: null,
                        hasError: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.HARDWARES_SET_ACTION:
                    store = store.merge({
                        actionData: fromJS(action.data || {}),
                        actionType: action.type
                    });
                    this.emitChange();
                    break;

                case actionTypes.HARDWARES_UPDATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        hardwares: fromJS(
                            sortCollection(
                                updateModel(
                                    store.get('hardwares').toJS(),
                                    parseModel(action.data, parseOptions)
                                )
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                default:
                    break;
            }
        });
    }

    /**
     * Convert the UI data format into the API data format.
     *
     * @param {object} data Data from the UI form fields
     * @return {object} Data formatted for the API
     */
    getApiPayload(data) {
        const clone = _.cloneDeep(data);
        if (!Array.isArray(clone.interfaces)) {
            clone.interfaces = clone.interfaces.split(/\n+/).filter(_.trim).map(_.trim);
        }
        return clone;
    }

    /**
     * Required and default values for the model of this store.
     *
     * @return {object} Store model
     */
    getModel() {
        return {
            interfaces: [],
            name: '',
            primaryMemory: null,
            sslVersion: null
        };
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

export default new HardwaresStore();
