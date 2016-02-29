import React, {Component, PropTypes} from 'react';

import {formatMessage} from '../../../utils/localizationUtils';

import Checkbox from './Checkbox';
import DropDown from './DropDown';
import ListBuilder from './ListBuilder';
import MultiSelect from './MultiSelect';
import RadioButtons from './RadioButtons';
import ToggleButton from './ToggleButton';

class Field extends Component {

    static propTypes = {
        column: PropTypes.shape({
            action: PropTypes.func,
            allowSelectAll: PropTypes.bool,
            attribute: PropTypes.string,
            autoFocus: PropTypes.bool,
            element: PropTypes.string,
            error: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.array
            ]),
            label: PropTypes.string,
            placeholder: PropTypes.string
        }),
        columnType: PropTypes.string,
        data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        defaultAction: PropTypes.func,
        fieldId: PropTypes.string
    };

    constructor() {
        super();
        this.handleCheckboxAction = this.handleCheckboxAction.bind(this);
        this.getInputValue = this.getInputValue.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
    }

    getInputValue() {
        const {column: {attribute, overrideValue}, data} = this.props;

        let value = data[attribute];

        if (overrideValue) {
            value = formatMessage(overrideValue);
        } else if (Array.isArray(value) && value.length > 0) {
            value = value.map(val => {
                return typeof val === 'string' ? val : val.name;
            }).join(', ');
        } else if (value !== null && typeof value === 'object') {
            value = value.name;
        }

        return value;
    }

    handleCheckboxAction(event) {
        const {
            column: {action, attribute, checkboxGroup, element},
            data,
            defaultAction
        } = this.props;

        const onAction = action || defaultAction;

        let actionAttribute = attribute;

        if (element === 'checkboxGroup') {
            const index = event.currentTarget.getAttribute('data-checkbox-id');
            actionAttribute = checkboxGroup[index].attribute;
        }

        const value = data[actionAttribute];

        onAction({attribute: actionAttribute, value: !value});
    }

    // Normalize input and textarea with the same action value as custom components.
    handleTextInput(event) {
        const {column: {action, attribute}, defaultAction} = this.props;
        const onAction = action || defaultAction;

        onAction({attribute, value: event.target.value});
    }

    render() {
        const {column, columnType, data, defaultAction, fieldId} = this.props;

        const {
            action, allowSelectAll, attribute, autoFocus, element, error, label,
            placeholder
        } = column;

        if (element === 'checkbox') {
            return (
                <Checkbox
                    isChecked={data[attribute]}
                    label={formatMessage(label)}
                    onAction={this.handleCheckboxAction}
                />
            );
        } else if (element === 'checkboxGroup') {
            const checkboxGroup = column.checkboxGroup;

            const checkboxes = checkboxGroup.map((checkbox, index) => {
                return (
                    <Checkbox
                        checkboxId={index}
                        isChecked={data[checkbox.attribute]}
                        key={index}
                        label={formatMessage(checkbox.label)}
                        onAction={this.handleCheckboxAction}
                    />
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
                    error={error}
                    list={list}
                    listSource={listSource}
                    placeholder={placeholder}
                    value={data[attribute]}
                />
            );
        } else if (element === 'input') {
            const type = column.type || 'text';

            return (
                <div className={`form-column-item-field ${element} ${error ? 'has-error' : ''}`}>
                    <input
                        autoFocus={autoFocus}
                        className="form-column-item-input"
                        id={fieldId}
                        name={attribute}
                        onChange={this.handleTextInput}
                        placeholder={formatMessage(placeholder)}
                        type={type}
                        value={data[attribute]}
                    />
                    {error &&
                        <div className="form-column-item-error-icon">
                            <i className="fa fa-times-circle" />
                        </div>
                    }
                    {error &&
                        <div className="form-column-item-error-message">
                            {error}
                        </div>
                    }
                </div>
            );
        } else if (element === 'listBuilder') {
            const {addButtonText, removeItemsText} = column;

            return (
                <ListBuilder
                    action={action || defaultAction}
                    addButtonText={addButtonText}
                    attribute={attribute}
                    error={error}
                    id={fieldId}
                    placeholder={placeholder}
                    removeItemsText={removeItemsText}
                    value={data[attribute]}
                />
            );
        } else if (element === 'multiSelect') {
            const {groupBy, list, listSource} = column;

            return (
                <MultiSelect
                    action={action || defaultAction}
                    allowSelectAll={allowSelectAll}
                    attribute={attribute}
                    error={error}
                    expandDirection={columnType === 'right' ? 'left' : 'right'}
                    groupBy={groupBy}
                    list={list}
                    listSource={listSource}
                    placeholder={placeholder}
                    value={data[attribute]}
                />
            );
        } else if (element === 'radioButtons') {
            const options = column.options;

            return (
                <RadioButtons
                    action={action || defaultAction}
                    attribute={attribute}
                    options={options}
                    value={data[attribute]}
                />
            );
        } else if (element === 'readOnly') {
            return (
                <input
                    className="form-column-item-input read-only"
                    disabled="true"
                    id={fieldId}
                    name={attribute}
                    type="text"
                    value={this.getInputValue()}
                />
            );
        } else if (element === 'textarea') {
            let textareaValue = data[attribute];

            if (Array.isArray(textareaValue)) {
                textareaValue = textareaValue.join('\n');
            }

            return (
                <div className={`form-column-item-field ${element} ${error ? 'has-error' : ''}`}>
                    <textarea
                        className="form-column-item-textarea"
                        id={fieldId}
                        name={attribute}
                        onChange={this.handleTextInput}
                        placeholder={formatMessage(placeholder)}
                        value={textareaValue}
                    />
                    {error &&
                        <div className="form-column-item-error-icon">
                            <i className="fa fa-times-circle" />
                        </div>
                    }
                    {error &&
                        <div className="form-column-item-error-message">
                            {error}
                        </div>
                    }
                </div>
            );
        } else if (element === 'toggleButton') {
            return (
                <ToggleButton
                    action={action || defaultAction}
                    attribute={attribute}
                    error={error}
                    value={data[attribute]}
                />
            );
        }

        return null;
    }
}

function getFieldId(attribute, element) {
    if (attribute && /input|textarea|listBuilder/.test(element)) {
        return `form-component-${element}-${attribute}`;
    }

    return null;
}

function RowColumnItem({column, columnType, data, defaultAction}) {
    const {attribute, element, label} = column;
    const fieldId = getFieldId(attribute, element);

    return (
        <div className="form-column-item">
            <label htmlFor={fieldId}>
                {formatMessage(label)}
            </label>
            <Field
                column={column}
                columnType={columnType}
                data={data}
                defaultAction={defaultAction}
                fieldId={fieldId}
            />
        </div>
    );
}

RowColumnItem.propTypes = {
    column: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
    columnType: PropTypes.string,
    data: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
    defaultAction: PropTypes.func
};

function getRowColumnItems({column, columnType, data, defaultAction}) {
    if (Array.isArray(column)) {
        return column.map((item, itemIndex) => {
            return (
                <RowColumnItem
                    column={item}
                    columnType={columnType}
                    data={data}
                    defaultAction={defaultAction}
                    key={itemIndex}
                />
            );
        });
    }

    return (
        <RowColumnItem
            column={column}
            columnType={columnType}
            data={data}
            defaultAction={defaultAction}
        />
    );
}

getRowColumnItems.propTypes = {
    column: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    columnType: PropTypes.string,
    data: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
    defaultAction: PropTypes.func
};

function getRowColumns({data, defaultAction, row}) {
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
            <div
                className={`form-column ${columnType}`}
                key={columnIndex}
            >
                {getRowColumnItems.call(this, {
                    column,
                    columnType,
                    data,
                    defaultAction
                })}
            </div>
        );
    });
}

