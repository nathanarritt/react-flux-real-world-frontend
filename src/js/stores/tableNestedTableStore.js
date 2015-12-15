import _ from 'lodash';
import {fromJS, List, Map} from 'immutable';

import actionTypes from '../constants/actionTypes.js';
import appDispatcher from '../dispatcher/appDispatcher.js';
import tableTabsToggleStore from './tableTabsToggleStore';
import sessionStore from './sessionStore';
import Store from './Store.js';

import {getStringValue, localizeValue} from '../utils/localizationUtils';
import {deleteModel, parseCollection, parseModel, sortCollection, updateModel} from '../utils/storeUtils';

const parseOptions = {
    booleanTextAttributes: [
        {
            attribute: 'disabled',
            true: 'DISABLE',
            false: 'ENABLE'
        }
    ],
    inverseBooleanAttributes: [
        'internalIpSwitchingOnGreDisabled', 'locationLookupDisabled',
        'vipMonitoringDisabled'
    ],
    localizeAttributes: ['thing', 'loadBalancerAlgorithm', 'type'],
    sortAttributes: ['virtualIps']
};

let store = Map({
    actionData: null,
    actionType: null, // {string} 'add', 'edit' or null
    thing: sessionStore.getState().get('selectedThingId'),
    errorResponse: null,
    hasError: false, // has invalid actionData (add/edit field(s))
    instancesMap: Map(),
    isLoading: false,
    selectedCluster: Map({
        data: null,
        instances: List()
    }),
    tableNestedTables: List()
});

function setInstanceMap() {
    const instances = tableTabsToggleStore.getState().get('instances');

    instances.forEach(instance => {
        store = store.setIn(['instancesMap', instance.get('id')], instance);
    });
}

function setSelectedClusterInstances() {
    const data = store.getIn(['selectedCluster', 'data']);

    if (data) {
        let smeInstanceIds = [];
        let smLbInstanceIds = [];

        if (data.has('smeInstances')) {
            smeInstanceIds = data.get('smeInstances').map(instance => {
                return instance.get('id');
            });
        }

        if (data.has('smLbInstances')) {
            smLbInstanceIds = data.get('smLbInstances').map(instance => {
                return instance.get('id');
            });
        }

        store = store.setIn(
            ['selectedCluster', 'instances'],
            List(smeInstanceIds.concat(smLbInstanceIds).map(id => {
                return store.getIn(['instancesMap', id]);
            }))
        );
    }
}

/**
 * TableNestedTableStore class.
 *
 * @class TableNestedTableStore
 */
class TableNestedTableStore extends Store {
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

                case actionTypes.TABLE_TABS_TOGGLE_FETCH_SUCCESS:
                    appDispatcher.waitFor([tableTabsToggleStore.dispatchToken]);
                    setInstanceMap();
                    setSelectedClusterInstances();
                    store = store.set('isLoading', false);
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_CREATE:
                case actionTypes.TABLE_NESTED_TABLE_DELETE:
                case actionTypes.TABLE_NESTED_TABLE_FETCH:
                case actionTypes.TABLE_NESTED_TABLE_UPDATE:
                    store = store.set('isLoading', true);
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_CREATE_ERROR:
                case actionTypes.TABLE_NESTED_TABLE_DELETE_ERROR:
                case actionTypes.TABLE_NESTED_TABLE_FETCH_ERROR:
                case actionTypes.TABLE_NESTED_TABLE_UPDATE_ERROR:
                    store = store.merge({
                        errorResponse: fromJS(action.data),
                        hasError: true,
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_CREATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        tableNestedTables: fromJS(
                            sortCollection(
                                [...store.get('tableNestedTables').toJS(),
                                parseModel(action.data, parseOptions)]
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_DELETE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        tableNestedTables: fromJS(
                            deleteModel(
                                store.get('tableNestedTables').toJS(), action.id
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_FETCH_SUCCESS:
                    store = store.merge({
                        tableNestedTables: fromJS(
                            sortCollection(
                                parseCollection(action.data, parseOptions)
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_RESET_ACTION_ERROR:
                    store = store.merge({
                        errorResponse: null,
                        hasError: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_SET_ACTION:
                    store = store.merge({
                        actionData: fromJS(action.data || {}),
                        actionType: action.type
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_SET_SELECTED_CLUSTER:
                    const selectedClusterData = store.getIn(
                        ['selectedCluster', 'data']
                    );

                    if (!selectedClusterData ||
                        selectedClusterData.get('id') !== action.data.id) {
                        store = store.merge({
                            isLoading: true,
                            selectedCluster: Map({
                                data: fromJS(action.data),
                                instances: List()
                            })
                        });
                    }

                    this.emitChange();
                    break;

                case actionTypes.TABLE_NESTED_TABLE_UPDATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        tableNestedTables: fromJS(
                            sortCollection(
                                updateModel(
                                    store.get('tableNestedTables').toJS(),
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
        clone.loadBalancerAlgorithm = getStringValue(clone.loadBalancerAlgorithm);
        clone.type = getStringValue(clone.type);
        clone.usage = getStringValue(clone.usage);

        // change inverse booleans back to API value
        _.each(parseOptions.inverseBooleanAttributes, attribute => {
            clone[attribute] = !clone[attribute];
        });

        // change boolean text back to boolean API value
        _.each(parseOptions.booleanTextAttributes, item => {
            const attribute = item.attribute;

            _.forOwn(item, (value, key) => {
                if (clone[attribute].id === value) {
                    clone[attribute] = key === 'true';
                }
            });
        });

        if (clone.type === 'CARP') {
            delete clone.authLocationLbEnabled;
            delete clone.internalIpSwitchingOnGreDisabled;
            delete clone.loadBalancerAlgorithm;
            delete clone.locationLookupDisabled;
            delete clone.monitors;
            delete clone.rebalanceDistributionEnabled;
            delete clone.smikeHealthMonitoringEnabled;
            delete clone.smLbInstances;
            delete clone.sublocationLbEnabled;
            delete clone.vipMonitoringDisabled;
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
            authLocationLbEnabled: false,
            thing: localizeValue(store.get('thing')),
            disabled: localizeValue('ENABLE'), // converts to false for API data
            greUsage: false,
            internalIpSwitchingOnGreDisabled: true, // converts to false for API data
            loadBalancerAlgorithm: null,
            locationLookupDisabled: true, // converts to false for API data
            monitors: [],
            name: '',
            pacUsage: false,
            rebalanceDistributionEnabled: false,
            smeInstances: [],
            smikeHealthMonitoringEnabled: false,
            smikeUsage: false,
            smLbInstances: [],
            sublocationLbEnabled: false,
            subnet: '',
            type: null,
            vipMonitoringDisabled: true, // converts to false for API data
            virtualIps: []
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

export default new TableNestedTableStore();
