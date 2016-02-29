import React, {Component, PropTypes} from 'react';

import {formatMessage} from '../../utils/localizationUtils';

class LinkItem extends Component {

    static propTypes = {
        item: PropTypes.shape({
            action: PropTypes.func,
            icon: PropTypes.string,
            label: PropTypes.string,
            style: PropTypes.string,
            type: PropTypes.string
        }).isRequired
    };

    constructor() {
        super();
        this.handleAction = this.handleAction.bind(this);
    }

    handleAction() {
        const {item} = this.props;
        const {action} = item;

        if (typeof action === 'function') {
            action(null);
        }
    }

    render() {
        const item = this.props.item;
        const {icon, label, style, type} = item;

        return (
            <div
                className={`toolbar-item ${type}`}
                onClick={this.handleAction}
                style={style}
            >
                {icon && <i className={icon} />}
                {label && <span>{formatMessage(label)}</span>}
            </div>
        );
    }
}

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
 *         action: this.handleOpen,
 *         icon: 'fa fa-plus-circle',
 *         label: 'ADD_NEW_NODE',
 *         type: 'link'
 *     }
 * ];
 *
 */
export default function Toolbar({config}) {
    const content = config.map((item, index) => {

        if (/link|back-link/.test(item.type)) {
            return (
                <LinkItem
                    item={item}
                    key={index}
                />
            );
        }

        if (item.type === 'element') {
            return (
                <div
                    className="toolbar-item element"
                    key={index}
                    style={item.style}
                >
                    {item.element}
                </div>
            );
        }

        return null;
    });

    return (
        <div className="toolbar-component">
            {content}
        </div>
    );
}

Toolbar.propTypes = {
    config: PropTypes.arrayOf(PropTypes.object).isRequired
};
