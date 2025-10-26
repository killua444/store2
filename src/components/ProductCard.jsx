import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { waOrderLink, buildProductMessage } from '../utils/whatsapp';
import toast from 'react-hot-toast';

const ProductCard = ({ product, addToCart, toggleWishlist, isWishlisted }) => {
  const shareOnWhatsApp = () => {
    const message = buildProductMessage(product);
    window.open(waOrderLink(message), '_blank');
    toast.success('Product shared on WhatsApp!');
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <motion.div
      className="card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover lazy-image"
            onLoad={(e) => e.target.classList.add('loaded')}
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleWishlist();
              }}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-muted text-sm mb-2">{product.brand}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-brand">{product.price} {product.currency}</span>
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span className="text-sm">{product.rating} ({product.reviews})</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            className="btn flex-1"
          >
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              shareOnWhatsApp();
            }}
            className="btn-secondary p-3"
          >
            📱
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
