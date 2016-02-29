import React, {PropTypes} from 'react';

import Footer from './layout/Footer';
import Header from './layout/Header';
import SideColumn from './layout/SideColumn';

export default function App({children, location: {pathname}}) {

    // remove leading forward slash, create an array of path parts, then join
    // the parts with `-`, else default
    const pageClass = pathname.slice(1).split('/').join('-') || 'dashboard';

    return (
        <div className={`app ${pageClass}`}>
            <Header pathname={pathname} />
            <SideColumn pathname={pathname} />
            <div className="page-main">
                {children}
            </div>
            <Footer />
        </div>
    );
}

App.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]),
    location: PropTypes.shape({
        pathname: PropTypes.string
    }).isRequired
};
