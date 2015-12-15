jest.dontMock('../basicTableStore');
jest.dontMock('../../utils/storeUtils');

describe('basicTableStore', () => {

    const actionTypes = require('../../constants/actionTypes');
    let appDispatcher;
    let basicTableStore;
    let callback;

    function getData() {
        return [
            {
                "id": 0,
                "name": "Thing One",
                "description": "Thing One Description",
                "createTime": 0,
                "lastModifiedTime": 0,
                "lastModifiedUser": null
            },
            {
                "id": 6,
                "name": "Thing Two",
                "description": "Thing Two Description",
                "createTime": 0,
                "lastModifiedTime": 0,
                "lastModifiedUser": null
            }
        ];
    }

    const errorData = {
        code: 'ERROR_CODE',
        message: 'Error data'
    };

    // mock actions
    const actionFetch = {
        actionType: actionTypes.BASIC_TABLE_FETCH
    };

    const actionFetchError = {
        actionType: actionTypes.BASIC_TABLE_FETCH_ERROR,
        data: errorData
    };

    function actionFetchSuccess(data) {
        return {
            actionType: actionTypes.BASIC_TABLE_FETCH_SUCCESS,
            data
        };
    }

    const actionResetActionError = {
        actionType: actionTypes.BASIC_TABLE_RESET_ACTION_ERROR
    };

    beforeEach(() => {
        appDispatcher = require('../../dispatcher/appDispatcher');
        basicTableStore = require('../basicTableStore');
        callback = appDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', () => {
        expect(appDispatcher.register.mock.calls.length).toBe(1);
    });

    it('is initialized', () => {
        const basicTableState = basicTableStore.getState().toJS();

        // initializes with no data
        const basicTables = basicTableState.basicTables;
        expect(basicTables).toEqual([]);

        // initializes as not loading
        const isLoading = basicTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('is loading while fetching', () => {
        callback(actionFetch);
        const isLoading = basicTableStore.getState().get('isLoading');
        expect(isLoading).toBe(true);
    });

    it('handles fetch error', () => {
        callback(actionFetchError);

        const basicTableState = basicTableStore.getState().toJS();

        const errorResponse = basicTableState.errorResponse;
        expect(errorResponse).toEqual(errorData);

        const hasError = basicTableState.hasError;
        expect(hasError).toBe(true);

        const isLoading = basicTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles fetch success', () => {
        const data = getData();

        callback(actionFetchSuccess(data));

        const basicTableState = basicTableStore.getState().toJS();
        const basicTables = basicTableState.basicTables;

        // gets all data
        const length = basicTables.length;
        expect(length).toBe(2);

        // sorts all data
        expect(basicTables[0]).toEqual(data[1]);
        expect(basicTables[1]).toEqual(data[0]);

        // is not loading
        const isLoading = basicTableState.isLoading;
        expect(isLoading).toBe(false);
    });

    it('handles reset action error', () => {

        // seeds error attributes to test reset
        callback(actionFetchError);

        callback(actionResetActionError);

        const basicTableState = basicTableStore.getState().toJS();

        const errorResponse = basicTableState.errorResponse;
        expect(errorResponse).toBeNull();

        const hasError = basicTableState.hasError;
        expect(hasError).toBe(false);
    });

});
