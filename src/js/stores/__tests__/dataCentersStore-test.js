jest.dontMock('../dataCentersStore');
jest.dontMock('../../utils/storeUtils');

describe('dataCentersStore', () => {

    const _ = require('lodash');
    const immutable = require('immutable');
    const actionTypes = require('../../constants/actionTypes');
    let appDispatcher;
    let dataCentersStore;
    let callback;

    // used to test sort/parse DataCenters
    const country = 'UNITED_STATES';
    const timezone = 'UNITED_STATES_AMERICA_NEW_YORK';

    function getData() {
        return [
            {
                "id": 775,
                "name": "San Jose",
                "provider": "AT & T",
                "country": "NONE",
                "city": "San Jose",
                "timezone": "UNITED_STATES_AMERICA_LOS_ANGELES",
                "latitude": 37,
                "longitude": -121,
                "uploadBandwidth": 5000000,
                "downloadBandwidth": 1000000,
                "flags": 0,
                "versionNumber": 0,
                "createTime": 1438973710,
                "lastModifiedTime": 1439485556,
                "lastModifiedUser": {
                    "id": 65544,
                    "name": "admin@zscm.net"
                }
            },
            {
                "id": 792,
                "name": "New York",
                "provider": "eSolutions Group",
                "country": "UNITED_STATES",
                "city": "Albany",
                "timezone": "UNITED_STATES_AMERICA_NEW_YORK",
                "latitude": 42,
                "longitude": -73,
                "uploadBandwidth": 5000000,
                "downloadBandwidth": 20000000,
                "flags": 0,
                "versionNumber": 0,
                "createTime": 1439476586,
                "lastModifiedTime": 1439476586,
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
        city: '',
        country: null,
        name: '',
        provider: ''
    };

    // mock actions
    const actionCreate = {
        actionType: actionTypes.DATA_CENTERS_CREATE
    };
    const actionDelete = {
        actionType: actionTypes.DATA_CENTERS_DELETE
    };
    const actionFetch = {
        actionType: actionTypes.DATA_CENTERS_FETCH
    };
    const actionUpdate = {
        actionType: actionTypes.DATA_CENTERS_UPDATE
    };

    const actionCreateError = {
        actionType: actionTypes.DATA_CENTERS_CREATE_ERROR,
        data: errorData
    };
    const actionDeleteError = {
        actionType: actionTypes.DATA_CENTERS_DELETE_ERROR,
        data: errorData
    };
    const actionFetchError = {
        actionType: actionTypes.DATA_CENTERS_FETCH_ERROR,
        data: errorData
    };
    const actionUpdateError = {
        actionType: actionTypes.DATA_CENTERS_UPDATE_ERROR,
        data: errorData
    };

    function actionCreateSuccess(data) {
        return {
            actionType: actionTypes.DATA_CENTERS_CREATE_SUCCESS,
            data
        };
    }
    function actionDeleteSuccess(id) {
        return {
            actionType: actionTypes.DATA_CENTERS_DELETE_SUCCESS,
            id
        };
    }
    function actionFetchSuccess(data) {
        return {
            actionType: actionTypes.DATA_CENTERS_FETCH_SUCCESS,
            data
        };
    }
    function actionUpdateSuccess(data) {
        return {
            actionType: actionTypes.DATA_CENTERS_UPDATE_SUCCESS,
            data
        };
    }

    const actionResetActionError = {
        actionType: actionTypes.DATA_CENTERS_RESET_ACTION_ERROR
    };

    const actionSetAction = {
        actionType: actionTypes.DATA_CENTERS_SET_ACTION,
        type: 'add'
    };

    beforeEach(() => {
        appDispatcher = require('../../dispatcher/appDispatcher');
        dataCentersStore = require('../dataCentersStore');
        callback = appDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(appDispatcher.register.mock.calls.length).toBe(1);
    });

    it('is initialized', () => {
        const dataCentersState = dataCentersStore.getState().toJS();

        // is initialized with no action
        const actionData = dataCentersState.actionData;
        const actionType = dataCentersState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // initializes with no data
        const dataCenters = dataCentersState.dataCenters;
        expect(dataCenters).toEqual([]);

        // initializes with no errors
        const errorResponse = dataCentersState.errorResponse;
        const hasError = dataCentersState.hasError;
        expect(errorResponse).toBeNull();
        expect(hasError).toBe(false);

        // initializes as not loading
        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('is loading while creating', () => {
        callback(actionCreate);
        const isLoading = dataCentersStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while deleting', () => {
        callback(actionDelete);
        const isLoading = dataCentersStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while fetching', () => {
        callback(actionFetch);
        const isLoading = dataCentersStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('is loading while updating', () => {
        callback(actionUpdate);
        const isLoading = dataCentersStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('handles create error', () => {
        callback(actionCreateError);

        const dataCentersState = dataCentersStore.getState().toJS();

        const errorResponse = dataCentersState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = dataCentersState.hasError;
        expect(hasError).toBe(true);

        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles delete error', () => {
        callback(actionDeleteError);

        const dataCentersState = dataCentersStore.getState().toJS();

        const errorResponse = dataCentersState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = dataCentersState.hasError;
        expect(hasError).toBe(true);

        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch error', () => {
        callback(actionFetchError);

        const dataCentersState = dataCentersStore.getState().toJS();

        const errorResponse = dataCentersState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = dataCentersState.hasError;
        expect(hasError).toBe(true);

        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles update error', () => {
        callback(actionUpdateError);

        const dataCentersState = dataCentersStore.getState().toJS();

        const errorResponse = dataCentersState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = dataCentersState.hasError;
        expect(hasError).toBe(true);

        const isLoading = dataCentersState.isLoading;
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
        const dataCentersState = dataCentersStore.getState().toJS();
        const dataCenters = dataCentersState.dataCenters;

        // resets actions attributes
        const actionData = dataCentersState.actionData;
        const actionType = dataCentersState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Data Center data
        const length = dataCenters.length;
        expect(length).toBe(2);

        // sorts all data
        expect(dataCenters[0]).toEqual(data[1]);

        // is not loading
        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);

        // parses country and timezone attributes
        expect(dataCenters[0].country.id).toEqual(country);
        expect(dataCenters[0].timezone.id).toEqual(timezone);
    });

    it('handles delete success', () => {
        const data = getData();

        let dataCentersState = dataCentersStore.getState().toJS();
        let dataCenters = dataCentersState.dataCenters;

        // seeds actions attributes to test reset
        callback(actionSetAction);

        // seeds dataCenters to test delete
        dataCenters.push(data[0]);

        // seeds isLoading to test reset
        dataCentersState.isLoading = true;

        // initialize delete success
        callback(actionDeleteSuccess(data[0].id));

        // get updated state
        dataCentersState = dataCentersStore.getState().toJS();
        dataCenters = dataCentersState.dataCenters;

        // resets actions attributes
        const actionData = dataCentersState.actionData;
        const actionType = dataCentersState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // adds Data Center data
        const length = dataCenters.length;
        expect(length).toBe(0);

        // is not loading
        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch success', () => {
        const data = getData();

        callback(actionFetchSuccess(data));

        const dataCentersState = dataCentersStore.getState().toJS();
        const dataCenters = dataCentersState.dataCenters;

        // gets all data
        const length = dataCenters.length;
        expect(length).toBe(2);

        // sorts all data
        expect(dataCenters[0]).toEqual(data[1]);
        expect(dataCenters[1]).toEqual(data[0]);

        // is not loading
        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);

        // parses country and timezone attributes
        expect(dataCenters[0].country.id).toEqual(country);
        expect(dataCenters[0].timezone.id).toEqual(timezone);
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
        const dataCentersState = dataCentersStore.getState().toJS();
        const dataCenters = dataCentersState.dataCenters;

        // resets actions attributes
        const actionData = dataCentersState.actionData;
        const actionType = dataCentersState.actionType;
        expect(actionData).toEqual(null);
        expect(actionType).toEqual(null);

        // updates Data Center data
        expect(dataCenters[0].name).toEqual(updateData.name);

        // is not loading
        const isLoading = dataCentersState.isLoading;
        expect(isLoading).toBe(false);

        // parses country and timezone attributes
        expect(dataCenters[0].country.id).toEqual(country);
        expect(dataCenters[0].timezone.id).toEqual(timezone);
    });

    it('handles reset action error', () => {

        // seeds error attributes to test reset
        callback(actionCreateError);

        callback(actionResetActionError);

        const dataCentersState = dataCentersStore.getState().toJS();

        const errorResponse = dataCentersState.errorResponse;
        expect(errorResponse).toBeNull();

        const hasError = dataCentersState.hasError;
        expect(hasError).toBe(false);
    });

    it('handles set action', () => {
        callback(actionSetAction);

        const dataCentersState = dataCentersStore.getState().toJS();

        // has actions attributes values
        const actionData = dataCentersState.actionData;
        const actionType = dataCentersState.actionType;
        expect(actionData).toEqual({});
        expect(actionType).toEqual('add');
    });

    it('returns the API payload', () => {
        const data = getData();

        // seeds store with Data Center that has parsed country and timezone
        callback(actionCreateSuccess(data[1]));

        const dataCenters = dataCentersStore.getState().get('dataCenters').toJS();
        const apiPayload = dataCentersStore.getApiPayload(dataCenters[0]);

        // reverses the parse for country attribute
        expect(apiPayload.country).toEqual(country);

        // reverses the parse for timezone attribute
        expect(apiPayload.timezone).toEqual(timezone);
    });

    it('returns a Data Center model', () => {
        const dataCenterModel = dataCentersStore.getModel();
        expect(dataCenterModel).toEqual(model);
    });

});
