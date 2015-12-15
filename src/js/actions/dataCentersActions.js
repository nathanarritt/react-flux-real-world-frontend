import actionTypes from '../constants/actionTypes';
import {sendRequest, processErrorResponse} from '../utils/apiUtils';
import appDispatcher from '../dispatcher/appDispatcher';

const apiResource = 'datacenters';

function createError(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_CREATE_ERROR,
        data
    });
}

function createSuccess(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_CREATE_SUCCESS,
        data
    });
}

export function create(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_CREATE
    });

    sendRequest('post', apiResource, data)
        .then(response => {
            createSuccess(response.data);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
            createError(response.data);
        });
}

function fetchError(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_FETCH_ERROR,
        data
    });
}

function fetchSuccess(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_FETCH_SUCCESS,
        data
    });
}

export function fetch() {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_FETCH
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

function removeError(id, data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_DELETE_ERROR,
        data,
        id
    });
}

function removeSuccess(id) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_DELETE_SUCCESS,
        id
    });
}

export function remove(id) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_DELETE
    });

    sendRequest('delete', `${apiResource}/${id}`)
        .then(() => {
            removeSuccess(id);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
            removeError(id, response.data);
        });
}

export function resetActionError() {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_RESET_ACTION_ERROR
    });
}

export function setAction(type, data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_SET_ACTION,
        data,
        type
    });
}

function updateError(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_UPDATE_ERROR,
        data
    });
}

function updateSuccess(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_UPDATE_SUCCESS,
        data
    });
}

export function update(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.DATA_CENTERS_UPDATE
    });

    sendRequest('put', `${apiResource}/${data.id}`, data)
        .then(response => {
            updateSuccess(response.data);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
            updateError(response.data);
        });
}

export default {
    create,
    fetch,
    remove,
    resetActionError,
    setAction,
    update
};
