import { useState, useEffect } from 'react';
import './index.css';
import { api } from './services/api';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartOverlay from './components/CartOverlay';
import CheckoutModal from './components/CheckoutModal';
import SecretLoginBtn from './components/SecretLoginBtn';
import AdminDashboard from './components/AdminDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import LoginModal from './components/LoginModal';
import CartToast from './components/CartToast';
import NotificationToast from './components/NotificationToast';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [qrisUrl, setQrisUrl] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'az', 'za'
  const [appLogoUrl, setAppLogoUrl] = useState("");

  // Notification state
  const [notification, setNotification] = useState(null);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Fetch products and settings from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, settingsData] = await Promise.all([
          api.getProducts(),
          api.getSettings()
        ]);
        setProducts(productsData);
        // ... rest of fetch logic
        if (settingsData.qris_url) {
          setQrisUrl(settingsData.qris_url);
        }
        if (settingsData.app_logo_url) {
          setAppLogoUrl(settingsData.app_logo_url);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Filter and Sort products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'az') return a.name.localeCompare(b.name);
    if (sortBy === 'za') return b.name.localeCompare(a.name);
    if (sortBy === 'newest') return b.id - a.id; // Or use created_at if available
    return 0;
  });

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('Maaf, stok barang habis.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Stok tidak mencukupi.');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Removed setIsCartOpen(true) - now shows CartToast instead
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      if (cart.length > 0) {
        await api.checkout(cart);
      }
      setIsCheckoutOpen(false);
      setCart([]);
      
      // Optimitically update product stocks
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
      }));
      
      setNotification({
        message: "Terima kasih! Pembayaran berhasil.",
        type: "success"
      });
    } catch (e) {
      alert("Checkout gagal. Silakan coba lagi.");
    }
  };

  const handlePaymentTimeout = () => {
    setIsCheckoutOpen(false);
    setCart([]);
    setNotification({
      message: "Waktu habis! Keranjang dikosongkan.",
      type: "error"
    });
  };

  const handleAddNewProduct = async (newProduct) => {
    try {
      const created = await api.createProduct(newProduct);
      setProducts(prev => [created, ...prev]);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Gagal menambahkan produk. Coba lagi.');
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const updated = await api.updateProduct(updatedProduct.id, updatedProduct);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Gagal mengupdate produk. Coba lagi.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await api.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Gagal menghapus produk. Coba lagi.');
      }
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (isAdmin) {
    return (
      <AdminDashboard
        onExit={() => setIsAdmin(false)}
        onAddProduct={handleAddNewProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        products={products}
        qrisUrl={qrisUrl}
        onUpdateQris={(url) => setQrisUrl(url)}
        appLogoUrl={appLogoUrl}
        onUpdateAppLogo={(url) => setAppLogoUrl(url)}
      />
    );
  }

  return (
    <div className="app-container">
      {showWelcome && (
        <WelcomeScreen onClose={() => {
          setShowWelcome(false);
        }} />
      )}

      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <SecretLoginBtn onLogin={() => setIsLoginOpen(true)} />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={async (password) => {
          try {
            const res = await api.login(password);
            if (res.success) {
              setIsAdmin(true);
              setIsLoginOpen(false);
            }
          } catch (error) {
            alert('Password salah!');
          }
        }}
      />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        isCartOpen={isCartOpen}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        appLogoUrl={appLogoUrl}
      />

      <div className="container" style={{
        paddingRight: isCartOpen ? '420px' : '0',
        transition: 'padding-right 0.3s ease'
      }}>
        <ProductList
          products={filteredProducts}
          onAdd={addToCart}
          viewMode={viewMode}
        />
      </div>

      <CartOverlay
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={(id) => updateQuantity(id, -100)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        total={cartTotal}
        qrisUrl={qrisUrl}
        onClose={handlePaymentTimeout}
        onPaymentComplete={handlePaymentSuccess}
      />

      {!isCartOpen && (
        <CartToast
          count={cartCount}
          total={cartTotal}
          onClick={() => setIsCartOpen(true)}
        />
      )}
    </div>
  );
}

export default App;
