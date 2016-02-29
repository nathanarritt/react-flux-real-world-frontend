import _ from 'lodash';
import React, {Component} from 'react';

import ConfirmDeleteModal from '../library/ConfirmDeleteModal';
import Modal from '../library/Modal';
import Table from '../library/Table';
import Toolbar from '../library/Toolbar';

import tableToolbarModalActions from '../../actions/tableToolbarModalActions';
import tableToolbarModalStore from '../../stores/tableToolbarModalStore';
import TableToolbarModalModal from './TableToolbarModalModal';

export default class TableToolbarModal extends Component {
    constructor(props) {
        super(props);
        this.state = tableToolbarModalStore.getState().toJS();
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentWillMount() {
        tableToolbarModalStore.addChangeListener(this.handleStateChange);
    }

    componentDidMount() {
        tableToolbarModalActions.fetch();
    }

    componentWillUnmount() {
        tableToolbarModalStore.removeChangeListener(this.handleStateChange);
    }

    handleActionClose() {
        tableToolbarModalActions.setAction(null);
    }

    handleActionOpen(data) {
        const type = data ? 'edit' : 'add';
        tableToolbarModalActions.setAction(type, data);
    }

    handleActionSave(data) {
        data = tableToolbarModalStore.getApiPayload(data);

        if (data.id) {
            tableToolbarModalActions.update(data);
        } else {
            tableToolbarModalActions.create(data);
        }
    }

    handleDelete(data) {
        data = tableToolbarModalStore.getApiPayload(data);

        tableToolbarModalActions.remove(data);
    }

    handleDeleteConfirm(data) {
        tableToolbarModalActions.setAction('confirm', data);
    }

    handleResetActionError() {
        tableToolbarModalActions.resetActionError();
    }

    handleStateChange() {
        this.setState(tableToolbarModalStore.getState().toJS());
    }

    render() {
        const addNewTitle = 'RFRWF_ADD_NEW_TABLE_TOOLBAR_MODAL';

        const toolbarConfig = [
            {
                action: this.handleActionOpen,
                icon: 'fa fa-plus-circle',
                label: addNewTitle,
                type: 'link'
            }
        ];

        const tableConfig = {
            columns: [
                {
                    attribute: 'name',
                    label: 'RFRWF_NAME',
                    width: 25
                },
                {
                    attribute: 'datacenters',
                    formatter(data, attribute) {
                        return _.map(data[attribute], item => {
                            return item.name;
                        }).join(', ');
                    },
                    label: 'DATA_CENTERS',
                    width: 75
                }
            ],
            controls: [
                {
                    action: this.handleActionOpen,
                    type: 'edit'
                },
                {
                    action: this.handleDeleteConfirm,
                    type: 'remove'
                }
            ],
            showRowNumber: true
        };

        const {
            actionData, actionType, hasError, isLoading, tableToolbarModals
        } = this.state;

        const errorResponse = this.state.errorResponse || {};

        const isConfirmAction = actionType === 'confirm';
        const isFormAction = /add|edit/.test(actionType);
        const actionTitle = actionType === 'edit' ? 'RFRWF_EDIT_TABLE_TOOLBAR_MODAL' : addNewTitle;

        return (
            <div className="page-content with-scroll">
                <Toolbar config={toolbarConfig} />
                <Table
                    config={tableConfig}
                    data={tableToolbarModals}
                    isLoading={isLoading}
                    withToolbar
                />
                {isFormAction &&
                    <TableToolbarModalModal
                        data={actionData}
                        isLoading={isLoading}
                        onClose={this.handleActionClose}
                        onSave={this.handleActionSave}
                        title={actionTitle}
                    />
                }
                {isConfirmAction &&
                    <ConfirmDeleteModal
                        data={actionData}
                        isLoading={isLoading}
                        onClose={this.handleActionClose}
                        onConfirm={this.handleDelete}
                    />
                }
                {hasError &&
                    <Modal
                        onAlert={this.handleResetActionError}
                        title={errorResponse.code}
                    >
                        <p>{errorResponse.message}</p>
                    </Modal>
                }
            </div>
        );
    }
}
