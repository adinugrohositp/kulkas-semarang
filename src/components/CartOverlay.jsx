import React from 'react';

const CartOverlay = ({ cart, isOpen, onClose, onUpdateQuantity, onRemove, onCheckout }) => {
    if (!isOpen) return null;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(total);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: isOpen ? 0 : '-400px',
            bottom: 0,
            width: '400px',
            zIndex: 100,
            transition: 'right 0.3s ease',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-color)',
            boxShadow: isOpen ? '-10px 0 30px rgba(0,0,0,0.3)' : 'none',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Keranjang</h2>
                <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {cart.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>Keranjang masih kosong.</p>
                ) : (
                    cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px 0' }}>{item.name}</h4>
                                <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 600 }}>
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button onClick={() => onUpdateQuantity(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700 }}>
                    <span>Total</span>
                    <span>{formattedTotal}</span>
                </div>
                <button
                    className="btn-primary"
                    style={{ width: '100%' }}
                    disabled={cart.length === 0}
                    onClick={onCheckout}
                >
                    Checkout with QRIS
                </button>
            </div>
        </div>
    );
};

export default CartOverlay;
