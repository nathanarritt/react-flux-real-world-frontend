import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import {formatMessage} from '../../utils/localizationUtils';

class DropDownItem extends Component {

    static propTypes = {
        className: PropTypes.string,
        item: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.string
        }).isRequired,
        onAction: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {onAction, item} = this.props;
        onAction(item);
    }

    render() {
        const {className, item} = this.props;

        return (
            <li
                className={className}
                onClick={this.handleClick}
            >
                {item.name}
            </li>
        );
    }
}

function getDropDownItemsElements() {
    const selectedItem = this.state.selectedItem;
    const {allowRepeat, list} = this.props;

    return list.map((item, index) => {
        const className = !allowRepeat && item.id === selectedItem.id ? 'selected' : null;

        return (
            <DropDownItem
                className={className}
                item={item}
                key={index}
                onAction={this.handleClick}
            />
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

class SelectedItem extends Component {

    static propTypes = {
        defaultText: PropTypes.string,
        isExpanded: PropTypes.bool.isRequired,
        onAction: PropTypes.func.isRequired,
        selectedItem: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.string
        }).isRequired
    };

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {defaultText, onAction, selectedItem} = this.props;
        onAction(selectedItem, !!defaultText);
    }

    render() {
        const {defaultText, isExpanded, selectedItem} = this.props;

        return (
            <div
                className={`context-selector-selected ${isExpanded ? 'is-expanded' : ''}`}
                onClick={this.handleClick}
            >
                <span className="context-selector-selected-item">
                    {defaultText ? formatMessage(defaultText) : selectedItem.name}
                </span>
                <i className={`fa fa-caret-${isExpanded ? 'up' : 'down'} context-selector-selected-icon`} />
            </div>
        );
    }
}

/**
 * ContextSelector class.
 *
 * @class ContextSelector
 *
 * @classdesc The following props are supported:
 *
 * onAction {function} Processes the selected data.
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

    static propTypes = {
        allowRepeat: PropTypes.bool,
        defaultText: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            name: PropTypes.string
        })).isRequired,
        listSource: PropTypes.func,
        onAction: PropTypes.func.isRequired,
        selectedId: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            selectedItem: getSelectedItem(props.list, props.selectedId)
        };
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
        const {onAction, allowRepeat} = this.props;

        if (this.state.isExpanded &&
            !(typeof skipAction === 'boolean' && skipAction) &&
            (allowRepeat || newSelectedItem.id !== this.state.selectedItem.id)) {

            onAction(newSelectedItem);

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
        const {isExpanded, selectedItem} = this.state;

        return (
            <div className="context-selector-component">
                <SelectedItem
                    defaultText={this.props.defaultText}
                    isExpanded={isExpanded}
                    onAction={this.handleClick}
                    selectedItem={selectedItem}
                />
                {isExpanded &&
                    <ul className="context-selector-options">
                        {getDropDownItemsElements.call(this)}
                    </ul>
                }
            </div>
        );
    }
}
