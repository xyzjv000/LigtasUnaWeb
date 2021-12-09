import React from 'react';

function Footer() {
    const customSTyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100px',
        width: '100%',
        backgroundColor: '#e7e7e7',
        display: 'flex',
        alignitems: 'center',
        justifyContent: 'center',
    };
    return (
        <div style={customSTyle} className="container-fluid">
            <h2>This is the Footer</h2>
        </div>
    );
}

export default Footer;
