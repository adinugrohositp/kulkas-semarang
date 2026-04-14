import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminDashboard = ({ onExit, onAddProduct, onUpdateProduct, onDeleteProduct, products, qrisUrl, onUpdateQris, appLogoUrl, onUpdateAppLogo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [imgMode, setImgMode] = useState('url'); // 'url' or 'upload'
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        price: '',
        category: 'makanan',
        image: '',
        stock: 0,
        initial_stock: 0
    });
    
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        api.getSettings().then(res => {
            if (res.total_sales) {
                setTotalSales(parseInt(res.total_sales, 10));
            }
        }).catch(err => console.error('Failed to fetch total_sales', err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setUploading(true);
                const result = await api.uploadFile(file);
                setFormData(prev => ({ ...prev, image: result.url }));
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Gagal upload gambar. Coba lagi.');
            } finally {
                setUploading(false);
            }
        }
    };

    const startEdit = (product) => {
        setIsEditing(true);
        setFormData({ ...product, stock: product.stock || 0, initial_stock: product.initial_stock || 0 });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({ id: null, name: '', price: '', category: 'makanan', image: '', stock: 0, initial_stock: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.image) {
            alert("Harap isi semua kolom wajib!");
            return;
        }

        const priceInt = parseInt(formData.price) || 0;
        const stockInt = parseInt(formData.stock) || 0;
        const initialStockInt = parseInt(formData.initial_stock) || stockInt; // fallback to stock if not filled

        try {
            setUploading(true);

            // If URL mode and image is a URL (not proxy), upload to proxy first via server
            let finalImageUrl = formData.image;
            if (imgMode === 'url' && formData.image.startsWith('http') && !formData.image.includes('/api/image')) {
                const result = await api.uploadFromUrl(formData.image);
                finalImageUrl = result.url;
            }

            if (isEditing) {
                await onUpdateProduct({ ...formData, price: priceInt, stock: stockInt, initial_stock: initialStockInt, image: finalImageUrl });
                alert("Produk berhasil diperbarui!");
            } else {
                const newProduct = {
                    name: formData.name,
                    price: priceInt,
                    category: formData.category,
                    stock: stockInt,
                    initial_stock: initialStockInt,
                    image: finalImageUrl
                };
                await onAddProduct(newProduct);
                alert("Produk berhasil ditambahkan!");
            }

            cancelEdit();
        } catch (error) {
            console.error('Submit failed:', error);
            alert(`Gagal menyimpan produk: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            <button onClick={onExit} style={{ marginBottom: '20px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                ← Kembali ke Toko
            </button>

            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-xl)', maxWidth: '800px', margin: '0 auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                
                {/* Total Saldo Penjualan Widget */}
                <div style={{ marginBottom: '24px', background: 'var(--primary)', color: '#111', padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, opacity: 0.8 }}>Total Saldo Penjualan</p>
                        <h3 style={{ margin: '4px 0 0 0', fontSize: '2.2rem' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalSales)}</h3>
                    </div>
                    <div style={{ fontSize: '3rem', opacity: 0.8 }}>💰</div>
                </div>

                <h2 className="title-gradient" style={{ marginBottom: '24px' }}>
                    {isEditing ? 'Edit Menu' : 'Admin Dashboard'}
                </h2>

                <div style={{ marginBottom: '40px', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {/* QRIS */}
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>🖼️ Pengaturan QRIS Pembayaran</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '8px', padding: '5px', flexShrink: 0 }}>
                                    <img src={api.resolveImage(qrisUrl) || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KulkasKejujuran"} alt="QRIS" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upload file QRIS Anda agar pelanggan bisa scan saat checkout.</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                try {
                                                    setUploading(true);
                                                    const result = await api.uploadFile(file);
                                                    await api.updateSetting('qris_url', result.url);
                                                    onUpdateQris(result.url);
                                                    alert('QRIS berhasil diupdate!');
                                                } catch (error) {
                                                    console.error('QRIS upload failed:', error);
                                                    alert('Gagal update QRIS.');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }
                                        }}
                                        style={{ fontSize: '0.9rem', color: 'var(--text-main)', width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logo */}
                        <div>
                            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>✨ Pengaturan Logo Aplikasi</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ width: '100px', height: '100px', background: 'var(--bg-color)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '5px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {appLogoUrl ? (
                                        <img src={api.resolveImage(appLogoUrl)} alt="App Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Belum ada</span>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upload gambar logo kustom untuk ditaruh di menu header.</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                try {
                                                    setUploading(true);
                                                    const result = await api.uploadFile(file);
                                                    await api.updateSetting('app_logo_url', result.url);
                                                    onUpdateAppLogo(result.url);
                                                    alert('Logo berhasil diupdate!');
                                                } catch (error) {
                                                    console.error('Logo upload failed:', error);
                                                    alert('Gagal update Logo.');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }
                                        }}
                                        style={{ fontSize: '0.9rem', color: 'var(--text-main)', width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Nama Menu</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Contoh: Otak-otak"
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '1rem', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Kategori</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '1rem', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                            >
                                <option value="makanan">Makanan</option>
                                <option value="minuman">Minuman</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Harga (Rp)</label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="5000"
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '1rem', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Sisa Stok</label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="10"
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '1rem', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Jml Stok Awal</label>
                            <input
                                name="initial_stock"
                                type="number"
                                value={formData.initial_stock}
                                onChange={handleChange}
                                placeholder="10"
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '1rem', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Gambar Barang</label>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setImgMode('url')}
                                    style={{
                                        fontSize: '0.8rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        background: imgMode === 'url' ? 'var(--primary)' : 'var(--bg-color)',
                                        color: imgMode === 'url' ? '#000' : 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🔗 URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImgMode('upload')}
                                    style={{
                                        fontSize: '0.8rem',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        background: imgMode === 'upload' ? 'var(--primary)' : 'var(--bg-color)',
                                        color: imgMode === 'upload' ? '#000' : 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📁 Upload
                                </button>
                            </div>

                            {imgMode === 'url' ? (
                                <input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '1rem', background: 'var(--bg-color)', color: 'var(--text-main)' }}
                                />
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ width: '100%', padding: '8px', fontSize: '1rem', color: 'var(--text-main)' }}
                                />
                            )}

                            {formData.image && (
                                <div style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={api.resolveImage(formData.image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {isEditing && (
                            <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                Batal
                            </button>
                        )}
                        <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={uploading}>
                            {uploading ? 'Uploading...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Menu Baru')}
                        </button>
                    </div>
                </form>

                <h3 style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>Daftar Menu</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                    {products.map(p => (
                        <div key={p.id} onClick={() => startEdit(p)} style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: isEditing && formData.id === p.id ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }} className="glass-hover">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteProduct(p.id);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.9)',
                                    color: 'white',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    zIndex: 2,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                                title="Hapus Produk"
                            >
                                ✕
                            </button>
                            <img src={api.resolveImage(p.image)} alt={p.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '8px' }} />
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</p>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rp {p.price}</p>
                            <div style={{ marginTop: '6px', fontSize: '0.8rem', color: p.stock <= 0 ? 'var(--secondary)' : 'var(--text-muted)' }}>
                                Stok: {p.stock || 0} / {p.initial_stock || 0}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
