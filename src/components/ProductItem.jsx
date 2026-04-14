import React from 'react';
import { api } from '../services/api';

const ProductItem = ({ product, onAdd, viewMode }) => {
    const isList = viewMode === 'list';
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(product.price);

    return (
        <div className={`glass glass-hover ${isList ? 'product-item-list' : 'product-item-grid'}`} style={{
            borderRadius: 'var(--radius-lg)',
            padding: isList ? '12px' : '16px',
            display: 'flex',
            flexDirection: isList ? 'row' : 'column',
            alignItems: isList ? 'center' : 'stretch',
            gap: isList ? '12px' : '16px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                width: isList ? '60px' : '100%',
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#2d3748',
                flexShrink: 0
            }}>
                <img
                    src={api.resolveImage(product.image)}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                    loading="lazy"
                />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: isList ? '1rem' : '1.1rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{product.name}</h3>
                <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                    {formattedPrice}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: product.stock > 0 ? 'var(--text-muted)' : 'var(--secondary)', fontWeight: product.stock <= 0 ? 600 : 'normal' }}>
                    Sisa stok: {product.stock} {product.stock <= 0 && '(Habis)'}
                </p>
            </div>

            <button
                className="btn-primary"
                onClick={() => onAdd(product)}
                disabled={product.stock <= 0}
                style={{
                    width: isList ? 'auto' : '100%',
                    padding: isList ? '8px 16px' : '10px',
                    fontSize: '0.9rem',
                    opacity: product.stock <= 0 ? 0.5 : 1,
                    cursor: product.stock <= 0 ? 'not-allowed' : 'pointer'
                }}
            >
                {product.stock <= 0 ? 'Habis' : '+ Add'}
            </button>
        </div>
    );
};

export default ProductItem;
