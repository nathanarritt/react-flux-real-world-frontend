import _ from 'lodash';
import React, {Component, PropTypes} from 'react';

import Form from '../library/forms/Form';
import Modal from '../library/Modal';
import {bindValidations} from '../../utils/validationUtils.js';

import tableTabsToggleActions from '../../actions/tableTabsToggleActions';
import tableTabsToggleStore from '../../stores/tableTabsToggleStore';
import tableNestedTableStore from '../../stores/tableNestedTableStore';
import tableNestedTableTypesStore from '../../stores/generated-data/tableNestedTableTypesStore';

function getClusterInfoConfig() {
    const {
        fieldErrors, fieldValues, smeInstances, smlbInstances, tableNestedTableTypes
    } = this.state;

    const clusterType = fieldValues.type;

    const cluster = [
        {
            type: 'heading',
            label: 'TABLE_NESTED_TABLE'
        }
    ];

    // Initialize with common values. Then dynamically add `smLbInstances`
    // field and/or `disabled` (Status) based on type attribute
    const clusterInfoSection = {
        type: 'section',
        rows: [
            [
                {
                    attribute: 'name',
                    autofocus: true,
                    element: 'input',
                    error: fieldErrors.name,
                    label: 'NAME',
                    placeholder: 'TYPE_THE_NAME',
                    type: 'text'
                },
                {
                    attribute: 'type',
                    element: 'dropDown',
                    error: fieldErrors.type,
                    label: 'TYPE',
                    list: tableNestedTableTypes,
                    placeholder: 'CHOOSE_TYPE'
                }
            ],
            [
                {
                    checkboxGroup: [
                        {
                            attribute: 'pacUsage',
                            label: 'PAC'
                        },
                        {
                            attribute: 'greUsage',
                            label: 'GRE'
                        },
                        {
                            attribute: 'smikeUsage',
                            label: 'SMIKE'
                        }
                    ],
                    element: 'checkboxGroup',
                    label: 'CLUSTER_USAGE'
                }
            ],
            [
                {
                    attribute: 'subnet',
                    element: 'input',
                    error: fieldErrors.subnet,
                    label: 'SUBNET',
                    placeholder: 'TYPE_THE_SUBNET',
                    type: 'text'
                },
                {
                    allowSelectAll: true,
                    attribute: 'smeInstances',
                    element: 'multiSelect',
                    error: fieldErrors.smeInstances,
                    label: 'SME_INSTANCES',
                    list: smeInstances,
                    listSource: this.getInstances,
                    placeholder: 'CHOOSE_SME_INSTANCES'
                }
            ]
        ]
    };

    const smLbInstancesConfig = {
        allowSelectAll: true,
        attribute: 'smLbInstances',
        element: 'multiSelect',
        error: fieldErrors.smLbInstances,
        label: 'SMLB_INSTANCES',
        list: smlbInstances,
        listSource: this.getInstances,
        placeholder: 'CHOOSE_SMLB_INSTANCES'
    };

    const statusConfig = {
        attribute: 'disabled',
        element: 'radioButtons',
        label: 'STATUS',
        options: ['ENABLE', 'DISABLE']
    };

    if (clusterType && clusterType.id === 'TABLE_NESTED_TABLE_TYPE_ONE') {
        clusterInfoSection.rows.push([smLbInstancesConfig, statusConfig]);
    } else {
        clusterInfoSection.rows.push([statusConfig]);
    }

    cluster.push(clusterInfoSection);

    return cluster;
}

function getClusterDescriptionConfig() {
    return [
        {
            type: 'heading',
            label: 'TABLE_NESTED_TABLE_DESCRIPTION'
        },
        {
            type: 'section',
            rows: [
                [
                    {
                        attribute: 'description',
                        element: 'textarea',
                        label: 'DESCRIPTION',
                        placeholder: 'TYPE_YOUR_DESCRIPTION'
                    }
                ]
            ]
        }
    ];
}

