import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getWishlist } from '../utils/storage';

const Wishlist = ({ toggleWishlist, addToCart }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const removeFromWishlist = (product) => {
    const updated = wishlist.filter(item => item.id !== product.id);
    setWishlist(updated);
    toggleWishlist(product);
  };

  return (
    <div className="container py-8">
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        My Wishlist
      </motion.h1>

      {wishlist.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
          <p className="text-muted">Start adding products you love!</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={removeFromWishlist}
                isWishlisted={true}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
