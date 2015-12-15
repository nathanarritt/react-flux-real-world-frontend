import React, {Component, PropTypes} from 'react';

import {formatMessage} from '../../utils/localizationUtils';

/*
 * Toolbar class.
 *
 * @class Toolbar
 *
 * The following prop is supported:
 *
 * config {array} (required) The config is an array of objects used for the
 *     toolbar layout and functionality.
 *
 * The config objects support the following attributes:
 *     - action {function} A method bound to the parent view where state is
 *       managed that handles the action corresponding to the `type` of element
 *       selected.
 *     - icon {string} The class name(s) to use for the icon element.
 *     - label {string} Localization key or text.
 *     - style {object} Custom style to inject into the toolbar-item element.
 *     - type {string} (required) The type of toolbar item: back-link, element,
 *       link
 *
 * @example <caption>Example usage:</caption>
 *
 * const toolbarConfig = [
 *     {
 *         action: this.handleActionOpen.bind(this),
 *         icon: 'fa fa-plus-circle',
 *         label: 'ADD_NEW_NODE',
 *         type: 'link'
 *     }
 * ];
 *
 */
export default class Toolbar extends Component {
    handleAction(item, data) {
        item.action(data);
    }

    render() {
        const content = this.props.config.map((item, index) => {

            if (/link|back-link/.test(item.type)) {
                return (
                    <div
                        className={`toolbar-item ${item.type}`}
                        key={index}
                        onClick={this.handleAction.bind(this, item, null)}
                        style={item.style}>

                        {item.icon && <i className={item.icon} />}
                        {item.label && <span>{formatMessage(item.label)}</span>}
                    </div>
                );
            }

            if (item.type === 'element') {
                return (
                    <div
                        className="toolbar-item element"
                        key={index}
                        style={item.style}>

                        {item.element}
                    </div>
                );
            }
        });

        return (
            <div className="toolbar-component">
                {content}
            </div>
        );
    }
}

Toolbar.propTypes = {
    config: PropTypes.array.isRequired
};
