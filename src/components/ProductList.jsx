import React from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products, onAdd, viewMode }) => {
    if (products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem' }}>Tidak ada barang yang ditemukan.</p>
            </div>
        );
    }

    return (
        <div className={`product-grid ${viewMode}`}>
            {products.map(product => (
                <ProductItem key={product.id} product={product} onAdd={onAdd} viewMode={viewMode} />
            ))}
        </div>
    );
};

export default ProductList;
