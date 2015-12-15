import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import {formatMessage} from '../../utils/localizationUtils';

function getDropDownItemsElements() {
    const selectedItem = this.state.selectedItem;
    const {allowRepeat, list} = this.props;

    return list.map((item, index) => {
        const className = !allowRepeat && item.id === selectedItem.id ? 'selected' : null;

        return (
            <li className={className} key={index} onClick={this.handleClick.bind(this, item)}>
                {item.name}
            </li>
        );
    });
}

function getSelectedItem(list, selectedId) {
    if (!selectedId) {
        return {
            id: null,
            name: null
        };
    }

    return _.find(list, item => {
        return item.id === selectedId;
    });
}

function getSelectedItemElement() {
    const {isExpanded, selectedItem} = this.state;
    const defaultText = this.props.defaultText;

    if (!selectedItem) {
        return null;
    }

    return (
        <div className={`context-selector-selected ${isExpanded ? 'is-expanded' : ''}`}
             onClick={this.handleClick.bind(this, selectedItem, !!defaultText)}>
            <span className="context-selector-selected-item">
                {defaultText ? formatMessage(defaultText) : selectedItem.name}
            </span>
            <i className={`fa fa-caret-${isExpanded ? 'up' : 'down'} context-selector-selected-icon`} />
        </div>
    );
}

/**
 * ContextSelector class.
 *
 * @class ContextSelector
 *
 * The following props are supported:
 *
 * action {function} Processes the selected data.
 * allowRepeat {boolean} Don't highlight the selected item and execute the
 *     action for each click on the same item.
 * defaultText {string} Localization key to use as SelectedItemElement text
 *     instead of the selected item.
 * list {array} (required) The available options to select as the value
 * listSource {function} A method bound to the view where state is managed that
 *     fetches the list items
 * selectedId {string} Default selected item.
 *
 */
export default class ContextSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            selectedItem: getSelectedItem(props.list, props.selectedId)
        };
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);

        if (!this.props.list[0] && this.props.listSource) {
            this.props.listSource();
        }
    }

    componentWillReceiveProps(nextProps) {
        const {list, selectedId} = nextProps;

        this.setState({
            selectedItem: getSelectedItem(list, selectedId)
        });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleClick(newSelectedItem, skipAction) {
        const allowRepeat = this.props.allowRepeat;

        if (this.state.isExpanded &&
            !(typeof skipAction === 'boolean' && skipAction) &&
            (allowRepeat || newSelectedItem.id !== this.state.selectedItem.id)) {

            this.props.action(newSelectedItem);

            this.setState({
                selectedItem: newSelectedItem
            });
        }

        this.toggleExpanded();
    }

    handleDocumentClick(event) {
        if (!ReactDom.findDOMNode(this).contains(event.target)) {
            this.setState({
                isExpanded: false
            });
        }
    }

    toggleExpanded() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    render() {
        const isExpanded = this.state.isExpanded;

        return (
            <div className="context-selector-component">
                {getSelectedItemElement.call(this)}
                {isExpanded &&
                    <ul className="context-selector-options">
                        {getDropDownItemsElements.call(this)}
                    </ul>
                }
            </div>
        );
    }
}

ContextSelector.propTypes = {
    action: PropTypes.func.isRequired,
    allowRepeat: PropTypes.bool,
    defaultText: PropTypes.string,
    list: PropTypes.array.isRequired,
    listSource: PropTypes.func,
    selectedId: PropTypes.string
};
