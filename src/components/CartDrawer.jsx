import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waOrderLink, buildCartMessage } from '../utils/whatsapp';
import { fetchSettings } from '../utils/supabase';
import toast from 'react-hot-toast';

const CartDrawer = ({ open, onClose, cart, updateQty, removeFromCart }) => {
  const [settings, setSettings] = useState(null);
  const [promo, setPromo] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '' });

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSettings();
      setSettings(data);
    };
    loadSettings();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= (settings?.freeShippingThresholdMAD || 500) ? 0 : (settings?.shippingFlatMAD || 30);
  const discount = promo === 'WELCOME10' ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handleCheckout = () => {
    if (!customer.name || !customer.phone) {
      toast.error('Please enter your name and phone number');
      return;
    }
    const message = buildCartMessage(customer, cart, total);
    window.open(waOrderLink(message), '_blank');
    toast.success('Order sent to WhatsApp!');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-line">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-line rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${item.color}-${item.size}`}
                        className="flex gap-4 p-4 bg-surface-2 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted">
                            {item.color} / {item.size}
                          </p>
                          <p className="font-bold text-brand">
                            MAD {item.price}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, item.color, item.size, item.qty - 1)}
                              className="w-8 h-8 rounded-full bg-line hover:bg-muted transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.color, item.size, item.qty + 1)}
                              className="w-8 h-8 rounded-full bg-line hover:bg-muted transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.color, item.size)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-line space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>MAD {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>MAD {shipping.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (WELCOME10):</span>
                        <span>-MAD {discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>MAD {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Promo code (WELCOME10)"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value.toUpperCase())}
                    className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
                  />

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full p-3 rounded-lg bg-surface-2 border border-line focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>

                  <button
                    className="btn w-full"
                    onClick={handleCheckout}
                  >
                    Checkout on WhatsApp
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
