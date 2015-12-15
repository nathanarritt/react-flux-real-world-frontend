import React, {Component, PropTypes} from 'react';

import ContextSelector from '../library/ContextSelector';
import Tabs from '../library/Tabs';
import Toolbar from '../library/Toolbar';
import {formatMessage} from '../../utils/localizationUtils';

import TableTabsToggleForm from './TableTabsToggleForm';

function getTabsToolbarConfig() {
    const {data, handleClose} = this.props;

    const instanceElement = (
        <div>{data && data.name ? data.name : formatMessage('RFRWF_ADD_NEW_TABLE_TABS_TOGGLE')}</div>
    );

    return [
        {
            action: handleClose,
            icon: 'fa fa-caret-left',
            label: 'RFRWF_BACK_TO_TABLE_TABS_TOGGLE',
            type: 'back-link'
        },
        {
            element: instanceElement,
            style: {marginLeft: 200},
            type: 'element'
        }
    ];
}

function getExternalLinksList() {
    return [
        {
            id: 'BING',
            link: 'https://www.bing.com',
            name: formatMessage('RFRWF_BING')
        },
        {
            id: 'GOOGLE',
            link: 'https://www.google.com',
            name: formatMessage('RFRWF_GOOGLE')
        },
        {
            id: 'YAHOO',
            link: 'https://www.yahoo.com',
            name: formatMessage('RFRWF_YAHOO')
        }
    ];
}

function handleExternalLink(selectedItem) {
    window.open(selectedItem.link);
}

function getTabsConfig() {
    const {data, handleClose, handleSave} = this.props;

    return {
        tabs: [
            {
                label: 'SERVER_CONFIGURATION',
                content: <TableTabsToggleForm
                             data={data}
                             handleClose={handleClose}
                             handleSave={handleSave} />
            },
            {
                label: 'COMMENTS',
                content: <div>{'Comments Content'}</div>
            },
            {
                label: 'CONFIG_FILES',
                content: <div>{'Config Files Content'}</div>
            },
            {
                label: 'EMAIL_TEMPLATE',
                content: <div>{'Email Template Content'}</div>
            },
            {
                label: 'SISTER_NODE',
                content: <div>{'Sister Node Content'}</div>,
                icon: 'fa fa-server',
                type: 'link'
            },
            {
                label: 'REVISION',
                content: <div>{'Revision Content'}</div>,
                icon: 'fa fa-history',
                type: 'link'
            },
            {
                component: <ContextSelector
                               action={handleExternalLink}
                               allowRepeat
                               defaultText="EXTERNAL_LINKS"
                               list={getExternalLinksList()} />,
                type: 'component'
            }
        ]
    };
}

export default class TableTabsToggleTabs extends Component {
    render() {
        const isLoading = this.props.isLoading;

        return (
            <div className="page-content with-scroll">
                <Toolbar config={getTabsToolbarConfig.call(this)} />
                <Tabs
                    config={getTabsConfig.call(this)}
                    isLoading={isLoading}
                    withToolbar />
            </div>
        );
    }
}

TableTabsToggleTabs.propTypes = {
    data: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};
