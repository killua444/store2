import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import WishlistPage from './pages/WishlistPage';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import { getCart, setCart, getWishlist, setWishlist, getTheme, setTheme } from './utils/storage';

function App() {
  const [cart, setCartState] = useState(getCart());
  const [wishlist, setWishlistState] = useState(getWishlist());
  const [theme, setThemeState] = useState(getTheme());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme);
  }, [theme]);

  const addToCart = (product, qty = 1, color = '', size = '') => {
    const item = { ...product, qty, color, size };
    const existing = cart.find(i => i.id === product.id && i.color === color && i.size === size);
    if (existing) {
      const updated = cart.map(i => i.id === product.id && i.color === color && i.size === size ? { ...i, qty: i.qty + qty } : i);
      setCartState(updated);
      setCart(updated);
    } else {
      const updated = [...cart, item];
      setCartState(updated);
      setCart(updated);
    }
    toast.success(`${product.title} added to cart!`);
  };

  const removeFromCart = (id, color, size) => {
    const updated = cart.filter(i => !(i.id === id && i.color === color && i.size === size));
    setCartState(updated);
    setCart(updated);
  };

  const updateQty = (id, color, size, qty) => {
    if (qty <= 0) {
      removeFromCart(id, color, size);
    } else {
      const updated = cart.map(i => i.id === id && i.color === color && i.size === size ? { ...i, qty } : i);
      setCartState(updated);
      setCart(updated);
    }
  };

  const toggleWishlist = (product) => {
    const isWishlisted = wishlist.find(i => i.id === product.id);
    if (isWishlisted) {
      const updated = wishlist.filter(i => i.id !== product.id);
      setWishlistState(updated);
      setWishlist(updated);
      toast.success(`${product.title} removed from wishlist`);
    } else {
      const updated = [...wishlist, product];
      setWishlistState(updated);
      setWishlist(updated);
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  const toggleTheme = () => {
    setThemeState(theme === 'mint' ? 'emerald' : 'mint');
  };

  return (
    <Router>
      <div className="app">
        <Header
          cartCount={cart.length}
          wishlistCount={wishlist.length}
          onCartOpen={() => setCartOpen(true)}
          onThemeToggle={toggleTheme}
          theme={theme}
        />
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
          <Route path="/wishlist" element={<WishlistPage addToCart={addToCart} toggleWishlist={toggleWishlist} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
        </Routes>
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
        />
      </div>
    </Router>
  );
}

export default App;
