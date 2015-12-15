import _ from 'lodash';
import {fromJS, List, Map} from 'immutable';

import actionTypes from '../constants/actionTypes.js';
import appDispatcher from '../dispatcher/appDispatcher.js';
import sessionStore from './sessionStore';
import Store from './Store.js';

import {getStringValue, localizeValue} from '../utils/localizationUtils';
import {deleteModel, parseCollection, parseModel, sortCollection, updateModel} from '../utils/storeUtils';

const parseOptions = {
    localizeAttributes: ['thing'],
    sortAttributes: ['datacenters']
};

let store = Map({
    actionData: null,
    actionType: null, // {string} 'add', 'edit' or null
    thing: sessionStore.getState().get('selectedThingId'),
    errorResponse: null,
    hasError: false, // has invalid actionData (add/edit field(s))
    isLoading: false,
    tableToolbarModals: List()
});

/**
 * TableToolbarModalStore class.
 *
 * @class TableToolbarModalStore
 */
class TableToolbarModalStore extends Store {
    constructor() {
        super();
        this.dispatchToken = appDispatcher.register(action => {
            switch (action.actionType) {
                case actionTypes.SESSION_SET_SELECTED_THING_ID:
                    appDispatcher.waitFor([sessionStore.dispatchToken]);
                    store = store.set(
                        'thing', sessionStore.getState().get('selectedThingId')
                    );
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_CREATE:
                case actionTypes.TABLE_TOOLBAR_MODAL_DELETE:
                case actionTypes.TABLE_TOOLBAR_MODAL_FETCH:
                case actionTypes.TABLE_TOOLBAR_MODAL_UPDATE:
                    store = store.set('isLoading', true);
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_CREATE_ERROR:
                case actionTypes.TABLE_TOOLBAR_MODAL_DELETE_ERROR:
                case actionTypes.TABLE_TOOLBAR_MODAL_FETCH_ERROR:
                case actionTypes.TABLE_TOOLBAR_MODAL_UPDATE_ERROR:
                    store = store.merge({
                        errorResponse: fromJS(action.data),
                        hasError: true,
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_CREATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        tableToolbarModals: fromJS(
                            sortCollection(
                                [...store.get('tableToolbarModals').toJS(),
                                parseModel(action.data, parseOptions)]
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_DELETE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        tableToolbarModals: fromJS(
                            deleteModel(
                                store.get('tableToolbarModals').toJS(), action.id
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_FETCH_SUCCESS:
                    store = store.merge({
                        tableToolbarModals: fromJS(
                            sortCollection(
                                parseCollection(action.data, parseOptions)
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_RESET_ACTION_ERROR:
                    store = store.merge({
                        errorResponse: null,
                        hasError: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_SET_ACTION:
                    store = store.merge({
                        actionData: fromJS(action.data || {}),
                        actionType: action.type
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TOOLBAR_MODAL_UPDATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        tableToolbarModals: fromJS(
                            sortCollection(
                                updateModel(
                                    store.get('tableToolbarModals').toJS(),
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

        clone.thing = getStringValue(clone.thing);

        return clone;
    }

    /**
     * Required and default values for the model of this store.
     *
     * @return {object} Store model
     */
    getModel() {
        return {
            thing: localizeValue(store.get('thing')),
            datacenters: [],
            name: ''
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

export default new TableToolbarModalStore();
