import React, {PropTypes} from 'react';

import NavList from './NavList';

export default function SideNav({config, pathname}) {
    if (pathname === '/widgets') {
        pathname = '/widgets/basic-table';
    }

    return (
        <nav className="page-side-nav">
            <NavList
                config={config}
                pathname={pathname}
            />
        </nav>
    );
}

SideNav.propTypes = {
    config: PropTypes.arrayOf(PropTypes.shape({
        children: PropTypes.arrayOf(PropTypes.object),
        className: PropTypes.string,
        label: PropTypes.string,
        pathname: PropTypes.string
    })).isRequired,
    pathname: PropTypes.string.isRequired
};
