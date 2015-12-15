jest.dontMock('../tableToolbarModalStore');
jest.dontMock('../sessionStore');
jest.dontMock('../../utils/storeUtils');

describe('tableToolbarModalStore', () => {

    const _ = require('lodash');
    const actionTypes = require('../../constants/actionTypes');
    let appDispatcher;
    let tableToolbarModalStore;
    let callback;

    // used to test sort/parse Regions
    const thing = 'THING_ONE';
    const dataCenter = 'New York';

    function getData() {
        return [
            {
                "id": 826,
                "name": "naRegion01",
                "description": "naRegion01 description here",
                "thing": "THING_ONE",
                "flags": 0,
                "datacenters": [
                    {
                        "id": 775,
                        "name": "San Jose"
                    },
                    {
                        "id": 792,
                        "name": "New York"
                    }
                ],
                "versionNumber": 0,
                "createTime": 1440553471,
                "lastModifiedTime": 1440553528,
                "lastModifiedUser": {
                    "id": 65544,
                    "name": "admin@zscm.net"
                }
            },
            {
                "id": 524,
                "name": "anRegion01",
                "description": "anRegion01",
                "thing": "THING_ONE",
                "flags": 0,
                "datacenters": [
                    {
                        "id": 775,
                        "name": "San Jose"
                    },
                    {
                        "id": 792,
                        "name": "New York"
                    }
                ],
                "versionNumber": 0,
                "createTime": 0,
                "lastModifiedTime": 0,
                "lastModifiedUser": {
                    "id": 65544,
                    "name": "admin@zscm.net"
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
        datacenters: [],
        name: ''
    };

    // mock actions
    const actionCreate = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_CREATE
    };
    const actionDelete = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_DELETE
    };
    const actionFetch = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_FETCH
    };
    const actionUpdate = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_UPDATE
    };

    const actionCreateError = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_CREATE_ERROR,
        data: errorData
    };
    const actionDeleteError = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_DELETE_ERROR,
        data: errorData
    };
    const actionFetchError = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_FETCH_ERROR,
        data: errorData
    };
    const actionUpdateError = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_UPDATE_ERROR,
        data: errorData
    };

    function actionCreateSuccess(data) {
        return {
            actionType: actionTypes.TABLE_TOOLBAR_MODAL_CREATE_SUCCESS,
            data
        };
    }
    function actionDeleteSuccess(id) {
        return {
            actionType: actionTypes.TABLE_TOOLBAR_MODAL_DELETE_SUCCESS,
            id
        };
    }
    function actionFetchSuccess(data) {
        return {
            actionType: actionTypes.TABLE_TOOLBAR_MODAL_FETCH_SUCCESS,
            data
        };
    }
    function actionUpdateSuccess(data) {
        return {
            actionType: actionTypes.TABLE_TOOLBAR_MODAL_UPDATE_SUCCESS,
            data
        };
    }

    const actionResetActionError = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_RESET_ACTION_ERROR
    };

    const actionSetAction = {
        actionType: actionTypes.TABLE_TOOLBAR_MODAL_SET_ACTION,
        type: 'add'
    };

    beforeEach(() => {
        appDispatcher = require('../../dispatcher/appDispatcher');
        tableToolbarModalStore = require('../tableToolbarModalStore');
        callback = appDispatcher.register.mock.calls[1][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(appDispatcher.register.mock.calls.length).toBe(2);
    });

    it('is initialized', () => {
        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();

        // is initialized with no action
        const actionData = tableToolbarModalState.actionData;
        const actionType = tableToolbarModalState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // initializes with no data
        const tableToolbarModals = tableToolbarModalState.tableToolbarModals;
        expect(tableToolbarModals).toEqual([]);

        // initializes with no errors
        const errorResponse = tableToolbarModalState.errorResponse;
        const hasError = tableToolbarModalState.hasError;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);

        // initializes as not loading
        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('is loading while creating', () => {
        callback(actionCreate);
        const isLoading = tableToolbarModalStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while deleting', () => {
        callback(actionDelete);
        const isLoading = tableToolbarModalStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while fetching', () => {
        callback(actionFetch);
        const isLoading = tableToolbarModalStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while updating', () => {
        callback(actionUpdate);
        const isLoading = tableToolbarModalStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('handles create error', () => {
        callback(actionCreateError);

        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();

        const errorResponse = tableToolbarModalState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableToolbarModalState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles delete error', () => {
        callback(actionDeleteError);

        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();

        const errorResponse = tableToolbarModalState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableToolbarModalState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch error', () => {
        callback(actionFetchError);

        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();

        const errorResponse = tableToolbarModalState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableToolbarModalState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles update error', () => {
        callback(actionUpdateError);

        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();

        const errorResponse = tableToolbarModalState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = tableToolbarModalState.hasError;
        expect(hasError).toBe(true);

        const isLoading = tableToolbarModalState.isLoading;
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
        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();
        const tableToolbarModals = tableToolbarModalState.tableToolbarModals;

        // resets actions attributes
        const actionData = tableToolbarModalState.actionData;
        const actionType = tableToolbarModalState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Regions data
        const length = tableToolbarModals.length;
        expect(length).toBe(2);

        // sorts all data
        expect(tableToolbarModals[0]).toEqual(data[1]);

        // sorts all datacenters data
        expect(tableToolbarModals[0].datacenters[0].name).toEqual(dataCenter);

        // is not loading
        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(tableToolbarModals[0].thing.id).toEqual(thing);
    });

    it('handles delete success', () => {
        const data = getData();

        let tableToolbarModalState = tableToolbarModalStore.getState().toJS();
        let tableToolbarModals = tableToolbarModalState.tableToolbarModals;

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds tableToolbarModals to test delete
        tableToolbarModals.push(data[0]);

        // seeds isLoading to test reset
        tableToolbarModalState.isLoading = true;

        // initialize delete success
        callback(actionDeleteSuccess(data[0].id));

        // get updated state
        tableToolbarModalState = tableToolbarModalStore.getState().toJS();
        tableToolbarModals = tableToolbarModalState.tableToolbarModals;

        // resets actions attributes
        const actionData = tableToolbarModalState.actionData;
        const actionType = tableToolbarModalState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Regions data
        const length = tableToolbarModals.length;
        expect(length).toBe(0);

        // is not loading
        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch success', () => {
        const data = getData();

        callback(actionFetchSuccess(data));

        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();
        const tableToolbarModals = tableToolbarModalState.tableToolbarModals;

        // gets all data
        const length = tableToolbarModals.length;
        expect(length).toBe(2);

        // sorts all data
        expect(tableToolbarModals[0]).toEqual(data[1]);
        expect(tableToolbarModals[1]).toEqual(data[0]);

        // sorts all datacenters data
        expect(tableToolbarModals[0].datacenters[0].name).toEqual(dataCenter);

        // is not loading
        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(tableToolbarModals[0].thing.id).toEqual(thing);
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
        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();
        const tableToolbarModals = tableToolbarModalState.tableToolbarModals;

        // resets actions attributes
        const actionData = tableToolbarModalState.actionData;
        const actionType = tableToolbarModalState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // updates Regions data
        expect(tableToolbarModals[0].name).toEqual(updateData.name);

        // sorts all datacenters data
        expect(tableToolbarModals[0].datacenters[0].name).toEqual(dataCenter);

        // is not loading
        const isLoading = tableToolbarModalState.isLoading;
        expect(isLoading).toBe(false);

        // parses thing attribute
        expect(tableToolbarModals[0].thing.id).toEqual(thing);
    });

    it('handles reset action error', () => {

        // seeds error attributes to test reset
        callback(actionCreateError);

        callback(actionResetActionError);

        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();

        const errorResponse = tableToolbarModalState.errorResponse;
        expect(errorResponse).toBeNull();

        const hasError = tableToolbarModalState.hasError;
        expect(hasError).toBe(false);
    });

    it('handles set action', () => {
        callback(actionSetAction);

        const tableToolbarModalState = tableToolbarModalStore.getState().toJS();

        // has actions attributes values
        const actionData = tableToolbarModalState.actionData;
        const actionType = tableToolbarModalState.actionType;
        expect(actionData).toEqual({});
        expect(actionType).toEqual('add');
    });

    it('returns the API payload', () => {
        const data = getData();

        // seeds store with Regions that has parsed thing
        callback(actionCreateSuccess(data[1]));

        const tableToolbarModals = tableToolbarModalStore.getState().get('tableToolbarModals').toJS();
        const apiPayload = tableToolbarModalStore.getApiPayload(tableToolbarModals[0]);

        // reverses the parse for thing attribute
        expect(apiPayload.thing).toEqual(thing);
    });

    it('returns a Regions model', () => {
        const regionModel = tableToolbarModalStore.getModel();
        expect(regionModel).toEqual(model);
    });

});
