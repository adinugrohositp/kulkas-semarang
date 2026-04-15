import React from 'react';
import ThemeToggle from './ThemeToggle';
import { api } from '../services/api';

const Header = ({ searchQuery, setSearchQuery, category, setCategory, cartCount, onOpenCart, theme, toggleTheme, isCartOpen, viewMode, setViewMode, sortBy, setSortBy, appLogoUrl }) => {
    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '24px 20px',
            background: 'rgba(15, 17, 21, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div className="container" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    {/* Logo Area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {appLogoUrl ? (
                            <img src={api.resolveImage(appLogoUrl)} alt="App Logo" style={{ height: '96px', width: 'auto', maxWidth: '280px', objectFit: 'contain', borderRadius: '8px' }} />
                        ) : (
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: '32px'
                            }}>
                                K
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                                Kulkas<span style={{ color: 'var(--primary)' }}>Kejujuran</span>
                            </span>
                            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Koperasi KDMP &quot;Koperasi Djasa Maju Pesat&quot;
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

                        {/* Cart Button */}
                        <button
                            onClick={onOpenCart}
                            className="btn-primary"
                            style={{
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#000',
                                fontSize: '0.9rem'
                            }}
                        >
                            🛒 <span>{cartCount}</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="Cari makanan atau minuman..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px',
                            paddingLeft: '40px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-main)',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                        🔍
                    </span>
                </div>

                {/* View/Category/Sort Controls */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                    width: '100%',
                    scrollbarWidth: 'none' // Hide scrollbar for cleaner look
                }}>
                    {/* View Toggle */}
                    <div style={{
                        display: 'flex',
                        background: 'var(--bg-secondary)',
                        padding: '3px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        flexShrink: 0
                    }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                                color: viewMode === 'grid' ? '#000' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            ⣿
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                                color: viewMode === 'list' ? '#000' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            ☰
                        </button>
                    </div>

                    {/* Sort Selector */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-main)',
                            fontSize: '0.85rem',
                            flexShrink: 0
                        }}
                    >
                        <option value="newest">🕒 Terbaru</option>
                        <option value="az">🔤 A-Z</option>
                        <option value="za">🔤 Z-A</option>
                    </select>

                    {/* Category Toggles */}
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        {['all', 'makanan', 'minuman', 'household', 'personal care'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: category === cat ? '1px solid var(--primary)' : '1px solid transparent',
                                    background: category === cat ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                    color: category === cat ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: category === cat ? 600 : 400,
                                    fontSize: '0.85rem',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {cat === 'all' ? 'Semua' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
