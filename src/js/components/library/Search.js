import React, {Component, PropTypes} from 'react';

import {formatMessage} from '../../utils/localizationUtils';

/*
 * Search class.
 *
 * @class Search
 *
 * The following props are supported:
 *
 * allowKeyUp {boolean} The onKeyUp event can trigger the action. If this is undefined or false, the
 *                      action is triggered using the enter key or a click on the search icon. If this
 *                      is true, it triggers the action in addition to the enter key or a click.
 * onAction {function} A function to execute with the search string value
 * placeholder {string}
 *
 * @example <caption>Example usage:</caption>
 *
 *     <Search
 *         allowKeyUp={true}
 *         onAction={this.handleSearchSelected}
 *         placeholder="SEARCH_SELECTED_ITEMS_BY"
 *     />
 *
 */
export default class Search extends Component {

    static propTypes = {
        allowKeyUp: PropTypes.bool,
        onAction: PropTypes.func.isRequired,
        placeholder: PropTypes.string
    };

    constructor() {
        super();
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(event) {
        const {allowKeyUp, onAction} = this.props;

        const isClick = event.type === 'click';
        const isEnterKey = event.keyCode === 13;
        const isKeyUp = allowKeyUp && event.type === 'keyup';

        const value = this.search.value;

        if (isClick || isEnterKey || isKeyUp) {
            onAction(value);
        }
    }

    render() {
        return (
            <div className="search-component">
                <input
                    onKeyUp={this.handleSearch}
                    placeholder={formatMessage(this.props.placeholder || 'SEARCH')}
                    ref={c => (this.search = c)}
                />
                <i
                    className="fa fa-search"
                    onClick={this.handleSearch}
                />
            </div>
        );
    }
}