function getRows({config, data, defaultAction}) {
    return config.map((row, rowIndex) => {
        return (
            <div
                className="form-row"
                key={rowIndex}
            >
                {getRowColumns.call(this, {
                    data,
                    defaultAction,
                    row
                })}
            </div>
        );
    });
}

function getSection({config, data, defaultAction, sectionKey}) {
    return (
        <div
            className="form-section"
            key={sectionKey}
        >
            {getRows.call(this, {
                config,
                data,
                defaultAction
            })}
        </div>
    );
}

class ToggleSectionHeading extends Component {

    static propTypes = {
        isExpanded: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        onAction: PropTypes.func.isRequired,
        sectionKey: PropTypes.number.isRequired
    };

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {onAction, sectionKey} = this.props;
        onAction(sectionKey);
    }

    render() {
        const {isExpanded, label} = this.props;

        return (
            <div
                className={`form-heading toggle ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                key={0}
                onClick={this.handleClick}
            >
                <i className={`fa fa-caret-${isExpanded ? 'down' : 'right'} form-heading-toggle-icon`} />
                {formatMessage(label)}
            </div>
        );
    }
}

function getToggleSection({config, data, defaultAction, label, sectionKey}) {
    const isExpanded = !!this.state.toggleSections[sectionKey];

    return (
        <div
            className="form-toggle-section"
            key={sectionKey}
        >
            <ToggleSectionHeading
                isExpanded={isExpanded}
                label={label}
                onAction={this.handleToggleSection}
                sectionKey={sectionKey}
            />
            {isExpanded &&
                getSection.call(this, {
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
 *       - autoFocus {boolean} Set to true for input or textarea element if
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
 *                         autoFocus: true,
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
 *                             action: this.setDataCentersValue,
 *                             allowSelectAll: true,
 *                             attribute: 'datacenters',
 *                             element: 'multiSelect',
 *                             label: 'DATA_CENTERS',
 *                             list: this.state.dataCenters,
 *                             listSource: this.getDataCenters,
 *                             placeholder: 'CHOOSE_DATA_CENTERS'
 *                         },
 *                         {
 *                             action: this.setTimeZoneValue,
 *                             attribute: 'timezone',
 *                             element: 'dropDown',
 *                             label: 'TIME_ZONE',
 *                             list: this.state.timeZones,
 *                             listSource: this.getTimeZones,
 *                             placeholder: 'CHOOSE_TIME_ZONE'
 *                         }
 *                     ]
 *                 ]
 *             ]
 *         }
 *     ],
 *     defaultAction: this.handleChange
 * };
 *
 */
export default class Form extends Component {

    static propTypes = {
        config: PropTypes.shape({
            defaultAction: PropTypes.func,
            elements: PropTypes.array
        }).isRequired,
        data: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
    };

    constructor() {
        super();
        this.state = {
            toggleSections: {}
        };
        this.handleToggleSection = this.handleToggleSection.bind(this);
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
    }

    render() {
        const {config, data} = this.props;

        const content = config.elements.map((element, index) => {
            if (element.type === 'heading') {
                return (
                    <div
                        className="form-heading"
                        key={index}
                    >
                        {formatMessage(element.label)}
                    </div>
                );
            }

            if (element.type === 'section') {
                return getSection.call(this, {
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

            return null;
        });

        return (
            <div className="form-component">
                {content}
            </div>
        );
    }
}
