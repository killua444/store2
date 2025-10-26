import Wishlist from '../components/Wishlist';

const WishlistPage = ({ toggleWishlist, addToCart }) => {
  return <Wishlist toggleWishlist={toggleWishlist} addToCart={addToCart} />;
};

export default WishlistPage;
