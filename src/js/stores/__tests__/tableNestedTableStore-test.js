jest.dontMock('../tableNestedTableStore');
jest.dontMock('../sessionStore');
jest.dontMock('../../utils/storeUtils');

describe('tableNestedTableStore', () => {

    const _ = require('lodash');
    const actionTypes = require('../../constants/actionTypes');
    let appDispatcher;
    let tableNestedTableStore;
    let callback;

    // used to test sort/parse ZEN Clusters
    const thing = 'THING_ONE';
    const disabled = 'DISABLE';
    const loadBalancerAlgorithm = 'TRANSPARENT';
    const type = 'SMLB';
    const virtualIp = '10.10.100.220';

    function getData() {
        return [
            {
                "authLocationLbEnabled": false,
                "thing": "THING_ONE",
                "description": "Description goes here",
                "disabled": false,
                "greUsage": false,
                "id": 1,
                "internalIpSwitchingOnGreDisabled": false,
                "loadBalancerAlgorithm": "TRANSPARENT",
                "locationLookupDisabled": false,
                "monitors": [],
                "name": "zMock Zen Cluster 1",
                "pacUsage": false,
                "rebalanceDistributionEnabled": false,
                "smeInstances": [
                    {
                        "id": 2,
                        "name": "SME Instance 2"
                    },
                    {
                        "id": 3,
                        "name": "SME Instance 3"
                    },
                    {
                        "id": 4,
                        "name": "SME Instance 4"
                    }
                ],
                "smikeHealthMonitoringEnabled": false,
                "smikeUsage": false,
                "smLbInstances": [
                    {
                        "id": 1,
                        "name": "SMLB Instance 1"
                    },
                    {
                        "id": 5,
                        "name": "SMLB Instance 5"
                    }
                ],
                "sublocationLbEnabled": false,
                "subnet": "10.10.10.0",
                "type": "SMLB",
                "vipMonitoringDisabled": false,
                "virtualIps": [
                    {
                        "id": 532,
                        "name": "10.5.5.5"
                    },
                    {
                        "id": 519,
                        "name": "10.10.100.220"
                    }
                ]
            },
            {
                "authLocationLbEnabled": false,
                "thing": "THING_ONE",
                "description": "Description goes here",
                "disabled": true,
                "greUsage": false,
                "id": 2,
                "internalIpSwitchingOnGreDisabled": false,
                "loadBalancerAlgorithm": "TRANSPARENT",
                "locationLookupDisabled": false,
                "monitors": [],
                "name": "Mock Zen Cluster 2",
                "pacUsage": false,
                "rebalanceDistributionEnabled": false,
                "smeInstances": [
                    {
                        "id": 2,
                        "name": "SME Instance 2"
                    },
                    {
                        "id": 1,
                        "name": "SME Instance 1"
                    }
                ],
                "smikeHealthMonitoringEnabled": false,
                "smikeUsage": false,
                "smLbInstances": [
                    {
                        "id": 2,
                        "name": "SMLB Instance 2"
                    },
                    {
                        "id": 1,
                        "name": "SMLB Instance 1"
                    }
                ],
                "sublocationLbEnabled": false,
                "subnet": "10.10.10.0",
                "type": "SMLB",
                "vipMonitoringDisabled": false,
                "virtualIps": [
                    {
                        "id": 532,
                        "name": "10.5.5.5"
                    },
                    {
                        "id": 519,
                        "name": "10.10.100.220"
                    }
                ]
            }
        ];
    }

    const errorData = {
        code: 'ERROR_CODE',
        message: 'Error data'
    };

    const model = {
        authLocationLbEnabled: false,
        thing: {
            id: 'THING_ONE',
            name: 'THING_ONE'
        },
        disabled: {
            id: 'ENABLE',
            name: 'Enable'
        }, // converts to false for API data
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

    // mock actions
    const actionCreate = {
        actionType: actionTypes.TABLE_NESTED_TABLE_CREATE
    };
    const actionDelete = {
        actionType: actionTypes.TABLE_NESTED_TABLE_DELETE
    };
    const actionFetch = {
        actionType: actionTypes.TABLE_NESTED_TABLE_FETCH
    };
    const actionUpdate = {
        actionType: actionTypes.TABLE_NESTED_TABLE_UPDATE
    };

    const actionCreateError = {
        actionType: actionTypes.TABLE_NESTED_TABLE_CREATE_ERROR,
        data: errorData
    };
    const actionDeleteError = {
        actionType: actionTypes.TABLE_NESTED_TABLE_DELETE_ERROR,
        data: errorData
    };
    const actionFetchError = {
        actionType: actionTypes.TABLE_NESTED_TABLE_FETCH_ERROR,
        data: errorData
    };
    const actionUpdateError = {
        actionType: actionTypes.TABLE_NESTED_TABLE_UPDATE_ERROR,
        data: errorData
    };

    function actionCreateSuccess(data) {
        return {
            actionType: actionTypes.TABLE_NESTED_TABLE_CREATE_SUCCESS,
            data
        };
    }
    function actionDeleteSuccess(id) {
        return {
            actionType: actionTypes.TABLE_NESTED_TABLE_DELETE_SUCCESS,
            id
        };
    };
    function actionFetchSuccess(data) {
        return {
            actionType: actionTypes.TABLE_NESTED_TABLE_FETCH_SUCCESS,
            data
        };
    };
    function actionUpdateSuccess(data) {
        return {
            actionType: actionTypes.TABLE_NESTED_TABLE_UPDATE_SUCCESS,
            data
        };
    };

    const actionResetActionError = {
        actionType: actionTypes.TABLE_NESTED_TABLE_RESET_ACTION_ERROR
    };

    const actionSetAction = {
        actionType: actionTypes.TABLE_NESTED_TABLE_SET_ACTION,
        type: 'add'
    };

    beforeEach(() => {
        appDispatcher = require('../../dispatcher/appDispatcher');
        tableNestedTableStore = require('../tableNestedTableStore');
        callback = appDispatcher.register.mock.calls[1][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(appDispatcher.register.mock.calls.length).toBe(2);
    });

    it('is initialized', () => {
        const tableNestedTableState = tableNestedTableStore.getState().toJS();

        // is initialized with no action
        const actionData = tableNestedTableState.actionData;
        const actionType = tableNestedTableState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // initializes with no data
        const tableNestedTables = tableNestedTableState.tableNestedTables;
        expect(tableNestedTables).toEqual([]);

        // initializes with no errors
        const errorResponse = tableNestedTableState.errorResponse;
        const hasError = tableNestedTableState.hasError;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);

        // initializes as not loading
        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('is loading while creating', () => {
        callback(actionCreate);
        const isLoading = tableNestedTableStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while deleting', () => {
        callback(actionDelete);
        const isLoading = tableNestedTableStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while fetching', () => {
        callback(actionFetch);
        const isLoading = tableNestedTableStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while updating', () => {
        callback(actionUpdate);
        const isLoading = tableNestedTableStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('handles create error', () => {
        callback(actionCreateError);

        const tableNestedTableState = tableNestedTableStore.getState().toJS();

        const errorResponse = tableNestedTableState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableNestedTableState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles delete error', () => {
        callback(actionDeleteError);

        const tableNestedTableState = tableNestedTableStore.getState().toJS();

        const errorResponse = tableNestedTableState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableNestedTableState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch error', () => {
        callback(actionFetchError);

        const tableNestedTableState = tableNestedTableStore.getState().toJS();

        const errorResponse = tableNestedTableState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableNestedTableState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles update error', () => {
        callback(actionUpdateError);

        const tableNestedTableState = tableNestedTableStore.getState().toJS();

        const errorResponse = tableNestedTableState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableNestedTableState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles create success', () => {
        const data = getData();

        // seeds store to test sort
        callback(actionFetchSuccess([data[0]]));

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds isLoading to test reset
        callback(actionCreate);

        // initialize create success
        callback(actionCreateSuccess(data[1]));

        // get updated state
        const tableNestedTableState = tableNestedTableStore.getState().toJS();
        const tableNestedTables = tableNestedTableState.tableNestedTables;

        // resets actions attributes
        const actionData = tableNestedTableState.actionData;
        const actionType = tableNestedTableState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds ZEN Clusters data
        const length = tableNestedTables.length;
        expect(length).toBe(2);

        // sorts all data
        expect(tableNestedTables[0]).toEqual(data[1]);

        // sorts all virtualIps data
        expect(tableNestedTables[0].virtualIps[0].name).toEqual(virtualIp);

        // is not loading
        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(tableNestedTables[0].thing.id).toEqual(thing);

        // parses disabled attribute
        expect(tableNestedTables[0].disabled.id).toEqual(disabled);

        // parses internalIpSwitchingOnGreDisabled attribute
        expect(tableNestedTables[0].internalIpSwitchingOnGreDisabled).toEqual(true);

        // parses loadBalancerAlgorithm attribute
        expect(tableNestedTables[0].loadBalancerAlgorithm.id).toEqual(loadBalancerAlgorithm);

        // parses locationLookupDisabled attribute
        expect(tableNestedTables[0].locationLookupDisabled).toEqual(true);

        // parses type attribute
        expect(tableNestedTables[0].type.id).toEqual(type);

        // parses vipMonitoringDisabled attribute
        expect(tableNestedTables[0].vipMonitoringDisabled).toEqual(true);
    });

    it('handles delete success', () => {
        const data = getData();

        let tableNestedTableState = tableNestedTableStore.getState().toJS();
        let tableNestedTables = tableNestedTableState.tableNestedTables;

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds tableNestedTables to test delete
        tableNestedTables.push(data[0]);

        // seeds isLoading to test reset
        tableNestedTableState.isLoading = true;

        // initialize delete success
        callback(actionDeleteSuccess(data[0].id));

        // get updated state
        tableNestedTableState = tableNestedTableStore.getState().toJS();
        tableNestedTables = tableNestedTableState.tableNestedTables;

        // resets actions attributes
        const actionData = tableNestedTableState.actionData;
        const actionType = tableNestedTableState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds ZEN Clusters data
        const length = tableNestedTables.length;
        expect(length).toBe(0);

        // is not loading
        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch success', () => {
        const data = getData();

        callback(actionFetchSuccess(data));

        const tableNestedTableState = tableNestedTableStore.getState().toJS();
        const tableNestedTables = tableNestedTableState.tableNestedTables;

        // gets all data
        const length = tableNestedTables.length;
        expect(length).toBe(2);

        // sorts all data
        expect(tableNestedTables[0]).toEqual(data[1]);
        expect(tableNestedTables[1]).toEqual(data[0]);

        // sorts all virtualIps data
        expect(tableNestedTables[0].virtualIps[0].name).toEqual(virtualIp);

        // is not loading
        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(tableNestedTables[0].thing.id).toEqual(thing);

        // parses disabled attribute
        expect(tableNestedTables[0].disabled.id).toEqual(disabled);

        // parses internalIpSwitchingOnGreDisabled attribute
        expect(tableNestedTables[0].internalIpSwitchingOnGreDisabled).toEqual(true);

        // parses loadBalancerAlgorithm attribute
        expect(tableNestedTables[0].loadBalancerAlgorithm.id).toEqual(loadBalancerAlgorithm);

        // parses locationLookupDisabled attribute
        expect(tableNestedTables[0].locationLookupDisabled).toEqual(true);

        // parses type attribute
        expect(tableNestedTables[0].type.id).toEqual(type);

        // parses vipMonitoringDisabled attribute
        expect(tableNestedTables[0].vipMonitoringDisabled).toEqual(true);
    });

    it('handles update success', () => {
        const data = getData();

        // seeds store to test update
        callback(actionFetchSuccess([_.cloneDeep(data[1])]));

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds isLoading to test reset
        callback(actionUpdate);

        // initialize update success
        const updateData = _.cloneDeep(data[1]);
        updateData.name = updateData.name + ' - updated';
        callback(actionUpdateSuccess(updateData));

        // get updated state
        const tableNestedTableState = tableNestedTableStore.getState().toJS();
        const tableNestedTables = tableNestedTableState.tableNestedTables;

        // resets actions attributes
        const actionData = tableNestedTableState.actionData;
        const actionType = tableNestedTableState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // updates ZEN Clusters data
        expect(tableNestedTables[0].name).toEqual(updateData.name);

        // sorts all virtualIps data
        expect(tableNestedTables[0].virtualIps[0].name).toEqual(virtualIp);

        // is not loading
        const isLoading = tableNestedTableState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(tableNestedTables[0].thing.id).toEqual(thing);

        // parses disabled attribute
        expect(tableNestedTables[0].disabled.id).toEqual(disabled);

        // parses internalIpSwitchingOnGreDisabled attribute
        expect(tableNestedTables[0].internalIpSwitchingOnGreDisabled).toEqual(true);

        // parses loadBalancerAlgorithm attribute
        expect(tableNestedTables[0].loadBalancerAlgorithm.id).toEqual(loadBalancerAlgorithm);

        // parses locationLookupDisabled attribute
        expect(tableNestedTables[0].locationLookupDisabled).toEqual(true);

        // parses type attribute
        expect(tableNestedTables[0].type.id).toEqual(type);

        // parses vipMonitoringDisabled attribute
        expect(tableNestedTables[0].vipMonitoringDisabled).toEqual(true);
    });

    it('handles reset action error', () => {

        // seeds error attributes to test reset
        callback(actionCreateError);

        callback(actionResetActionError);

        const tableNestedTableState = tableNestedTableStore.getState().toJS();

        const errorResponse = tableNestedTableState.errorResponse;
        expect(errorResponse).toBeNull();

        const hasError = tableNestedTableState.hasError;
        expect(hasError).toBe(false);
    });

    it('handles set action', () => {
        callback(actionSetAction);

        const tableNestedTableState = tableNestedTableStore.getState().toJS();

        // has actions attributes values
        const actionData = tableNestedTableState.actionData;
        const actionType = tableNestedTableState.actionType;
        expect(actionData).toEqual({});
        expect(actionType).toEqual('add');
    });

    it('returns the API payload', () => {
        const data = getData();

        // seeds store with ZEN Clusters that has parsed thing
        callback(actionCreateSuccess(data[1]));

        const tableNestedTables = tableNestedTableStore.getState().get('tableNestedTables').toJS();
        const apiPayload = tableNestedTableStore.getApiPayload(tableNestedTables[0]);

        // reverses the parse for thing attribute
        expect(apiPayload.thing).toEqual(thing);

        // reverses the parse for disabled attribute
        expect(apiPayload.disabled).toEqual(true);

        // reverses the parse for internalIpSwitchingOnGreDisabled attribute
        expect(apiPayload.internalIpSwitchingOnGreDisabled).toEqual(false);

        // reverses the parse for loadBalancerAlgorithm attribute
        expect(apiPayload.loadBalancerAlgorithm).toEqual(loadBalancerAlgorithm);

        // reverses the parse for locationLookupDisabled attribute
        expect(apiPayload.locationLookupDisabled).toEqual(false);

        // reverses the parse for type attribute
        expect(apiPayload.type).toEqual(type);

        // reverses the parse for vipMonitoringDisabled attribute
        expect(apiPayload.vipMonitoringDisabled).toEqual(false);
    });

    it('returns a Table/Nested Table model', () => {
        const tableNestedTableModel = tableNestedTableStore.getModel();
        expect(tableNestedTableModel).toEqual(model);
    });

});
