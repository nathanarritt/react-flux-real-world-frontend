import _ from 'lodash';
import React, {Component, PropTypes} from 'react';

import Form from '../library/forms/Form';
import Modal from '../library/Modal';
import {bindValidations} from '../../utils/validationUtils.js';

import thingNamesStore from '../../stores/generated-data/thingNamesStore';
import dataCentersActions from '../../actions/dataCentersActions';
import dataCentersStore from '../../stores/dataCentersStore';
import tableToolbarModalStore from '../../stores/tableToolbarModalStore';

export default class TableToolbarModalModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thingNames: thingNamesStore.getState().get('thingNames').toJS(),
            dataCenters: [],
            fieldErrors: {},
            fieldValues: _.defaults({}, _.cloneDeep(props.data), tableToolbarModalStore.getModel()),
            hasError: false
        };
        this.handleDataCentersStateChange = this.handleDataCentersStateChange.bind(this);
        this.handleFieldValue = this.handleFieldValue.bind(this);
        this.handleSave = this.handleSave.bind(this);

        bindValidations({
            thing: 'required',
            datacenters: 'required',
            name: 'required'
        }, this);
    }

    componentWillMount() {
        dataCentersStore.addChangeListener(this.handleDataCentersStateChange);
    }

    componentWillUnmount() {
        dataCentersStore.removeChangeListener(this.handleDataCentersStateChange);
    }

    getDataCenters() {
        dataCentersActions.fetch();
    }

    handleDataCentersStateChange() {
        this.setState({
            dataCenters: dataCentersStore.getState().get('dataCenters').toJS()
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

    render() {
        const {fieldErrors, fieldValues, hasError} = this.state;

        const formConfig = {
            elements: [
                {
                    type: 'heading',
                    label: 'REGION'
                },
                {
                    type: 'section',
                    rows: [
                        [
                            {
                                attribute: 'name',
                                autofocus: true,
                                element: 'input',
                                error: fieldErrors.name,
                                forceDirection: 'left',
                                label: 'NAME',
                                placeholder: 'TYPE_THE_REGION_NAME',
                                type: 'text'
                            }
                        ],
                        [
                            {
                                attribute: 'thing',
                                element: 'dropDown',
                                error: fieldErrors.thing,
                                label: 'THING',
                                list: this.state.thingNames,
                                placeholder: 'CHOOSE_THING'
                            },
                            {
                                allowSelectAll: true,
                                attribute: 'datacenters',
                                element: 'multiSelect',
                                error: fieldErrors.datacenters,
                                label: 'DATA_CENTERS',
                                list: this.state.dataCenters,
                                listSource: this.getDataCenters,
                                placeholder: 'CHOOSE_DATA_CENTERS'
                            }
                        ]
                    ]
                },
                {
                    type: 'heading',
                    label: 'REGION_DESCRIPTION'
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
            ],
            defaultAction: this.handleFieldValue
        };

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

TableToolbarModalModal.propTypes = {
    data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};
