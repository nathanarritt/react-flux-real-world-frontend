import _ from 'lodash';
import {fromJS, List, Map} from 'immutable';

import actionTypes from '../constants/actionTypes.js';
import appDispatcher from '../dispatcher/appDispatcher.js';
import sessionStore from './sessionStore';
import Store from './Store.js';
import tableNestedTableStore from './tableNestedTableStore';

import {getStringValue, localizeValue} from '../utils/localizationUtils';
import {deleteModel, parseCollection, parseModel, sortCollection, updateModel} from '../utils/storeUtils';

const parseOptions = {
    localizeAttributes: ['thing', 'type']
};

let store = Map({
    actionData: null,
    actionType: null, // {string} 'add', 'edit' or null
    thing: sessionStore.getState().get('selectedThingId'),
    clustersSmeInstancesMap: Map(),
    clustersSmLbInstancesMap: Map(),
    errorResponse: null,
    hasError: false, // has invalid actionData (add/edit field(s))
    instances: List(),
    isLoading: false,
    selectedInstance: Map({
        data: null,
        tableNestedTables: List()
    })
});

function setClusterMaps() {
    const clusters = tableNestedTableStore.getState().get('tableNestedTables');

    store = store.merge({
        clustersSmeInstancesMap: Map(),
        clustersSmLbInstancesMap: Map()
    });

    clusters.forEach(cluster => {
        cluster.get('smeInstances').forEach(instance => {
            const id = instance.get('id');

            let idInstances = store.getIn(
                ['clustersSmeInstancesMap', id]
            );

            if (idInstances && idInstances.isList()) {
                idInstances = idInstances.push(cluster);
                store = store.setIn(
                    ['clustersSmeInstancesMap', id],
                    idInstances
                );
            } else {
                store = store.setIn(
                    ['clustersSmeInstancesMap', id],
                    List.of(cluster)
                );
            }
        });

        cluster.get('smLbInstances').forEach(instance => {
            const id = instance.get('id');

            let idInstances = store.getIn(
                ['clustersSmLbInstancesMap', id]
            );

            if (idInstances && idInstances.isList()) {
                idInstances = idInstances.push(cluster);
                store = store.setIn(
                    ['clustersSmLbInstancesMap', id],
                    idInstances
                );
            } else {
                store = store.setIn(
                    ['clustersSmLbInstancesMap', id],
                    List.of(cluster)
                );
            }
        });
    });
}

function setSelectedInstanceClusters() {
    const data = store.getIn(['selectedInstance', 'data']);

    if (data) {
        let clusters = List();
        const id = data.get('id');
        const type = data.get('type');
        const idSmeClusters = store.getIn('clustersSmeInstancesMap', id);
        const idSmLbClusters = store.getIn('clustersSmLbInstancesMap', id);

        if (idSmeClusters && idSmeClusters.isList()) {
            clusters = clusters.merge(idSmeClusters);
        }

        if (type === 'SMLB' && idSmLbClusters && idSmLbClusters.isList()) {
            clusters = clusters.merge(idSmLbClusters);
        }

        store = store.setIn(['selectedInstance', 'tableNestedTables', clusters]);
    }
}

/**
 * TableTabsToggleStore class.
 *
 * @class TableTabsToggleStore
 */
class TableTabsToggleStore extends Store {
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

                case actionTypes.TABLE_NESTED_TABLE_FETCH_SUCCESS:
                    appDispatcher.waitFor([tableNestedTableStore.dispatchToken]);
                    setClusterMaps();
                    setSelectedInstanceClusters();
                    store = store.set('isLoading', false);
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_CREATE:
                case actionTypes.TABLE_TABS_TOGGLE_DELETE:
                case actionTypes.TABLE_TABS_TOGGLE_FETCH:
                case actionTypes.TABLE_TABS_TOGGLE_UPDATE:
                    store = store.set('isLoading', true);
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_CREATE_ERROR:
                case actionTypes.TABLE_TABS_TOGGLE_DELETE_ERROR:
                case actionTypes.TABLE_TABS_TOGGLE_FETCH_ERROR:
                case actionTypes.TABLE_TABS_TOGGLE_UPDATE_ERROR:
                    store = store.merge({
                        errorResponse: fromJS(action.data),
                        hasError: true,
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_CREATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        instances: fromJS(
                            sortCollection(
                                [...store.get('instances').toJS(),
                                parseModel(action.data, parseOptions)]
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_DELETE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        instances: fromJS(
                            deleteModel(
                                store.get('instances').toJS(), action.id
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_FETCH_SUCCESS:
                    store = store.merge({
                        instances: fromJS(
                            sortCollection(
                                parseCollection(action.data, parseOptions)
                            )
                        ),
                        isLoading: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_RESET_ACTION_ERROR:
                    store = store.merge({
                        errorResponse: null,
                        hasError: false
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_SET_ACTION:
                    store = store.merge({
                        actionData: fromJS(action.data || {}),
                        actionType: action.type
                    });
                    this.emitChange();
                    break;

                case actionTypes.TABLE_TABS_TOGGLE_SET_SELECTED_INSTANCE: {
                    const selectedInstanceData = store.getIn(
                        ['selectedInstance', 'data']
                    );

                    if (!selectedInstanceData ||
                        selectedInstanceData.get('id') !== action.data.id) {
                        store = store.merge({
                            isLoading: true,
                            selectedInstance: Map({
                                data: fromJS(action.data),
                                instances: List()
                            })
                        });
                    }

                    this.emitChange();
                    break;
                }

                case actionTypes.TABLE_TABS_TOGGLE_UPDATE_SUCCESS:
                    store = store.merge({
                        actionData: null,
                        actionType: null,
                        instances: fromJS(
                            sortCollection(
                                updateModel(
                                    store.get('instances').toJS(),
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
            instancePath: '',
            interfaceConfig: '',
            name: '',
            node: null,
            servicePort: null,
            serviceIps: [],
            smeInstance: null,
            smnetDefaultGatewayIp: '',
            smnetDefaultGatewayNetmask: '',
            systemFeatureBits: [],
            systemFeatureParams: [],
            type: null,
            upgradeGroup: null
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

export default new TableTabsToggleStore();
