import React, {PropTypes} from 'react';

import HeaderNav from './HeaderNav';

export default function Header({pathname}) {
    return (
        <header className="page-header">
            <div className="page-logo" />
            <HeaderNav pathname={pathname} />
        </header>
    );
}

Header.propTypes = {
    pathname: PropTypes.string.isRequired
};
