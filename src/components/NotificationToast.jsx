import React, { useEffect } from 'react';

const NotificationToast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'var(--success)' : 'var(--error)';
    const icon = isSuccess ? '✅' : '⚠️';

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            background: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideDown 0.3s ease-out',
            border: `1px solid ${bgColor}`,
            minWidth: '300px',
            justifyContent: 'center'
        }}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span style={{ fontWeight: 600 }}>{message}</span>
        </div>
    );
};

export default NotificationToast;
