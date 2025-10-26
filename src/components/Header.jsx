import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = ({ cartCount, wishlistCount, onCartOpen, onThemeToggle, theme }) => {
  return (
    <motion.header
      className="header glass sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-bold">
          Shadow Wear
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/wishlist" className="flex items-center gap-2 hover:text-brand transition-colors">
            ❤️ {wishlistCount}
          </Link>
          <button
            onClick={onCartOpen}
            className="flex items-center gap-2 hover:text-brand transition-colors"
          >
            🛒 {cartCount}
          </button>
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {theme === 'mint' ? '🌙' : '☀️'}
          </button>
          <Link
            to="/admin/login"
            className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-dark transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
