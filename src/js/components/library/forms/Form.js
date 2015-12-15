import React, {Component, PropTypes} from 'react';

import Checkbox from './Checkbox';
import DropDown from './DropDown';
import {formatMessage} from '../../../utils/localizationUtils';
import MultiSelect from './MultiSelect';
import RadioButtons from './RadioButtons';
import ToggleButton from './ToggleButton';

function handleCheckboxAction(action, attribute, value) {
    action({attribute, value: !value});
}

function handleInputData(value) {
    let output = value;
    if (Array.isArray(value) && (value.length > 0)) {
        output = value.map((val)=> {
            return typeof val === 'string' ? val : val.name;
        }).join(', ');
    } else if (value !== null && typeof value === 'object') {
        output = value.name;
    }

    return output;
}

// Normalize input and textarea with the same action value as custom components.
function handleTextInput(action, attribute, event) {
    action({attribute, value: event.target.value});
}

function getField(fieldConfig) {
    const {column, columnType, data, defaultAction, fieldId} = fieldConfig;

    const {
        action, allowSelectAll, attribute, autofocus, element, label, placeholder
    } = column;

    if (element === 'checkbox') {
        return (
            <Checkbox action={handleCheckboxAction.bind(
                          null, action || defaultAction, attribute, data[attribute]
                      )}
                      isChecked={data[attribute]}
                      label={formatMessage(label)} />
        );
    } else if (element === 'checkboxGroup') {
        const checkboxGroup = column.checkboxGroup;

        const checkboxes = checkboxGroup.map((checkbox, index) => {
            return (
                <Checkbox action={handleCheckboxAction.bind(
                              null, action || defaultAction, checkbox.attribute,
                              data[checkbox.attribute]
                          )}
                          isChecked={data[checkbox.attribute]}
                          key={index}
                          label={formatMessage(checkbox.label)} />
            );
        });

        return (
            <div className="form-checkbox-group">
                {checkboxes}
            </div>
        );
    } else if (element === 'dropDown') {
        const {list, listSource} = column;

        return (
            <DropDown
                action={action || defaultAction}
                attribute={attribute}
                list={list}
                listSource={listSource}
                placeholder={placeholder}
                value={data[attribute]} />
        );
    } else if (element === 'readOnly') {
        return (
            <input
                className="read-only"
                disabled="true"
                id={fieldId}
                name={attribute}
                type="text"
                value={handleInputData(data[attribute])} />
        );
    } else if (element === 'input') {
        const type = column.type || 'text';

        return (
            <input
                autoFocus={autofocus}
                id={fieldId}
                name={attribute}
                onChange={handleTextInput.bind(null, action || defaultAction, attribute)}
                placeholder={formatMessage(placeholder)}
                type={type}
                value={data[attribute]} />
        );
    } else if (element === 'multiSelect') {
        const {groupBy, list, listSource} = column;

        return (
            <MultiSelect
                action={action || defaultAction}
                allowSelectAll={allowSelectAll}
                attribute={attribute}
                expandDirection={columnType === 'right' ? 'left' : 'right'}
                groupBy={groupBy}
                list={list}
                listSource={listSource}
                placeholder={placeholder}
                value={data[attribute]} />
        );
    } else if (element === 'radioButtons') {
        const options = column.options;

        return (
            <RadioButtons
                action={action || defaultAction}
                attribute={attribute}
                options={options}
                value={data[attribute]} />
        );
    } else if (element === 'textarea') {
        let textareaValue = data[attribute];

        if (Array.isArray(textareaValue)) {
            textareaValue = textareaValue.join('\n');
        }

        return (
            <textarea
                id={fieldId}
                name={attribute}
                onChange={handleTextInput.bind(null, action || defaultAction, attribute)}
                placeholder={formatMessage(placeholder)}
                value={textareaValue} />
        );
    } else if (element === 'toggleButton') {
        return (
            <ToggleButton
                action={action || defaultAction}
                attribute={attribute}
                value={data[attribute]} />
        );
    }

    return null;
}

function getFieldId(attribute, element) {
    if (attribute && /input|textarea/.test(element)) {
        return `form-component-${element}-${attribute}`;
    }

    return null;
}

