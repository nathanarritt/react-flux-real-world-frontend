import actionTypes from '../constants/actionTypes';
import {sendRequest, processErrorResponse} from '../utils/apiUtils';
import appDispatcher from '../dispatcher/appDispatcher';

const apiResource = 'tableTabsToggle';

function createError(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_CREATE_ERROR,
        data
    });
}

function createSuccess(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_CREATE_SUCCESS,
        data
    });
}

export function create(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_CREATE
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
        actionType: actionTypes.TABLE_TABS_TOGGLE_FETCH_ERROR,
        data
    });
}

function fetchSuccess(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_FETCH_SUCCESS,
        data
    });
}

export function fetch() {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_FETCH
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
        actionType: actionTypes.TABLE_TABS_TOGGLE_DELETE_ERROR,
        data,
        id
    });
}

function removeSuccess(id) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_DELETE_SUCCESS,
        id
    });
}

export function remove(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_DELETE
    });

    sendRequest('delete', `${apiResource}/${data.id}`)
        .then(() => {
            removeSuccess(data.id);
        })
        .catch(response => {
            processErrorResponse(apiResource, response);
            removeError(data.id, response.data);
        });
}

export function resetActionError() {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_RESET_ACTION_ERROR
    });
}

export function setAction(type, data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_SET_ACTION,
        data,
        type
    });
}

export function setSelectedInstance(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_SET_SELECTED_INSTANCE,
        data
    });
}

function updateError(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_UPDATE_ERROR,
        data
    });
}

function updateSuccess(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_UPDATE_SUCCESS,
        data
    });
}

export function update(data) {
    appDispatcher.dispatch({
        actionType: actionTypes.TABLE_TABS_TOGGLE_UPDATE
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
    setSelectedInstance,
    update
};
