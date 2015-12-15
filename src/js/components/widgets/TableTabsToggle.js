import React, {Component} from 'react';

import ConfirmDeleteModal from '../library/ConfirmDeleteModal';
import Modal from '../library/Modal';
import NestedTable from '../library/NestedTable';
import Toolbar from '../library/Toolbar';

import tableNestedTableActions from '../../actions/tableNestedTableActions';
import tableTabsToggleActions from '../../actions/tableTabsToggleActions';
import tableTabsToggleStore from '../../stores/tableTabsToggleStore';
import TableTabsToggleTabs from './TableTabsToggleTabs';

function getTableConfig() {
    return {
        columns: [
            {
                attribute: 'name',
                label: 'NAME',
                width: 25
            },/*
            {
                attribute: 'node',
                formatter(data, attribute) {
                    return data[attribute].name;
                },
                label: 'NODE',
                width: 25
            },*/
            {
                attribute: 'type',
                formatter(data, attribute) {
                    return data[attribute].name;
                },
                label: 'TYPE',
                width: 50
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
}

function getTableToolbarConfig() {
    return [
        {
            action: this.handleActionOpen,
            icon: 'fa fa-plus-circle',
            label: 'RFRWF_ADD_NEW_TABLE_TABS_TOGGLE',
            type: 'link'
        }
    ];
}

function getTableChildConfig() {
    return {
        columns: [
            {
                attribute: 'name',
                label: 'CLUSTER_NAME',
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
                attribute: 'description',
                label: 'DESCRIPTION',
                width: 55
            }
        ]
    };
}

function getTableLayout() {
    const {
        actionData, actionType, isLoading, selectedInstance, instances
    } = this.state;

    const isConfirmAction = actionType === 'confirm';

    return (
        <div className="page-content with-scroll">
            <Toolbar config={getTableToolbarConfig.call(this)} />
            <NestedTable
                childConfig={getTableChildConfig()}
                childData={selectedInstance.zenClusters}
                childDataSource={this.handleChildRow}
                config={getTableConfig.call(this)}
                data={instances}
                isLoading={isLoading}
                withToolbar />
            {isConfirmAction &&
                <ConfirmDeleteModal
                    data={actionData}
                    handleClose={this.handleActionClose}
                    handleConfirm={this.handleDelete}
                    isLoading={isLoading} />
            }
        </div>
    );
}

export default class TableTabsToggle extends Component {
    constructor(props) {
        super(props);
        this.state = tableTabsToggleStore.getState().toJS();
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentWillMount() {
        tableTabsToggleStore.addChangeListener(this.handleStateChange);
    }

    componentDidMount() {
        tableTabsToggleActions.fetch();
    }

    componentWillUnmount() {
        tableTabsToggleStore.removeChangeListener(this.handleStateChange);
    }

    handleActionClose() {
        tableTabsToggleActions.setAction(null);
    }

    handleActionOpen(data) {
        const type = data ? 'edit' : 'add';
        tableTabsToggleActions.setAction(type, data);
    }

    handleActionSave(data) {
        data = tableTabsToggleStore.getApiPayload(data);

        if (data.id) {
            tableTabsToggleActions.update(data);
        } else {
            tableTabsToggleActions.create(data);
        }
    }

    handleChildRow(data) {
        tableTabsToggleActions.setSelectedInstance(data);
        tableNestedTableActions.fetch();
    }

    handleDelete(data) {
        data = tableTabsToggleStore.getApiPayload(data);

        tableTabsToggleActions.remove(data);
    }

    handleDeleteConfirm(data) {
        tableTabsToggleActions.setAction('confirm', data);
    }

    handleResetActionError() {
        tableTabsToggleActions.resetActionError();
    }

    handleStateChange() {
        this.setState(tableTabsToggleStore.getState().toJS());
    }

    render() {
        const {actionData, actionType, hasError, isLoading} = this.state;
        const isFormAction = /add|edit/.test(actionType);

        const errorResponse = this.state.errorResponse || {};

        return (
            <div className="page-content with-scroll">
                {isFormAction ? (
                    <TableTabsToggleTabs
                        data={actionData}
                        handleClose={this.handleActionClose}
                        handleSave={this.handleActionSave}
                        isLoading={isLoading} />
                ) : (
                    getTableLayout.call(this)
                )}
                {hasError &&
                    <Modal
                        handleAlert={this.handleResetActionError}
                        title={errorResponse.code}>
                        <p>{errorResponse.message}</p>
                    </Modal>
                }
            </div>
        );
    }
}
