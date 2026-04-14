import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const CheckoutModal = ({ isOpen, total, qrisUrl, onClose, onPaymentComplete }) => {
    const [timeLeft, setTimeLeft] = useState(60); // Set to 60s as per previous user request

    useEffect(() => {
        if (!isOpen) return;

        setTimeLeft(60);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(total);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass" style={{
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                maxWidth: '420px',
                width: '90%',
                animation: 'popIn 0.3s ease-out',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{ marginBottom: '8px' }}>Scan QRIS untuk Bayar</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 24px 0' }}>
                    {formattedTotal}
                </p>

                <div style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'inline-block'
                }}>
                    <img
                        src={api.resolveImage(qrisUrl) || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KulkasKejujuran"}
                        alt="QRIS Code"
                        style={{ width: '220px', height: '220px', objectFit: 'contain' }}
                    />
                    <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>KULKAS KEJUJUURAN</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Menunggu pembayaran...</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 600, color: timeLeft < 10 ? 'var(--secondary)' : 'var(--text-main)' }}>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
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
                        className="btn-primary"
                        onClick={onPaymentComplete}
                        style={{ flex: 1 }}
                    >
                        Sudah Bayar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
