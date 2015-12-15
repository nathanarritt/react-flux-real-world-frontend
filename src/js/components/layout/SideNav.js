import React, {Component, PropTypes} from 'react';

import NavList from './NavList';

export default class SideNav extends Component {
    render() {
        let pathname = this.props.pathname;

        if (pathname === '/widgets') {
            pathname = '/widgets/basic-table';
        }

        return (
            <nav className="page-side-nav">
                <NavList config={this.props.config} pathname={pathname} />
            </nav>
        );
    }
}

SideNav.propTypes = {
    config: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired
};