function getRowColumnItems(rowColumnItemsConfig) {
    const {column, columnType, data, defaultAction} = rowColumnItemsConfig;

    if (Array.isArray(column)) {
        return column.map((item, itemIndex) => {
            const {attribute, element, error, label} = item; // eslint-disable-line no-shadow
            const fieldId = getFieldId(attribute, element); // eslint-disable-line no-shadow

            return (
                <div className="form-column-item" key={itemIndex}>
                    <label htmlFor={fieldId}>
                        {formatMessage(label)}
                        {error &&
                            <div className="form-column-item-error">
                                <i className="fa fa-times-circle" />
                                <span className="error-message">{error}</span>
                            </div>
                        }
                    </label>
                    <div className={`form-column-item-field ${element} ${error ? 'has-error' : ''}`}>
                        {getField({
                            column: item,
                            columnType,
                            data,
                            defaultAction,
                            fieldId
                        })}
                    </div>
                </div>
            );
        });
    }

    const {attribute, element, error, label} = column;
    const fieldId = getFieldId(attribute, element);

    return (
        <div className="form-column-item">
            <label htmlFor={fieldId}>
                {formatMessage(label)}
                {error &&
                    <div className="form-column-item-error">
                        <i className="fa fa-times-circle" />
                        <span className="error-message">{error}</span>
                    </div>
                }
            </label>
            <div className={`form-column-item-field ${element} ${error ? 'has-error' : ''}`}>
                {getField({
                    column,
                    columnType,
                    data,
                    defaultAction,
                    fieldId
                })}
            </div>
        </div>
    );
}

function getRowColumns(rowColumnsConfig) {
    const {data, defaultAction, row} = rowColumnsConfig;

    return row.map((column, columnIndex) => {
        let columnType = column.forceDirection || '';

        if (row.length === 2) {
            if (columnIndex === 1) {
                columnType = 'right';
            } else {
                columnType = 'left';
            }
        }

        return (
            <div className={`form-column ${columnType}`} key={columnIndex}>
                {getRowColumnItems({
                    column,
                    columnType,
                    data,
                    defaultAction
                })}
            </div>
        );
    });
}

function getRows(rowsConfig) {
    const {config, data, defaultAction} = rowsConfig;

    return config.map((row, rowIndex) => {
        return (
            <div className="form-row" key={rowIndex}>
                {getRowColumns({
                    data,
                    defaultAction,
                    row
                })}
            </div>
        );
    });
}

function getSection(sectionConfig) {
    const {config, data, defaultAction, sectionKey} = sectionConfig;

    return (
        <div className="form-section" key={sectionKey}>
            {getRows({
                config,
                data,
                defaultAction
            })}
        </div>
    );
}

