import React, {Component} from 'react';

export default class Footer extends Component {
    render() {
        const year = new Date().getFullYear();

        return (
            <footer className="page-footer">
                {'\u00A9 ' + year + ' RFRWF'}
            </footer>
        );
    }
}
