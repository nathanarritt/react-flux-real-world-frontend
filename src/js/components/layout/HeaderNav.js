import React, {Component, PropTypes} from 'react';

import thingNamesStore from '../../stores/generated-data/thingNamesStore';
import NavList from './NavList';
import headerNavConfig from '../../config/headerNavConfig';
import sessionActions from '../../actions/sessionActions';
import sessionStore from '../../stores/sessionStore';

export default class HeaderNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thingNames: thingNamesStore.getState().get('thingNames').toJS(),
            selectedThingId: sessionStore.getState().get('selectedThingId')
        };
        this.handleSessionStoreStateChange = this.handleSessionStoreStateChange.bind(this);
    }

    componentWillMount() {
        sessionStore.addChangeListener(this.handleSessionStoreStateChange);
    }

    componentWillUnmount() {
        sessionStore.removeChangeListener(this.handleSessionStoreStateChange);
    }

    handleThingSelection(thing) {
        sessionActions.setSelectedThingId(thing.id);
    }

    handleSessionStoreStateChange() {
        this.setState({
            selectedThingId: sessionStore.getState().get('selectedThingId')
        });
    }

    render() {
        let pathname = this.props.pathname;

        if (pathname === '/') {
            pathname = '/dashboard';
        }

        if (pathname === '/widgets') {
            pathname = '/widgets/basic-table';
        }

        const componentConfig = {
            action: this.handleThingSelection.bind(this),
            list: this.state.thingNames,
            selectedId: this.state.selectedThingId
        };

        return (
            <nav className="page-header-nav">
                <NavList componentConfig={componentConfig}
                         config={headerNavConfig}
                         pathname={pathname} />
            </nav>
        );
    }
}

HeaderNav.propTypes = {
    pathname: PropTypes.string.isRequired
};
