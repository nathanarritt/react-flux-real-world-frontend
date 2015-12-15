import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import componentsConfig from '../../config/componentsConfig';
import Loader from './Loader';
import {formatMessage} from '../../utils/localizationUtils';

function getTabHeaders() {
    const selectedTabIndex = this.state.selectedTabIndex;
    const config = this.props.config;

    return config.tabs.map((tab, index) => {
        const type = tab.type || 'tab';

        if (type === 'component') {
            return (
                <li className={`tabs-header-item ${type}`} key={index}>
                    {tab.component}
                </li>
            );
        }

        return (
            <li
                className={`tabs-header-item ${type} ${index === selectedTabIndex ? 'selected' : ''}`}
                key={index}
                onClick={this.setSelectedTabIndex.bind(this, index)}>

                {tab.icon && <i className={tab.icon} />}
                {formatMessage(tab.label)}
            </li>
        );
    });
}

/*
 * Tabs class.
 *
 * @class Tabs
 *
 * The following props are supported:
 *
 * config {array} (required) The config is an array of objects used for the
 *     toolbar layout and functionality.
 * isLoading {boolean} The isLoading state from the view where state is managed.
 * withToolbar {boolean} Used to calculate the tabs height in setTabsHeight().
 *
 * The config objects support the following attributes:
 *     - action {function} (required) A method bound to the parent view where state is managed that handles
 *                                    the action corresponding to the `type` of element selected.
 *     - icon {string} The class name(s) to use for the icon element.
 *     - label {string} Localization key or text.
 *     - type {string} (required) The type of toolbar item: link
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
export default class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: props.defaultTabIndex || 0,
            tabsHeight: 'auto'
        };
    }

    componentDidMount() {
        this.setTabsHeight();
    }

    componentDidUpdate() {
        this.setTabsHeight();
    }

    setSelectedTabIndex(selectedTabIndex) {
        this.setState({selectedTabIndex});
    }

    setTabsHeight() {
        const componentNode = ReactDom.findDOMNode(this);
        const componentHeight = componentNode.offsetHeight;
        const parentNodeHeight = componentNode.parentNode.offsetHeight;

        const withToolbar = this.props.withToolbar;

        const toolbarHeight = componentsConfig.toolbar.height;

        let newTabsHeight;

        if (componentHeight > parentNodeHeight) {
            if (withToolbar) {
                newTabsHeight = parentNodeHeight - toolbarHeight;
            } else {
                newTabsHeight = parentNodeHeight;
            }
        } else if (componentHeight < parentNodeHeight) {
            if (withToolbar) {
                if (componentHeight + toolbarHeight > parentNodeHeight) {
                    newTabsHeight = parentNodeHeight - toolbarHeight;
                } else if (componentHeight + toolbarHeight < parentNodeHeight) {
                    newTabsHeight = 'auto';
                }
            } else {
                newTabsHeight = 'auto';
            }
        }

        if (newTabsHeight && newTabsHeight !== this.state.tabsHeight) {
            this.setState({
                tabsHeight: newTabsHeight
            });
        }
    }

    render() {
        const selectedTabIndex = this.state.selectedTabIndex;
        const {config, isLoading} = this.props;

        return (
            <div className="tabs-component" style={{height: this.state.tabsHeight}}>
                <nav className="tabs-header">
                    <ul>{getTabHeaders.call(this)}</ul>
                </nav>
                <div className="tabs-body" ref="tabsBody">
                    {config.tabs[selectedTabIndex].content}
                </div>
                {isLoading && <Loader />}
            </div>
        );
    }
}

Tabs.propTypes = {
    config: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    withToolbar: PropTypes.bool
};
