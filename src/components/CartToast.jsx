import React from 'react';

const CartToast = ({ count, total, onClick }) => {
    if (count === 0) return null;

    const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(total);

    return (
        <div className="cart-toast" onClick={onClick}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    fontSize: '1.2rem',
                    background: 'rgba(0,0,0,0.1)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    🛒
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{count} Item Berhasil Ditambah</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Klik untuk selesaikan belanja</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.7 }}>Total</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{formattedTotal}</div>
            </div>
        </div>
    );
};

export default CartToast;
