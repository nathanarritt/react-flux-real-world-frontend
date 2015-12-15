import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import ContextSelector from '../library/ContextSelector';
import {formatMessage} from '../../utils/localizationUtils';

function getNavListItem(navListItemConfig) {
    const {componentConfig, item, key, pathname} = navListItemConfig;

    if (item.component) {
        const {action, list, listSource, selectedId} = componentConfig;

        return (
            <li className={item.className} key={key}>
                <ContextSelector action={action}
                                 list={list}
                                 listSource={listSource}
                                 selectedId={selectedId} />
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
            <ul>
                {getNavListItems({ // eslint-disable-line block-scoped-var
                    config: item.children,
                    pathname
                })}
            </ul>
        );
    }

    let icon;

    if (item.icon) {
        if (Array.isArray(item.icon)) {
            icon = item.icon.map((itemIcon, index) => {
                return (
                    <i className={itemIcon} key={index} />
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
            <span>{icon}<span>{formatMessage(item.label)}</span></span>
        );
    }

    return (
        <li className={className} key={key}>
            {listItem}
            {children}
        </li>
    );
}

function getNavListItems(navListItemsConfig) {
    const {config, componentConfig, pathname} = navListItemsConfig;

    return config.map((item, index) => {
        return getNavListItem({
            componentConfig,
            item,
            key: index,
            pathname
        });
    });
}

export default class NavList extends Component {
    render() {
        return (
            <ul className="nav-list-component">
                {getNavListItems(this.props)}
            </ul>
        );
    }
}

NavList.propTypes = {
    componentConfig: PropTypes.object,
    config: PropTypes.array.isRequired,
    pathname: PropTypes.string
};
