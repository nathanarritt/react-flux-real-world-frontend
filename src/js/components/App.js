import React, {Component, PropTypes} from 'react';

import Footer from './layout/Footer';
import Header from './layout/Header';
import SideColumn from './layout/SideColumn';

export default class App extends Component {
    render() {
        const pathname = this.props.location.pathname;

        // remove leading forward slash, create an array of path parts, then join the parts with `-`, else default
        const pageClass = pathname.slice(1).split('/').join('-') || 'dashboard';

        return (
            <div className={`app ${pageClass}`}>
                <Header pathname={pathname} />
                <SideColumn pathname={pathname} />
                <div className="page-main">
                    {this.props.children}
                </div>
                <Footer />
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]),
    location: PropTypes.object.isRequired
};
