import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import componentsConfig from '../../../config/componentsConfig';
import Loader from '../Loader';
import {formatMessage} from '../../../utils/localizationUtils';

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
    constructor(props) {
        super(props);
        this.state = {
            hasFetched: false,
            isExpanded: false,
            isFetching: false,
            list: props.list,
            dropDownListItemWidth: componentsConfig.dropDown.listItemWidth,
            value: props.value
        };
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
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

        this.toggleExpanded();
    }

    setDropDownListItemWidth() {
        const dropDownList = this.refs.dropDownList;

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

    toggleExpanded() {
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
        const {
            dropDownListItemWidth, hasFetched, isExpanded,
            isFetching, list, value
        } = this.state;

        const dropDownList = () => {
            let listItems;

            if (isFetching && !list[0]) {
                listItems = (
                    <li className="drop-down-list-item-loader">
                        <Loader />
                    </li>
                );
            } else if (hasFetched && !list[0]) {
                listItems = (
                    <li className="drop-down-list-item-empty">
                        {formatMessage('NO_ITEMS_AVAILABLE')}
                    </li>
                );
            } else {
                listItems = list.map((item, index) => {
                    const valueId = value && value.id;

                    return (
                        <li className={`drop-down-list-item ${item.id === valueId ? 'selected' : ''}`}
                            key={index}
                            onClick={this.handleItemClick.bind(this, item.id, item.name)}
                            style={{width: dropDownListItemWidth}}
                            title={item.name}>{item.name}</li>
                    );
                });
            }

            return (
                <ul className="drop-down-list" ref="dropDownList">{listItems}</ul>
            );
        };

        return (
            <div className={`drop-down-component ${isExpanded ? 'is-expanded' : ''}`}>
                <div className="drop-down-value" onClick={this.toggleExpanded.bind(this)}>
                    <span className={!value ? 'no-value' : null}>
                        {value ? value.name : formatMessage(this.props.placeholder || 'PLEASE_SELECT')}
                    </span>
                    <i className={`fa fa-caret-${isExpanded ? 'up' : 'down'} drop-down-value-icon`} />
                </div>
                {isExpanded && dropDownList()}
            </div>
        );
    }
}

DropDown.propTypes = {
    action: PropTypes.func.isRequired,
    attribute: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    listSource: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.object
};
