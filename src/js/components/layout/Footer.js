import React from 'react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="page-footer">
            {'\u00A9 ' + year + ' RFRWF'}
        </footer>
    );
}
