import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminAuth, setAdminAuth, clearAdminAuth } from '../utils/storage';
import { waOrderLink } from '../utils/whatsapp';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../utils/supabase';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [auth, setAuth] = useState(getAdminAuth());
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: '',
    title: '',
    brand: '',
    category: '',
    price: '',
    currency: 'MAD',
    image: '',
    rating: 0,
    colors: [],
    sizes: []
  });

  useEffect(() => {
    if (auth) {
      loadProducts();
    }
  }, [auth]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    if (password === 'shadow2002@') {
      setAdminAuth(password);
      setAuth(true);
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid password');
    }
  };

  const logout = () => {
    clearAdminAuth();
    setAuth(false);
    setProducts([]);
    toast.success('Logged out');
  };

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('ID copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy ID');
    }
  };

  const adminCommand = (id) => {
    const message = `/PRODUCT id=${id} name=...`;
    window.open(waOrderLink(message), '_blank');
  };

  const handleAddProduct = async () => {
    if (!newProduct.id || !newProduct.title) {
      toast.error('Please fill in ID and title');
      return;
    }

    try {
      await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        rating: parseFloat(newProduct.rating),
        colors: newProduct.colors.split(',').map(c => c.trim()),
        sizes: newProduct.sizes.split(',').map(s => s.trim())
      });
      toast.success('Product added successfully');
      setNewProduct({
        id: '',
        title: '',
        brand: '',
        category: '',
        price: '',
        currency: 'MAD',
        image: '',
        rating: 0,
        colors: [],
        sizes: []
      });
      loadProducts();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, editingProduct);
      toast.success('Product updated successfully');
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!auth) {
    return (
      <motion.div
        className="container py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Login</h1>
          <div className="card p-6">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button onClick={login} className="btn w-full">
              Login
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>

      <div className="grid grid-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="ID"
              value={newProduct.id}
              onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="text"
              placeholder="Title"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="text"
              placeholder="Brand"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="text"
              placeholder="Colors (comma separated)"
              value={newProduct.colors}
              onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="text"
              placeholder="Sizes (comma separated)"
              value={newProduct.sizes}
              onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
              className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button onClick={handleAddProduct} className="btn w-full">
              Add Product
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Product Management</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
          />

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
              <p className="mt-2 text-muted">Loading products...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-surface-2 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-muted">ID: {product.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyId(product.id)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Copy ID
                    </button>
                    <button
                      onClick={() => adminCommand(product.id)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-surface p-6 rounded-lg max-w-md w-full mx-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={editingProduct.title}
                onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input
                type="number"
                placeholder="Price"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <div className="flex gap-2">
                <button onClick={handleUpdateProduct} className="btn flex-1">
                  Update
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
