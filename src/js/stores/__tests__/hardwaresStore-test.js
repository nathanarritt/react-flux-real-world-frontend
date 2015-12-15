jest.dontMock('../hardwaresStore');
jest.dontMock('../../utils/storeUtils');

describe('hardwaresStore', () => {

    const _ = require('lodash');
    const actionTypes = require('../../constants/actionTypes');
    let appDispatcher;
    let hardwaresStore;
    let callback;

    // used to test sort/parse Hardwares
    const interfaceId = 'en0';

    function getData() {
        return [
            {
                "id": 777,
                "name": "Supermicro AS-1041M-T2B",
                "primaryMemory": 2048000000000,
                "sslVersion": "0",
                "interfaces": [
                    "one",
                    "two"
                ],
                "extendedFields": null,
                "flags": 0,
                "versionNumber": 0,
                "createTime": 1438973724,
                "lastModifiedTime": 1438973724,
                "lastModifiedUser": {
                    "id": 65544,
                    "name": "admin@zscm.net"
                }
            },
            {
                "id": 776,
                "name": "Dell Poweredge 2850 Server Dual Intel Xeon",
                "primaryMemory": 1024000000,
                "sslVersion": "0",
                "interfaces": [
                    "en0",
                    "en1"
                ],
                "extendedFields": null,
                "flags": 0,
                "versionNumber": 0,
                "createTime": 1438973721,
                "lastModifiedTime": 1439491779,
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
        interfaces: [],
        name: '',
        primaryMemory: null,
        sslVersion: null
    };

    // mock actions
    const actionCreate = {
        actionType: actionTypes.HARDWARES_CREATE
    };
    const actionDelete = {
        actionType: actionTypes.HARDWARES_DELETE
    };
    const actionFetch = {
        actionType: actionTypes.HARDWARES_FETCH
    };
    const actionUpdate = {
        actionType: actionTypes.HARDWARES_UPDATE
    };

    const actionCreateError = {
        actionType: actionTypes.HARDWARES_CREATE_ERROR,
        data: errorData
    };
    const actionDeleteError = {
        actionType: actionTypes.HARDWARES_DELETE_ERROR,
        data: errorData
    };
    const actionFetchError = {
        actionType: actionTypes.HARDWARES_FETCH_ERROR,
        data: errorData
    };
    const actionUpdateError = {
        actionType: actionTypes.HARDWARES_UPDATE_ERROR,
        data: errorData
    };

    function actionCreateSuccess(data) {
        return {
            actionType: actionTypes.HARDWARES_CREATE_SUCCESS,
            data
        };
    }
    function actionDeleteSuccess(id) {
        return {
            actionType: actionTypes.HARDWARES_DELETE_SUCCESS,
            id
        };
    }
    function actionFetchSuccess(data) {
        return {
            actionType: actionTypes.HARDWARES_FETCH_SUCCESS,
            data
        };
    }
    function actionUpdateSuccess(data) {
        return {
            actionType: actionTypes.HARDWARES_UPDATE_SUCCESS,
            data
        };
    }

    const actionResetActionError = {
        actionType: actionTypes.HARDWARES_RESET_ACTION_ERROR
    };

    const actionSetAction = {
        actionType: actionTypes.HARDWARES_SET_ACTION,
        type: 'add'
    };

    beforeEach(() => {
        appDispatcher = require('../../dispatcher/appDispatcher');
        hardwaresStore = require('../hardwaresStore');
        callback = appDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(appDispatcher.register.mock.calls.length).toBe(1);
    });

    it('is initialized', () => {
        const hardwaresState = hardwaresStore.getState().toJS();

        // is initialized with no action
        const actionData = hardwaresState.actionData;
        const actionType = hardwaresState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // initializes with no data
        const hardwares = hardwaresState.hardwares;
        expect(hardwares).toEqual([]);

        // initializes with no errors
        const errorResponse = hardwaresState.errorResponse;
        const hasError = hardwaresState.hasError;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);

        // initializes as not loading
        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('is loading while creating', () => {
        callback(actionCreate);
        const isLoading = hardwaresStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while deleting', () => {
        callback(actionDelete);
        const isLoading = hardwaresStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while fetching', () => {
        callback(actionFetch);
        const isLoading = hardwaresStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while updating', () => {
        callback(actionUpdate);
        const isLoading = hardwaresStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('handles create error', () => {
        callback(actionCreateError);

        const hardwaresState = hardwaresStore.getState().toJS();

        const errorResponse = hardwaresState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = hardwaresState.hasError;
        expect(hasError).toBe(true);

        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles delete error', () => {
        callback(actionDeleteError);

        const hardwaresState = hardwaresStore.getState().toJS();

        const errorResponse = hardwaresState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = hardwaresState.hasError;
        expect(hasError).toBe(true);

        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch error', () => {
        callback(actionFetchError);

        const hardwaresState = hardwaresStore.getState().toJS();

        const errorResponse = hardwaresState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = hardwaresState.hasError;
        expect(hasError).toBe(true);

        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles update error', () => {
        callback(actionUpdateError);

        const hardwaresState = hardwaresStore.getState().toJS();

        const errorResponse = hardwaresState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = hardwaresState.hasError;
        expect(hasError).toBe(true);

        const isLoading = hardwaresState.isLoading;
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
        const hardwaresState = hardwaresStore.getState().toJS();
        const hardwares = hardwaresState.hardwares;

        // resets actions attributes
        const actionData = hardwaresState.actionData;
        const actionType = hardwaresState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Hardwares data
        const length = hardwares.length;
        expect(length).toBe(2);

        // sorts all data
        expect(hardwares[0]).toEqual(data[1]);

        // is not loading
        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);

        // parses interfaces attribute
        expect(hardwares[0].interfaces[0]).toEqual(interfaceId);
    });

    it('handles delete success', () => {
        const data = getData();

        let hardwaresState = hardwaresStore.getState().toJS();
        let hardwares = hardwaresState.hardwares;

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds hardwares to test delete
        hardwares.push(data[0]);

        // seeds isLoading to test reset
        hardwaresState.isLoading = true;

        // initialize delete success
        callback(actionDeleteSuccess(data[0].id));

        // get updated state
        hardwaresState = hardwaresStore.getState().toJS();
        hardwares = hardwaresState.hardwares;

        // resets actions attributes
        const actionData = hardwaresState.actionData;
        const actionType = hardwaresState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Hardwares data
        const length = hardwares.length;
        expect(length).toBe(0);

        // is not loading
        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch success', () => {
        const data = getData();

        callback(actionFetchSuccess(data));

        const hardwaresState = hardwaresStore.getState().toJS();
        const hardwares = hardwaresState.hardwares;

        // gets all data
        const length = hardwares.length;
        expect(length).toBe(2);

        // sorts all data
        expect(hardwares[0]).toEqual(data[1]);
        expect(hardwares[1]).toEqual(data[0]);

        // is not loading
        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);

        // parses interfaces attribute
        expect(hardwares[0].interfaces[0]).toEqual(interfaceId);
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
        const hardwaresState = hardwaresStore.getState().toJS();
        const hardwares = hardwaresState.hardwares;

        // resets actions attributes
        const actionData = hardwaresState.actionData;
        const actionType = hardwaresState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // updates Hardwares data
        expect(hardwares[0].name).toEqual(updateData.name);

        // is not loading
        const isLoading = hardwaresState.isLoading;
        expect(isLoading).toBe(false);

        // parses interfaces attribute
        expect(hardwares[0].interfaces[0]).toEqual(interfaceId);
    });

    it('handles reset action error', () => {

        // seeds error attributes to test reset
        callback(actionCreateError);

        callback(actionResetActionError);

        const hardwaresState = hardwaresStore.getState().toJS();

        const errorResponse = hardwaresState.errorResponse;
        expect(errorResponse).toBeNull();

        const hasError = hardwaresState.hasError;
        expect(hasError).toBe(false);
    });

    it('handles set action', () => {
        callback(actionSetAction);

        const hardwaresState = hardwaresStore.getState().toJS();

        // has actions attributes values
        const actionData = hardwaresState.actionData;
        const actionType = hardwaresState.actionType;
        expect(actionData).toEqual({});
        expect(actionType).toEqual('add');
    });

    it('returns the API payload', () => {
        const data = getData();

        // seeds store with Hardwares that has parsed interfaces
        callback(actionCreateSuccess(data[1]));

        const hardwares = hardwaresStore.getState().get('hardwares').toJS();
        const clone = _.cloneDeep(hardwares[0]);
        clone.interfaces = clone.interfaces.join('\n');
        const apiPayload = hardwaresStore.getApiPayload(clone);

        // reverses the parse for the interfaces attribute
        expect(apiPayload.interfaces[0]).toEqual(interfaceId);
    });

    it('returns a Hardwares model', () => {
        const hardwareModel = hardwaresStore.getModel();
        expect(hardwareModel).toEqual(model);
    });

});
