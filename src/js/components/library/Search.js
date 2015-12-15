import React, {Component, PropTypes} from 'react';

import {formatMessage} from '../../utils/localizationUtils';

/*
 * Search class.
 *
 * @class Search
 *
 * The following props are supported:
 *
 * action {function} A function to execute with the search string value
 * allowKeyUp {boolean} The onKeyUp event can trigger the action. If this is undefined or false, the
 *                      action is triggered using the enter key or a click on the search icon. If this
 *                      is true, it triggers the action in addition to the enter key or a click.
 * placeholder {string}
 *
 * @example <caption>Example usage:</caption>
 *
 *     <Search action={this.handleSearchSelected.bind(this)}
 *             allowKeyUp={true}
 *             placeholder="SEARCH_SELECTED_ITEMS_BY" />
 *
 */
export default class Search extends Component {
    handleSearch(event) {
        const {action, allowKeyUp} = this.props;

        const isClick = event.type === 'click';
        const isEnterKey = event.keyCode === 13;
        const isKeyUp = allowKeyUp && event.type === 'keyup';

        const value = this.refs.search.value;

        if (isClick || isEnterKey || isKeyUp) {
            action(value);
        }
    }

    render() {
        return (
            <div className="search-component">
                <input onKeyUp={this.handleSearch.bind(this)}
                       placeholder={formatMessage(this.props.placeholder || 'SEARCH')}
                       ref="search" />
                <i className="fa fa-search" onClick={this.handleSearch.bind(this)} />
            </div>
        );
    }
}

Search.propTypes = {
    action: PropTypes.func.isRequired,
    allowKeyUp: PropTypes.bool,
    placeholder: PropTypes.string
};
