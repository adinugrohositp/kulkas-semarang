import React, { useState } from 'react';

const LoginModal = ({ isOpen, onLogin, onClose }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(password);
        setPassword('');
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="glass" style={{
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                width: '100%',
                maxWidth: '400px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
            }}>
                <h2 className="title-gradient" style={{ marginBottom: '24px' }}>Admin Login</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan Sandi Admin"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-color)',
                                color: 'var(--text-main)',
                                fontSize: '1rem',
                                textAlign: 'center'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                color: 'var(--text-muted)',
                                cursor: 'pointer'
                            }}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ flex: 1 }}
                        >
                            Masuk
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