function getToggleSection(sectionConfig) {
    const {config, data, defaultAction, label, sectionKey} = sectionConfig;

    const isExpanded = this.state.toggleSections[sectionKey];

    return (
        <div className="form-toggle-section" key={sectionKey}>
            <div className={`form-heading toggle ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                 key={0}
                 onClick={this.handleToggleSection.bind(this, sectionKey)}>
                 <i className={`fa fa-caret-${isExpanded ? 'down' : 'right'} form-heading-toggle-icon`} />
                 {formatMessage(label)}
            </div>
            {isExpanded &&
                getSection({
                    config,
                    data,
                    defaultAction,
                    sectionKey: 1
                })
            }
        </div>
    );
}

/*
 * Form class.
 *
 * @class Form
 *
 * The config object is used for the form layout and functionality.
 *
 * The following attributes are available:
 *
 * elements {array} (required) Array of objects to define form elements
 *     - type {string} Type of element: heading, section
 *     - heading: label {string} Text to display
 *     - section: rows {array} Array of arrays containing objects with column
 *       configurations. Supports having two form fields in a single column,
 *       each with their own label, by adding another layer of array
 *       containing two configuration objects. See example below.
 *
 *     - Section Rows:
 *       - action {function} Method to handle the state change for this item.
 *         It needs to be bound to the main view component where state is
 *         managed. This property is optional and will default to
 *         defaultAction if this property is missing
 *       - allowSelectAll {boolean} Enable Select All functionality for multiSelect
 *       - attribute {string} Model attribute
 *       - autofocus {boolean} Set to true for input or textarea element if
 *         this item should be auto focused
 *       - element {string} Form element type:
 *         checkbox, checkboxGroup, dropDown, input, multiSelect,
 *         radioButtons, textarea, toggleButton
 *       - error {string} Validation error text to display
 *       - forceDirection {string} (left | right) Used to make a row with a
 *         single column element only use half of the column. Default is 100%.
 *       - groupBy {string} Model attribute used by multiSelect elements to
 *         group the selected and unselected values.
 *       - label {string} Text to use for form element label
 *       - list {array} Available options for dropDown and multiSelect elements
 *       - listSource {function} A method bound to the view where state is
 *         managed that fetches the list items
 *       - placeholder {string} Text to use for placeholder
 *       - type {string} Type attribute to set for input element (defaults to `text`)
 *
 * defaultAction {function} (required if not setting action for every section element)
 *     Method bound to the main view component. If all or most of the form
 *     elements use the same method, use this option. Otherwise, include an action
 *     property with each column data object under type: 'section'
 *
 * @example <caption>Example usage:</caption>
 *
 * const formConfig = {
 *     elements: [
 *         {
 *             type: 'heading',
 *             label: 'SOME_HEADING_TEXT_KEY'
 *         },
 *         {
 *             type: 'section',
 *             rows: [
 *                 [
 *                     // left column with a single form field (this is common use case)
 *                     {
 *                         attribute: 'name',
 *                         autofocus: true,
 *                         element: 'input',
 *                         forceDirection: 'left',
 *                         label: 'NAME',
 *                         placeholder: 'TYPE_THE_DATA_CENTER_NAME',
 *                         type: 'text'
 *                     },
 *                     // right column with an array of two configuration objects puts
 *                     // two form fields in the same column container (uncommon use case)
 *                     [
 *                         {
 *                             action: this.setDataCentersValue.bind(this),
 *                             allowSelectAll: true,
 *                             attribute: 'datacenters',
 *                             element: 'multiSelect',
 *                             label: 'DATA_CENTERS',
 *                             list: this.state.dataCenters,
 *                             listSource: this.getDataCenters.bind(this),
 *                             placeholder: 'CHOOSE_DATA_CENTERS'
 *                         },
 *                         {
 *                             action: this.setTimeZoneValue.bind(this),
 *                             attribute: 'timezone',
 *                             element: 'dropDown',
 *                             label: 'TIME_ZONE',
 *                             list: this.state.timeZones,
 *                             listSource: this.getTimeZones.bind(this),
 *                             placeholder: 'CHOOSE_TIME_ZONE'
 *                         }
 *                     ]
 *                 ]
 *             ]
 *         }
 *     ],
 *     defaultAction: this.handleChange.bind(this)
 * };
 *
 */
export default class Form extends Component {
    constructor() {
        super();
        this.state = {
            toggleSections: {}
        };
    }

    handleToggleSection(sectionKey) {
        const toggleSections = this.state.toggleSections;

        if (typeof toggleSections[sectionKey] === 'boolean') {
            toggleSections[sectionKey] = !toggleSections[sectionKey];
        } else {
            toggleSections[sectionKey] = true;
        }

        this.setState({
            toggleSections
        });

        const forceUpdate = this.props.config.forceUpdate;

        if (typeof forceUpdate === 'function') {
            forceUpdate();
        }
    }

    render() {
        const {config, data} = this.props;

        const content = config.elements.map((element, index) => {
            if (element.type === 'heading') {
                return (
                    <div className="form-heading" key={index}>
                        {formatMessage(element.label)}
                    </div>
                );
            }

            if (element.type === 'section') {
                return getSection({
                    config: element.rows,
                    data,
                    defaultAction: config.defaultAction,
                    sectionKey: index
                });
            }

            if (element.type === 'toggleSection') {
                return getToggleSection.call(this, {
                    config: element.rows,
                    data,
                    defaultAction: config.defaultAction,
                    label: element.label,
                    sectionKey: index
                });
            }
        });

        return (
            <div className="form-component">
                {content}
            </div>
        );
    }
}

Form.propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};
