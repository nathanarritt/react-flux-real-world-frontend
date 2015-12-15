import _ from 'lodash';
import React, {Component, PropTypes} from 'react';

import Form from '../library/forms/Form';
import {bindValidations} from '../../utils/validationUtils.js';

import thingNamesStore from '../../stores/generated-data/thingNamesStore';
import hardwaresActions from '../../actions/hardwaresActions';
import hardwaresStore from '../../stores/hardwaresStore';
import tableTabsToggleStore from '../../stores/tableTabsToggleStore';

export default class TableTabsToggleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thingNames: thingNamesStore.getState().get('thingNames').toJS(),
            fieldErrors: {},
            fieldValues: _.defaults({}, _.cloneDeep(props.data), tableTabsToggleStore.getModel()),
            hardwares: [],
            hasError: false
        };
        this.handleHardwaresStateChange = this.handleHardwaresStateChange.bind(this);

        bindValidations({
            thing: 'required',
            hardware: 'required',
            type: 'required'
        }, this);
    }

    componentWillMount() {
        hardwaresStore.addChangeListener(this.handleHardwaresStateChange);
    }

    componentWillUnmount() {
        hardwaresStore.removeChangeListener(this.handleHardwaresStateChange);
    }

    getHardwares() {
        hardwaresActions.fetch();
    }

    /**
     * @param {object} event Update state with user input
     * @return {undefined} No return value needed
     */
    handleChange(event) {
        const {fieldErrors, fieldValues} = this.state;
        const target = event.target;
        const attribute = target.name;
        const value = target.value;

        fieldValues[attribute] = value;
        fieldErrors[attribute] = this.validate(fieldValues, attribute);

        this.setState({
            fieldErrors,
            fieldValues,
            hasError: this.validate.hasError
        });
    }

    handleFieldValue(data) {
        const {fieldErrors, fieldValues} = this.state;
        const attribute = data.attribute;
        const value = data.value;

        fieldValues[attribute] = value;
        fieldErrors[attribute] = this.validate(fieldValues, attribute);

        this.setState({
            fieldErrors,
            fieldValues,
            hasError: this.validate.hasError
        });
    }

    handleHardwaresStateChange() {
        this.setState({
            hardwares: hardwaresStore.getState().get('hardwares').toJS()
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
            this.props.handleSave(fieldValues);
        }
    }

    render() {
        const {fieldErrors, fieldValues, hasError} = this.state;

        const formConfig = {
            elements: [
                {
                    type: 'heading',
                    label: 'SYSTEM'
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
                                action: this.handleFieldValue.bind(this),
                                attribute: 'thing',
                                element: 'dropDown',
                                error: fieldErrors.thing,
                                label: 'THING',
                                list: this.state.thingNames,
                                placeholder: 'CHOOSE_THING'
                            },
                            {
                                action: this.handleFieldValue.bind(this),
                                attribute: 'hardware',
                                element: 'dropDown',
                                error: fieldErrors.hardware,
                                label: 'HARDWARE',
                                list: this.state.hardwares,
                                placeholder: 'CHOOSE_HARDWARE'
                            }
                        ]
                    ]
                },
                {
                    type: 'heading',
                    label: 'OTHER'
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
            defaultAction: this.handleChange.bind(this)
        };

        const {handleClose, isLoading} = this.props;

        return (
            <Form config={formConfig} data={fieldValues} />
        );
    }
}

TableTabsToggleForm.propTypes = {
    data: PropTypes.object.isRequired,
    disableSave: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};