function getAdvancedSectionConfig() {
    return [
        {
            type: 'toggleSection',
            label: 'ADVANCED_SETTINGS',
            rows: [
                [
                    {
                        attribute: 'rebalanceDistributionEnabled',
                        element: 'toggleButton',
                        label: 'REBALANCE_DISTRIBUTION'
                    },
                    {
                        attribute: 'sublocationLbEnabled',
                        element: 'toggleButton',
                        label: 'SUBLOCATION_LOAD_BALANCING'
                    }
                ],
                [
                    {
                        attribute: 'authLocationLbEnabled',
                        element: 'toggleButton',
                        label: 'AUTH_LOCATION_LOAD_BALANCING'
                    },
                    {
                        attribute: 'smikeHealthMonitoringEnabled',
                        element: 'toggleButton',
                        label: 'SMIKE_HEALTH_MONITORING'
                    }
                ],
                [
                    {
                        attribute: 'locationLookupDisabled',
                        element: 'toggleButton',
                        label: 'LOCATION_LOOKUP'
                    },
                    {
                        attribute: 'vipMonitoringDisabled',
                        element: 'toggleButton',
                        label: 'VIP_MONITORING'
                    }
                ],
                [
                    {
                        attribute: 'internalIpSwitchingOnGreDisabled',
                        element: 'toggleButton',
                        label: 'INTERNAL_GRE_SWITCHING'
                    }
                ]
            ]
        }
    ];
}

function getFormConfig() {
    const clusterType = this.state.fieldValues.type;

    const formConfig = {
        elements: [],
        defaultAction: this.handleFieldValue,
        forceUpdate: this.forceUpdate.bind(this)
    };

    formConfig.elements = formConfig.elements.concat(
        getClusterInfoConfig.call(this),
        getClusterDescriptionConfig.call(this)
    );

    if (clusterType && clusterType.id === 'TABLE_NESTED_TABLE_TYPE_ONE') {
        formConfig.elements = formConfig.elements.concat(
            getAdvancedSectionConfig.call(this)
        );
    }

    return formConfig;
}

export default class TableNestedTableModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldErrors: {},
            fieldValues: _.defaults({}, _.cloneDeep(props.data), tableNestedTableStore.getModel()),
            hasError: false,
            smeInstances: [],
            smlbInstances: [],
            tableNestedTableTypes: tableNestedTableTypesStore.getState().get('tableNestedTableTypes').toJS()
        };
        this.handleInstancesStateChange = this.handleInstancesStateChange.bind(this);
        this.handleFieldValue = this.handleFieldValue.bind(this);
        this.handleSave = this.handleSave.bind(this);

        bindValidations({
            name: 'required',
            smeInstances: 'required',
            smLbInstances: 'requiredIf(isTypeSmlb)',
            subnet: 'required ipAddressCidr',
            type: 'required'
        }, this);
    }

    componentWillMount() {
        tableTabsToggleStore.addChangeListener(this.handleInstancesStateChange);
    }

    componentWillUnmount() {
        tableTabsToggleStore.removeChangeListener(this.handleInstancesStateChange);
    }

    getInstances() {
        tableTabsToggleActions.fetch();
    }

    handleInstancesStateChange() {
        const instances = tableTabsToggleStore.getState().get('instances').toJS();
        const smeInstances = instances.filter(instance => {
            return instance.type.id === 'SME';
        });
        const smlbInstances = instances.filter(instance => {
            return instance.type.id === 'SMLB';
        });

        this.setState({
            smeInstances,
            smlbInstances
        });
    }

    handleFieldValue(data) {
        const {fieldErrors, fieldValues} = this.state;
        const {attribute, value} = data;

        fieldValues[attribute] = value;
        fieldErrors[attribute] = this.validate(fieldValues, attribute);

        this.setState({
            fieldErrors,
            fieldValues,
            hasError: this.validate.hasError
        });
    }

    handleSave() {
        const fieldValues = this.state.fieldValues;

        // validates field values for fields that have not changed
        const fieldErrors = this.validate(fieldValues);
        const hasError = this.validate.hasError;

        if (hasError) {
            this.setState({
                fieldErrors,
                hasError
            });
        } else {
            this.props.onSave(fieldValues);
        }
    }

    isTypeSmlb() {
        const type = this.state.fieldValues.type;

        if (type) {
            return type.id === 'SMLB';
        }

        return false;
    }

    render() {
        const {fieldValues, hasError} = this.state;

        const formConfig = getFormConfig.call(this);

        const {onClose, isLoading, title} = this.props;

        return (
            <Modal
                disableSave={hasError}
                isLoading={isLoading}
                onClose={onClose}
                onSave={this.handleSave}
                title={title}
            >
                <Form
                    config={formConfig}
                    data={fieldValues}
                />
            </Modal>
        );
    }
}

TableNestedTableModal.propTypes = {
    data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};
