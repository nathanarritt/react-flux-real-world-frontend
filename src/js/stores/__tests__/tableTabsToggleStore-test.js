jest.dontMock('../tableTabsToggleStore');
jest.dontMock('../sessionStore');
jest.dontMock('../../utils/storeUtils');

describe('tableTabsToggleStore', () => {

    const _ = require('lodash');
    const actionTypes = require('../../constants/actionTypes');
    let appDispatcher;
    let tableTabsToggleStore;
    let callback;

    // used to test sort/parse Instances
    const thing = 'THING_ONE';

    function getData() {
        return [
            {
                "id": 1,
                "thing": "THING_ONE",
                "type": "SMLB",
                "name": "ZscmNet Hypothetical SMLB",
                "serviceIps": [
                    "10.65.200.1"
                ],
                "servicePort": 80,
                "node": {
                    "id": 548,
                    "name": "Node 1"
                }
            },
            {
                "id": 2,
                "thing": "THING_ONE",
                "type": "SME",
                "name": "A Instance",
                "serviceIps": [
                    "10.65.200.1"
                ],
                "servicePort": 80,
                "node": {
                    "id": 548,
                    "name": "Node 2"
                }
            }
        ];
    }

    const errorData = {
        code: 'ERROR_CODE',
        message: 'Error data'
    };

    const model = {
        thing: {
            id: 'THING_ONE',
            name: 'THING_ONE'
        },
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

    // mock actions
    const actionCreate = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_CREATE
    };
    const actionDelete = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_DELETE
    };
    const actionFetch = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_FETCH
    };
    const actionUpdate = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_UPDATE
    };

    const actionCreateError = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_CREATE_ERROR,
        data: errorData
    };
    const actionDeleteError = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_DELETE_ERROR,
        data: errorData
    };
    const actionFetchError = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_FETCH_ERROR,
        data: errorData
    };
    const actionUpdateError = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_UPDATE_ERROR,
        data: errorData
    };

    function actionCreateSuccess(data) {
        return {
            actionType: actionTypes.TABLE_TABS_TOGGLE_CREATE_SUCCESS,
            data
        };
    }
    function actionDeleteSuccess(id) {
        return {
            actionType: actionTypes.TABLE_TABS_TOGGLE_DELETE_SUCCESS,
            id
        };
    }
    function actionFetchSuccess(data) {
        return {
            actionType: actionTypes.TABLE_TABS_TOGGLE_FETCH_SUCCESS,
            data
        };
    }
    function actionUpdateSuccess(data) {
        return {
            actionType: actionTypes.TABLE_TABS_TOGGLE_UPDATE_SUCCESS,
            data
        };
    }

    const actionResetActionError = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_RESET_ACTION_ERROR
    };

    const actionSetAction = {
        actionType: actionTypes.TABLE_TABS_TOGGLE_SET_ACTION,
        type: 'add'
    };

    beforeEach(() => {
        appDispatcher = require('../../dispatcher/appDispatcher');
        tableTabsToggleStore = require('../tableTabsToggleStore');
        callback = appDispatcher.register.mock.calls[1][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(appDispatcher.register.mock.calls.length).toBe(2);
    });

    it('is initialized', () => {
        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();

        // is initialized with no action
        const actionData = tableTabsToggleState.actionData;
        const actionType = tableTabsToggleState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // initializes with no data
        const instances = tableTabsToggleState.instances;
        expect(instances).toEqual([]);

        // initializes with no errors
        const errorResponse = tableTabsToggleState.errorResponse;
        const hasError = tableTabsToggleState.hasError;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);

        // initializes as not loading
        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('is loading while creating', () => {
        callback(actionCreate);
        const isLoading = tableTabsToggleStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while deleting', () => {
        callback(actionDelete);
        const isLoading = tableTabsToggleStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while fetching', () => {
        callback(actionFetch);
        const isLoading = tableTabsToggleStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while updating', () => {
        callback(actionUpdate);
        const isLoading = tableTabsToggleStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('handles create error', () => {
        callback(actionCreateError);

        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();

        const errorResponse = tableTabsToggleState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableTabsToggleState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles delete error', () => {
        callback(actionDeleteError);

        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();

        const errorResponse = tableTabsToggleState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableTabsToggleState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch error', () => {
        callback(actionFetchError);

        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();

        const errorResponse = tableTabsToggleState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableTabsToggleState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles update error', () => {
        callback(actionUpdateError);

        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();

        const errorResponse = tableTabsToggleState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableTabsToggleState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableTabsToggleState.isLoading;
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
        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();
        const instances = tableTabsToggleState.instances;

        // resets actions attributes
        const actionData = tableTabsToggleState.actionData;
        const actionType = tableTabsToggleState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Instances data
        const length = instances.length;
        expect(length).toBe(2);

        // sorts all data
        expect(instances[0]).toEqual(data[1]);

        // is not loading
        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(instances[0].thing.id).toEqual(thing);
    });

    it('handles delete success', () => {
        const data = getData();

        let tableTabsToggleState = tableTabsToggleStore.getState().toJS();
        let instances = tableTabsToggleState.instances;

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds instances to test delete
        instances.push(data[0]);

        // seeds isLoading to test reset
        tableTabsToggleState.isLoading = true;

        // initialize delete success
        callback(actionDeleteSuccess(data[0].id));

        // get updated state
        tableTabsToggleState = tableTabsToggleStore.getState().toJS();
        instances = tableTabsToggleState.instances;

        // resets actions attributes
        const actionData = tableTabsToggleState.actionData;
        const actionType = tableTabsToggleState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Instances data
        const length = instances.length;
        expect(length).toBe(0);

        // is not loading
        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch success', () => {
        const data = getData();

        callback(actionFetchSuccess(data));

        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();
        const instances = tableTabsToggleState.instances;

        // gets all data
        const length = instances.length;
        expect(length).toBe(2);

        // sorts all data
        expect(instances[0]).toEqual(data[1]);
        expect(instances[1]).toEqual(data[0]);

        // is not loading
        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(instances[0].thing.id).toEqual(thing);
    });

    it('handles update success', () => {
        const data = getData();

        // seeds store to test update
        callback(actionFetchSuccess([data[1]]));

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds isLoading to test reset
        callback(actionUpdate);

        // initialize update success
        const updateData = _.cloneDeep(data[1]);
        updateData.name = updateData.name + ' - updated';
        callback(actionUpdateSuccess(updateData));

        // get updated state
        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();
        const instances = tableTabsToggleState.instances;

        // resets actions attributes
        const actionData = tableTabsToggleState.actionData;
        const actionType = tableTabsToggleState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // updates Instances data
        expect(instances[0].name).toEqual(updateData.name);

        // is not loading
        const isLoading = tableTabsToggleState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(instances[0].thing.id).toEqual(thing);
    });

    it('handles reset action error', () => {

        // seeds error attributes to test reset
        callback(actionCreateError);

        callback(actionResetActionError);

        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();

        const errorResponse = tableTabsToggleState.errorResponse;
        expect(errorResponse).toBeNull();

        const hasError = tableTabsToggleState.hasError;
        expect(hasError).toBe(false);
    });

    it('handles set action', () => {
        callback(actionSetAction);

        const tableTabsToggleState = tableTabsToggleStore.getState().toJS();

        // has actions attributes values
        const actionData = tableTabsToggleState.actionData;
        const actionType = tableTabsToggleState.actionType;
        expect(actionData).toEqual({});
        expect(actionType).toEqual('add');
    });

    it('returns the API payload', () => {
        const data = getData();

        // seeds store with Instances that has parsed thing
        callback(actionCreateSuccess(data[1]));

        const instances = tableTabsToggleStore.getState().get('instances').toJS();
        const apiPayload = tableTabsToggleStore.getApiPayload(instances[0]);

        // reverses the parse for thing attribute
        expect(apiPayload.thing).toEqual(thing);
    });

    it('returns a Table/Tabs Toggle model', () => {
        const tableTabsToggleModel = tableTabsToggleStore.getModel();
        expect(tableTabsToggleModel).toEqual(model);
    });

});
