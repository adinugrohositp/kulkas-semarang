import React from 'react';

const SecretLoginBtn = ({ onLogin }) => {
    return (
        <div
            onClick={onLogin}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '50px',
                height: '50px',
                zIndex: 9999,
                cursor: 'default', // Don't show hand cursor to keep it secret
                opacity: 0, // Invisible
            }}
            title="" // No tooltip
        />
    );
};

export default SecretLoginBtn;
