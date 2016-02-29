import React, {Component} from 'react';

import ConfirmDeleteModal from '../library/ConfirmDeleteModal';
import Modal from '../library/Modal';
import NestedTable from '../library/NestedTable';
import Toolbar from '../library/Toolbar';

import tableTabsToggleActions from '../../actions/tableTabsToggleActions';
import tableNestedTableActions from '../../actions/tableNestedTableActions';
import tableNestedTableStore from '../../stores/tableNestedTableStore';
import TableNestedTableModal from './TableNestedTableModal';

export default class TableNestedTable extends Component {
    constructor(props) {
        super(props);
        this.state = tableNestedTableStore.getState().toJS();
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentWillMount() {
        tableNestedTableStore.addChangeListener(this.handleStateChange);
    }

    componentDidMount() {
        tableNestedTableActions.fetch();
    }

    componentWillUnmount() {
        tableNestedTableStore.removeChangeListener(this.handleStateChange);
    }

    handleActionClose() {
        tableNestedTableActions.setAction(null);
    }

    handleActionOpen(data) {
        const type = data ? 'edit' : 'add';
        tableNestedTableActions.setAction(type, data);
    }

    handleActionSave(data) {
        data = tableNestedTableStore.getApiPayload(data);

        if (data.id) {
            tableNestedTableActions.update(data);
        } else {
            tableNestedTableActions.create(data);
        }
    }

    handleChildRow(data) {
        tableNestedTableActions.setSelectedCluster(data);
        tableTabsToggleActions.fetch();
    }

    handleDelete(data) {
        data = tableNestedTableStore.getApiPayload(data);

        tableNestedTableActions.remove(data);
    }

    handleDeleteConfirm(data) {
        tableNestedTableActions.setAction('confirm', data);
    }

    handleResetActionError() {
        tableNestedTableActions.resetActionError();
    }

    handleStateChange() {
        this.setState(tableNestedTableStore.getState().toJS());
    }

    render() {
        const addNewTitle = 'RFRWF_ADD_NEW_TABLE_NESTED_TABLE';

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
                    label: 'NAME',
                    width: 25
                },
                {
                    attribute: 'type',
                    formatter(data, attribute) {
                        return data[attribute].name;
                    },
                    label: 'TYPE',
                    width: 20
                },
                {
                    attribute: 'subnet',
                    label: 'SUBNET',
                    width: 55
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
            ]
        };

        const tableChildConfig = {
            columns: [
                {
                    attribute: 'name',
                    label: 'INSTANCE_NAME',
                    width: 25
                },
                {
                    attribute: 'node',
                    formatter(data, attribute) {
                        return data[attribute].name;
                    },
                    label: 'NODE',
                    width: 20
                },
                {
                    attribute: 'type',
                    formatter(data, attribute) {
                        return data[attribute].name;
                    },
                    label: 'TYPE',
                    width: 55
                }
            ]
        };

        const {
            actionData, actionType, hasError, isLoading,
            selectedCluster, tableNestedTables
        } = this.state;

        const errorResponse = this.state.errorResponse || {};

        const isConfirmAction = actionType === 'confirm';
        const isFormAction = /add|edit/.test(actionType);
        const actionTitle = actionType === 'edit' ? 'RFRWF_EDIT_TABLE_NESTED_TABLE' : addNewTitle;

        return (
            <div className="page-content with-scroll">
                <Toolbar config={toolbarConfig} />
                <NestedTable
                    childConfig={tableChildConfig}
                    childData={selectedCluster.instances}
                    config={tableConfig}
                    data={tableNestedTables}
                    isLoading={isLoading}
                    onChildDataSource={this.handleChildRow}
                    withToolbar
                />
                {isFormAction &&
                    <TableNestedTableModal
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
