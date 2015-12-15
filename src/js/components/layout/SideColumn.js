import React, {Component, PropTypes} from 'react';

import SideNav from './SideNav';
import sideNavConfig from '../../config/sideNavConfig';

export default class SideColumn extends Component {
    render() {
        const pathname = this.props.pathname;
        const parentForwardSlash = pathname.indexOf('/', 1);
        const parentPathEnd = parentForwardSlash !== -1
            ? parentForwardSlash : pathname.length;
        const parentPath = pathname.slice(1, parentPathEnd);//window.location.pathname.slice(1, -1);

        const config = sideNavConfig[parentPath];

        let sideNav;

        if (config) {
            sideNav = (
                <SideNav config={config} pathname={pathname} />
            );
        }

        return (
            <div className="page-side-column">
                {sideNav}
            </div>
        );
    }
}

SideColumn.propTypes = {
    pathname: PropTypes.string.isRequired
};
