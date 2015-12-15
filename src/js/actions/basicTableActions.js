import actionTypes from '../constants/actionTypes';
import {sendRequest, processErrorResponse} from '../utils/apiUtils';
import appDispatcher from '../dispatcher/appDispatcher';

const apiResource = 'basicTable';

function fetchError(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.BASIC_TABLE_FETCH_ERROR,
        data
    });
}

function fetchSuccess(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.BASIC_TABLE_FETCH_SUCCESS,
        data
    });
}

export function fetch() {
    appDispatcher.dispatch({
        actionType: actionTypes.BASIC_TABLE_FETCH
    });

    sendRequest('get', apiResource)
        .then(response => {
            fetchSuccess(response.data);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
            fetchError(response.data);
        });
}

export function resetActionError() {
    appDispatcher.dispatch({
        actionType: actionTypes.BASIC_TABLE_RESET_ACTION_ERROR
    });
}

export default {
    fetch,
    resetActionError
};
