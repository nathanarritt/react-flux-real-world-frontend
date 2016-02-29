import React, {Component, PropTypes} from 'react';

import styleConfig from '../../../config/styleConfig';
import {formatMessage} from '../../../utils/localizationUtils';

function getErrorMap(error) {
    const errorMap = {};

    if (Array.isArray(error)) {
        error.forEach(errorItem => {
            errorMap[errorItem.value] = errorItem.message;
        });
    }

    return errorMap;
}

function getListItems() {
    const {errorMap, value} = this.state;

    return value.map((item, index) => {
        let errorMessage = errorMap[item];

        return (
            <li
                className={`${errorMessage ? 'has-error' : ''}`}
                key={index}
            >
                {errorMessage &&
                    <span className="list-builder-item-error">
                        <i
                            className="fa fa-times-circle"
                            title={errorMessage}
                        />
                    </span>
                }
                <span className="list-builder-item-value">{item}</span>
                <span className="list-builder-item-remove">
                    <i
                        className="fa fa-remove"
                        data-value={item}
                        onClick={this.handleRemove}
                    />
                </span>
            </li>
        );
    });
}

function sortValue(values, errorMap) {
    if (!values[0]) {
        return values;
    }

    const errorValues = [];
    const validValues = [];

    values.forEach(value => {
        if (errorMap[value]) {
            errorValues.push(value);
        } else {
            validValues.push(value);
        }
    });

    errorValues.sort();
    validValues.sort();

    return errorValues.concat(validValues);
}

export default class ListBuilder extends Component {

    static propTypes = {
        action: PropTypes.func.isRequired,
        addButtonText: PropTypes.string,
        attribute: PropTypes.string.isRequired,
        error: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        id: PropTypes.string,
        placeholder: PropTypes.string,
        removeItemsText: PropTypes.string,
        value: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]))
    };

    constructor(props) {
        super(props);

        const errorMap = getErrorMap(props.error);

        this.state = {
            addButtonWidth: 0,
            autoFocus: false,
            errorMap,
            inputWidth: 0,
            value: sortValue(props.value || [], errorMap)
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleRemoveAll = this.handleRemoveAll.bind(this);
    }

    componentDidMount() {
        this.setAddButtonWidth();
    }

    componentWillReceiveProps(nextProps) {
        const {error = [], value} = this.props;
        const newError = nextProps.error || [];
        const newValue = nextProps.value || [];

        if (newError.length !== error.length ||
            newValue.length !== value.length) {

            const errorMap = getErrorMap(newError);

            this.setState({
                errorMap,
                value: sortValue(newValue, errorMap)
            });
        }
    }

    handleAdd() {
        const {action, attribute} = this.props;
        let value = this.state.value;
        const listBuilderInput = this.listBuilderInput;
        const newValues = listBuilderInput.value;

        listBuilderInput.value = '';

        newValues.split(',').forEach(item => {
            item = item.trim();

            if (value.indexOf(item) === -1) {
                value.push(item);
            }
        });

        action({
            attribute,
            value: value.sort()
        });
    }

    handleBlur() {
        this.setState({autoFocus: false});
    }

    handleFocus() {
        this.setState({autoFocus: true});
    }

    handleRemove(event) {
        const {action, attribute} = this.props;
        const value = this.state.value;
        const removeItem = event.target.getAttribute('data-value');

        action({
            attribute,
            value: value.filter(item => {
                return item !== removeItem;
            })
        });
    }

    handleRemoveAll() {
        const {action, attribute} = this.props;

        action({
            attribute,
            value: []
        });
    }

    setAddButtonWidth() {
        const addButtonWidth = this.state.addButtonWidth;
        const addButtonOffsetWidth = this.addButton.offsetWidth;
        const inputMarginRight = styleConfig.listBuilder.inputMarginRight;

        const newAddButtonWidth = addButtonOffsetWidth + inputMarginRight;

        if (newAddButtonWidth !== addButtonWidth) {
            this.setState({
                addButtonWidth: newAddButtonWidth
            });
        }
    }

    render() {
        const {addButtonWidth, autoFocus, value} = this.state;

        const valueLength = value.length;
        const hasValue = valueLength > 0;

        const {
            addButtonText, attribute, error, id, placeholder, removeItemsText
        } = this.props;

        let errorMessage = error;

        if (Array.isArray(error)) {
            errorMessage = error[0].message;
        }

        return (
            <div className="list-builder-component">
                <div
                    className={`list-builder-input ${error ? 'has-error' : ''}`}
                    style={{width: `calc(100% - ${addButtonWidth}px)`}}
                >
                    <textarea
                        autoFocus={autoFocus}
                        className="list-builder-input-textarea"
                        id={id}
                        name={attribute}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        placeholder={formatMessage(placeholder)}
                        ref={c => (this.listBuilderInput = c)}
                    />
                    {error &&
                        <div className="form-column-item-error-icon">
                            <i className="fa fa-times-circle" />
                        </div>
                    }
                    {error &&
                        <div className="form-column-item-error-message">
                            {errorMessage}
                        </div>
                    }
                    {hasValue &&
                        <ul className="list-builder-list">
                            {getListItems.call(this)}
                        </ul>
                    }
                    {hasValue &&
                        <div className="list-builder-console">
                            <div className="list-builder-items-count">
                                {formatMessage('ITEMS_TOTAL', [valueLength])}
                            </div>
                            <div className="list-builder-remove-all">
                                <i className="fa fa-remove" />
                                <span onClick={this.handleRemoveAll}>
                                    {formatMessage(removeItemsText || 'REMOVE_ALL_ITEMS')}
                                </span>
                            </div>
                        </div>
                    }
                </div>
                <span
                    className="button primary small"
                    onClick={this.handleAdd}
                    ref={c => (this.addButton = c)}
                >
                    {formatMessage(addButtonText || 'ADD_ITEMS')}
                </span>
            </div>
        );
    }
}
