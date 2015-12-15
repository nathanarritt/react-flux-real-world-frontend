import _ from 'lodash';
import {fromJS, List, Map} from 'immutable';

import actionTypes from '../constants/actionTypes.js';
import appDispatcher from '../dispatcher/appDispatcher.js';
import Store from './Store.js';

import {getStringValue} from '../utils/localizationUtils';
import {deleteModel, parseCollection, parseModel, sortCollection, updateModel} from '../utils/storeUtils';

const parseOptions = {
    localizeAttributes: ['country', 'timezone']
};

let store = Map({
    actionData: null,
    actionType: null, // {string} 'add', 'edit' or null
    dataCenters: List(),
    errorResponse: null,
    hasError: false, // has invalid actionData (add/edit field(s))
    isLoading: false
});

/**
 * DataCentersStore class.
 *
 * @class DataCentersStore
 */
class DataCentersStore extends Store {
    constructor() {
        super();
        this.dispatchToken = appDispatcher.register(action => {
            switch (action.actionType) {
                case actionTypes.DATA_CENTERS_CREATE:
                case actionTypes.DATA_CENTERS_DELETE:
                case actionTypes.DATA_CENTERS_FETCH:
                case actionTypes.DATA_CENTERS_UPDATE:
                    store = store.set('isLoading', true);
                    this.emitChange();
                    break;

                case actionTypes.DATA_CENTERS_CREATE_ERROR:
                case actionTypes.DATA_CENTERS_DELETE_ERROR:
                case actionTypes.DATA_CENTERS_FETCH_ERROR:
                case actionTypes.DATA_CENTERS_UPDATE_ERROR:
                    store = store.merge({
                        errorResponse: fromJS(action.data),
                        hasError: true,
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.DATA_CENTERS_CREATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        dataCenters: fromJS(
                            sortCollection(
                                [...store.get('dataCenters').toJS(),
                                parseModel(action.data, parseOptions)]
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.DATA_CENTERS_DELETE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        dataCenters: fromJS(
                            deleteModel(
                                store.get('dataCenters').toJS(), action.id
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.DATA_CENTERS_FETCH_SUCCESS:
                    store = store.merge({
                        dataCenters: fromJS(
                            sortCollection(
                                parseCollection(action.data, parseOptions)
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.DATA_CENTERS_RESET_ACTION_ERROR:
                    store = store.merge({
                        errorResponse: null,
                        hasError: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.DATA_CENTERS_SET_ACTION:
                    store = store.merge({
                        actionData: fromJS(action.data || {}),
                        actionType: action.type
                    });
                    this.emitChange();
                    break;

                case actionTypes.DATA_CENTERS_UPDATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        dataCenters: fromJS(
                            sortCollection(
                                updateModel(
                                    store.get('dataCenters').toJS(),
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

        clone.country = getStringValue(clone.country);
        clone.timezone = getStringValue(clone.timezone);

        return clone;
    }

    /**
     * Required and default values for the model of this store.
     *
     * @return {object} Store model
     */
    getModel() {
        return {
            city: '',
            country: null,
            name: '',
            provider: ''
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

export default new DataCentersStore();
