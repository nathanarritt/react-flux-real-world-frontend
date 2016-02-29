import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import {formatMessage} from '../../utils/localizationUtils';

class NavItem extends Component {

    static propTypes = {
        componentsConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        item: PropTypes.shape({
            children: PropTypes.arrayOf(
                PropTypes.object
            ),
            className: PropTypes.string,
            component: PropTypes.function,
            componentId: PropTypes.string,
            icon: PropTypes.oneOfType([
                PropTypes.array,
                PropTypes.string
            ]),
            label: PropTypes.string,
            pathname: PropTypes.string
        }),
        onAction: PropTypes.func.isRequired,
        pathname: PropTypes.string,
        random: PropTypes.number
    };

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {item, onAction} = this.props;
        onAction(item);
    }

    render() {
        const {componentsConfig, item, pathname, random} = this.props;

        if (item.component && componentsConfig) {
            return (
                <li className={item.className}>
                    <item.component {...componentsConfig[item.componentId]} />
                </li>
            );
        }

        let className = item.className ? item.className : '';

        let itemPathRegExp;

        if (item.pathname) {
            itemPathRegExp = new RegExp(item.pathname);
        }

        if (itemPathRegExp && itemPathRegExp.test(pathname)) {
            className += ' selected';
        }

        let children;

        if (item.children) {
            children = (
                <NavList
                    config={item.children}
                    pathname={pathname}
                />
            );
        }

        let icon;

        if (item.icon) {
            if (Array.isArray(item.icon)) {
                icon = item.icon.map((itemIcon, index) => {
                    return (
                        <i
                            className={itemIcon}
                            key={index}
                        />
                    );
                });
            } else {
                icon = (
                    <i className={item.icon} />
                );
            }
        }

        let listItem;

        if (item.pathname) {
            listItem = (
                <Link to={item.pathname}>
                    {icon}<span>{formatMessage(item.label)}</span>
                </Link>
            );
        } else {
            listItem = (
                <div onClick={this.handleClick}>
                    {icon}
                    <span>{formatMessage(item.label) + ' ' + random}</span>
                </div>
            );
        }

        return (
            <li className={className}>
                {listItem}
                {children}
            </li>
        );
    }
}

function getList({componentsConfig, config, pathname}, random) {
    return config.map((item, index) => {
        return (
            <NavItem
                componentsConfig={componentsConfig}
                item={item}
                key={index}
                onAction={this.handleClick}
                pathname={pathname}
                random={random}
            />
        );
    });
}

/**
* NavList class.
*
* @class NavList
*
* @classdesc The following props are supported:
*
* componentsConfig {object} Map of component configurations. The key is the
*     `componentId` from the config object for the component and the value is
*     an object with the props required by the component.
* config {array} Array of configuration objects describing the nav items. Valid
*     properties for the objects are:
*     - label {string} Text/Localization key for nav item.
*     - children {array} Nested NavList configuration.
*     - className {string} One or more class names to add to the nav item.
*     - component {element} React component to display instead of a label.
*       Requires a corresponding `componentId`.
*     - componentId {string} ID used in `componentsConfig` with the props
*       required by the component.
*     - icon {string | array} Class names to use for the icon element.
*     - pathname {string} Link route for the nav item.
* pathname {string} Current active route.
*
*/
export default class NavList extends Component {

    static propTypes = {
        componentsConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        config: PropTypes.arrayOf(PropTypes.object).isRequired,
        pathname: PropTypes.string
    };

    constructor() {
        super();
        this.state = {
            random: 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const random = this.state.random + 1;
        this.setState({random});
    }

    render() {
        return (
            <ul className="nav-list-component">
                {getList.call(this, this.props, this.state.random)}
            </ul>
        );
    }
}
