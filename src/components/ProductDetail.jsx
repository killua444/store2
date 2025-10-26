import { useParams } from 'react-router-dom';
import { useState } from 'react';
import productsData from '../data/products.json';
import { waOrderLink, buildProductMessage } from '../utils/whatsapp';

const ProductDetail = ({ addToCart, toggleWishlist, wishlist }) => {
  const { id } = useParams();
  const product = productsData.products.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizesEU[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('about');

  if (!product) return <div>Product not found</div>;

  const share = () => {
    window.open(waOrderLink(buildProductMessage(product)), '_blank');
  };

  const isWishlisted = wishlist.some(w => w.id === product.id);

  return (
    <div className="product-detail">
      <div className="container">
        <div className="grid grid-2">
          <img src={product.image} alt={product.title} />
          <div>
            <h1>{product.title}</h1>
            <p>MAD {product.price}</p>
            <div className="rating">⭐ {product.rating} ({product.reviews})</div>
            <div className="selectors">
              <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
                {product.colors.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                {product.sizesEU.map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} />
            </div>
            <div className="actions">
              <button className="btn" onClick={() => addToCart(product, qty, selectedColor, selectedSize)}>Add to Cart</button>
              <button className="btn" onClick={() => { addToCart(product, qty, selectedColor, selectedSize); share(); }}>Buy Now</button>
              <button onClick={share}>📱 Share</button>
              <button onClick={() => toggleWishlist(product)}>{isWishlisted ? '❤️' : '🤍'}</button>
            </div>
          </div>
        </div>
        <div className="tabs">
          <button onClick={() => setTab('about')}>About</button>
          <button onClick={() => setTab('reviews')}>Reviews</button>
        </div>
        {tab === 'about' && <p>About this product...</p>}
        {tab === 'reviews' && <p>Reviews...</p>}
      </div>
    </div>
  );
};

export default ProductDetail;
