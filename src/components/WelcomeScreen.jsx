import React, { useState, useEffect } from 'react';
import logoKulkas from '../assets/logo-kulkas.png';

const WelcomeScreen = ({ onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Auto close after 50 seconds if user doesn't click
        const timer = setTimeout(() => {
            handleClose();
        }, 50000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for fade out animation
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleClose();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    if (!show) return null;

    return (
        <div
            onClick={handleClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                background: 'linear-gradient(135deg, #0f1115 0%, #1a1d24 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                animation: show ? 'fadeIn 0.5s ease-in' : 'fadeOut 0.3s ease-out',
                opacity: show ? 1 : 0
            }}
        >
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>

            <div style={{
                textAlign: 'center',
                animation: 'slideUp 0.8s ease-out 0.2s both'
            }}>
                <div style={{
                    marginBottom: '2rem',
                    animation: 'pulse 3s ease-in-out infinite'
                }}>
                    <img
                        src={logoKulkas}
                        alt="Logo Kulkas"
                        style={{
                            width: '180px',
                            height: 'auto',
                            filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.3))'
                        }}
                    />
                </div>

                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, var(--primary), #fbbf24)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem',
                    letterSpacing: '2px'
                }}>
                    Selamat Datang
                </h1>

                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: 400,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem',
                    opacity: 0.9
                }}>
                    di Kulkas Kejujuran
                </h2>
                <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 400,
                    color: 'var(--text-muted)',
                    marginBottom: '3rem',
                    opacity: 0.8
                }}>
                    Koperasi KDMP &quot;Koperasi Djasa Maju Pesat&quot;
                </h3>

                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-muted)',
                    marginBottom: '2rem'
                }}>
                    Silahkan bayar sesuai apa yang diambil. Jujur yaaa<br />
                    Selamat Berbelanja.
                </p>

                <div style={{
                    display: 'inline-block',
                    padding: '12px 32px',
                    border: '2px solid var(--primary)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--primary)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    animation: 'pulse 2s ease-in-out infinite',
                    marginTop: '1rem'
                }}>
                    Tekan ENTER atau Klik untuk Mulai
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
