import React, {Component, PropTypes} from 'react';

import HeaderNav from './HeaderNav';

export default class Header extends Component {
    render() {
        return (
            <header className="page-header">
                <div className="page-logo" />
                <HeaderNav pathname={this.props.pathname} />
            </header>
        );
    }
}

Header.propTypes = {
    pathname: PropTypes.string.isRequired
};
