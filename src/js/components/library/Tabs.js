import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import styleConfig from '../../config/styleConfig';
import Loader from './Loader';
import {formatMessage} from '../../utils/localizationUtils';

function getTabHeaders() {
    const selectedTabIndex = this.state.selectedTabIndex;
    const config = this.props.config;

    return config.tabs.map((tab, index) => {
        const type = tab.type || 'tab';

        if (type === 'component') {
            return (
                <li
                    className={`tabs-header-item ${type}`}
                    key={index}
                >
                    {tab.component}
                </li>
            );
        }

        return (
            <li
                className={`tabs-header-item ${type} ${index === selectedTabIndex ? 'selected' : ''}`}
                data-tab-id={index}
                key={index}
                onClick={this.handleSelectedTabIndex}
            >
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
 * config {object} (required) The config objects is used for the tabs layout.
 * isLoading {boolean} The isLoading state from the view where state is managed.
 * withToolbar {boolean} Used to calculate the tabs height in setTabsHeight().
 *
 * The config objects support the following attributes:
 *     - tabs {array} (required) Array of objects describing each tab. The
 *         following attributes are supported for each tab:
 *
 *         component {element} React component to display instead of a label.
 *         content {element} React component to display when the tab is clicked.
 *         icon {string} Icon class names to use.
 *         label {string} Text to display in tab.
 *         type {string} The type of tab item: component, link
 *
 * @example <caption>Example usage:</caption>
 *
 * const tabsConfig = {
 *     tabs: [
 *         {
 *             label: 'SERVER_CONFIGURATION',
 *             content: (
 *                 <InstancesForm
 *                     data={data}
 *                     handleClose={onClose}
 *                     handleSave={onSave}
 *                 />
 *             )
 *         },
 *         {
 *             label: 'COMMENTS',
 *             content: <div>Comments Content</div>
 *         },
 *         {
 *             label: 'REVISION',
 *             content: <div>Revision Content</div>,
 *             icon: 'fa fa-history',
 *             type: 'link'
 *         },
 *         {
 *             component: (
 *                 <ContextSelector
 *                     action={handleExternalLink}
 *                     allowRepeat
 *                     defaultText="EXTERNAL_LINKS"
 *                     list={getExternalLinksList()}
 *                 />
 *             ),
 *             type: 'component'
 *         }
 *     ]
 * };
 *
 */
export default class Tabs extends Component {

    static propTypes = {
        config: PropTypes.shape({
            tabs: PropTypes.arrayOf(PropTypes.shape({
                component: PropTypes.element,
                content: PropTypes.element,
                icon: PropTypes.string,
                label: PropTypes.string,
                type: PropTypes.string
            })).isRequired
        }).isRequired,
        defaultTabIndex: PropTypes.number,
        isLoading: PropTypes.bool,
        withToolbar: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: props.defaultTabIndex || 0,
            tabsHeight: 'auto'
        };
        this.handleSelectedTabIndex = this.handleSelectedTabIndex.bind(this);
    }

    componentDidMount() {
        this.setTabsHeight();
    }

    componentDidUpdate() {
        this.setTabsHeight();
    }

    handleSelectedTabIndex(event) {
        const selectedTabIndex = parseInt(
            event.currentTarget.getAttribute('data-tab-id'), 10
        );
        this.setState({selectedTabIndex});
    }

    setTabsHeight() {
        const componentNode = ReactDom.findDOMNode(this);
        const componentHeight = componentNode.offsetHeight;
        const parentNodeHeight = componentNode.parentNode.offsetHeight;

        const withToolbar = this.props.withToolbar;

        const toolbarHeight = styleConfig.toolbar.height;

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
            <div
                className="tabs-component"
                style={{height: this.state.tabsHeight}}
            >
                <nav className="tabs-header">
                    <ul>{getTabHeaders.call(this)}</ul>
                </nav>
                <div
                    className="tabs-body"
                    ref={c => (this.tabsBody = c)}
                >
                    {config.tabs[selectedTabIndex].content}
                </div>
                {isLoading && <Loader />}
            </div>
        );
    }
}
