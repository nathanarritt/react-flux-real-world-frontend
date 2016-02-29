import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import styleConfig from '../../../config/styleConfig';
import Loader from '../Loader';
import {formatMessage} from '../../../utils/localizationUtils';

class ListItem extends Component {

    static propTypes = {
        data: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        }).isRequired,
        onAction: PropTypes.func.isRequired,
        valueId: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        width: PropTypes.number.isRequired
    };

    constructor() {
        super();
        this.handleAction = this.handleAction.bind(this);
    }

    handleAction() {
        const {data: {id, name}, onAction} = this.props;
        onAction(id, name);
    }

    render() {
        const {data, valueId, width} = this.props;

        return (
            <li
                className={`drop-down-list-item ${data.id === valueId ? 'selected' : ''}`}
                onClick={this.handleAction}
                style={{width}}
                title={data.name}
            >
                {data.name}
            </li>
        );
    }
}

function dropDownList() {
    const {
        dropDownListItemWidth, hasFetched, isFetching, list, value
    } = this.state;

    let listItems;

    if (isFetching && !list[0]) {
        // eslint-disable-next-line no-extra-parens
        listItems = (
            <li className="drop-down-list-item-loader">
                <Loader />
            </li>
        );
    } else if (hasFetched && !list[0]) {
        // eslint-disable-next-line no-extra-parens
        listItems = (
            <li className="drop-down-list-item-empty">
                {formatMessage('NO_ITEMS_AVAILABLE')}
            </li>
        );
    } else {
        listItems = list.map((item, index) => {
            const valueId = value && value.id;

            return (
                <ListItem
                    data={item}
                    key={index}
                    onAction={this.handleItemClick}
                    valueId={valueId}
                    width={dropDownListItemWidth}
                />
            );
        });
    }

    return (
        <ul
            className="drop-down-list"
            ref={c => (this.dropDownList = c)}
        >
            {listItems}
        </ul>
    );
}

/*
 * DropDown class.
 *
 * @class DropDown
 *
 * The following props are supported:
 *
 * action {function} (required) A method bound to the view where state is managed that processes the selected value
 * attribute {string} (required) Model attribute
 * list {array} (required) The available options to select as the value
 * listSource {function} A method bound to the view where state is managed that fetches the list items
 * value {object} Object with an id and name attribute {id: SOME_ID, name: 'Some Name'}
 *
 * @example <caption>Example usage:</caption>
 *
 *     <DropDown
 *         action={action || defaultAction}
 *         attribute={attribute}
 *         list={list}
 *         listSource={listSource}
 *         value={data[attribute]} />
 *
 */
export default class DropDown extends Component {

    static propTypes = {
        action: PropTypes.func.isRequired,
        attribute: PropTypes.string.isRequired,
        error: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        })).isRequired,
        listSource: PropTypes.func,
        placeholder: PropTypes.string,
        value: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            hasFetched: !props.listSource, // true if listSource is undefined
            isExpanded: false,
            isFetching: false,
            list: props.list,
            dropDownListItemWidth: styleConfig.dropDown.listItemWidth,
            value: props.value
        };
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleToggleExpanded = this.handleToggleExpanded.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
        this.setDropDownListItemWidth();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.list) {
            const newState = {
                list: nextProps.list,
                value: nextProps.value
            };

            if (this.state.isFetching) {
                newState.hasFetched = true;
                newState.isFetching = false;
            }

            this.setState(newState);
        }
    }

    componentDidUpdate() {
        this.setDropDownListItemWidth();
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick(event) {
        if (!ReactDom.findDOMNode(this).contains(event.target)) {
            this.setState({
                isExpanded: false
            });
        }
    }

    handleItemClick(id, name) {
        const {action, attribute} = this.props;

        action({
            attribute,
            value: {id, name}
        });

        this.handleToggleExpanded();
    }

    setDropDownListItemWidth() {
        const dropDownList = this.dropDownList;

        if (dropDownList) {
            const newDropDownListItemWidth = dropDownList.clientWidth;
            const dropDownListItemWidth = this.state.dropDownListItemWidth;

            if (newDropDownListItemWidth !== dropDownListItemWidth) {
                this.setState({
                    dropDownListItemWidth: newDropDownListItemWidth
                });
            }
        }
    }

    handleToggleExpanded() {
        const {hasFetched, isExpanded, list} = this.state;
        const listSource = this.props.listSource;

        if (!hasFetched && !list[0] && listSource) {
            this.setState({
                isFetching: true
            });

            listSource();
        }

        this.setState({
            isExpanded: !isExpanded
        });
    }

    render() {
        const {isExpanded, value} = this.state;

        const {error, placeholder = 'PLEASE_SELECT'} = this.props;

        return (
            <div className={`drop-down-component ${isExpanded ? 'is-expanded' : ''} ${error ? 'has-error' : ''}`}>
                <div
                    className="drop-down-value"
                    onClick={this.handleToggleExpanded}
                >
                    <span className={!value ? 'no-value' : null}>
                        {value ? value.name : formatMessage(placeholder)}
                    </span>
                    <i className={`fa fa-caret-${isExpanded ? 'up' : 'down'} drop-down-value-icon`} />
                </div>
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
                {isExpanded && dropDownList.call(this)}
            </div>
        );
    }
}
