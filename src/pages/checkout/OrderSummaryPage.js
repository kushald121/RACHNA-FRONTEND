import React, { useState, useEffect } from 'react';
import { Footer, NavBar } from '../../components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit3, Plus, Minus, MapPin, User, Phone } from 'lucide-react';
import axios from 'axios';

const OrderSummaryPage = () => {
  const { user, getAuthHeaders, getCurrentSessionId, getSessionType } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/Rachna/user-login');
      return;
    }

    // Get selected address from localStorage
    const storedAddress = localStorage.getItem('selectedAddress');
    if (storedAddress) {
      setSelectedAddress(JSON.parse(storedAddress));
    } else {
      navigate('/Rachna/address');
      return;
    }

    fetchCartItems();
  }, [user, navigate]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors

      // Check if auth functions are available
      if (!getCurrentSessionId || !getSessionType) {
        console.error('Auth functions not available');
        setError('Authentication not initialized');
        return;
      }

      const sessionId = getCurrentSessionId();
      const sessionType = getSessionType();

      console.log('Fetching cart for session:', sessionId, 'type:', sessionType);

      let response;
      if (sessionType === 'user') {
        // Fetch from user cart
        response = await axios.get(`https://rachna-backend-1.onrender.com/api/cart/${sessionId}`, {
          headers: getAuthHeaders()
        });
      } else {
        // Fetch from guest cart
        response = await axios.get(`https://rachna-backend-1.onrender.com/api/guest-cart/${sessionId}`);
      }

      console.log('Cart response:', response.data);

      if (response.data.success) {
        const items = response.data.cart.items || [];
        setCartItems(items);
        calculateOrderSummary(items);
        console.log('Cart items loaded:', items);
      } else {
        setError(response.data.message || 'Failed to load cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderSummary = (items) => {
    console.log('Calculating order summary for items:', items);

    const subtotal = items.reduce((sum, item) => sum + (item.itemTotal || item.price * item.quantity), 0);
    const shipping = 0; // Free shipping for all orders
    const total = subtotal + shipping;

    const summary = {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      total: Math.round(total * 100) / 100
    };

    console.log('Calculated order summary:', summary);
    setOrderSummary(summary);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const sessionId = getCurrentSessionId();
      const sessionType = getSessionType();

      if (sessionType === 'user') {
        // Update user cart
        await axios.put('https://rachna-backend-1.onrender.com/api/cart', {
          userId: sessionId,
          productId,
          quantity: newQuantity
        }, {
          headers: getAuthHeaders()
        });
      } else {
        // Update guest cart
        await axios.put('https://rachna-backend-1.onrender.com/api/guest-cart/update', {
          sessionId,
          productId,
          quantity: newQuantity
        });
      }

      fetchCartItems(); // Refresh cart

      // Refresh navbar counts
      if (window.refreshNavbarCounts) {
        window.refreshNavbarCounts();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const sessionId = getCurrentSessionId();
      const sessionType = getSessionType();

      if (sessionType === 'user') {
        // Remove from user cart
        await axios.delete(`https://rachna-backend-1.onrender.com/api/cart/${productId}`, {
          data: { userId: sessionId },
          headers: getAuthHeaders()
        });
      } else {
        // Remove from guest cart
        await axios.delete('https://rachna-backend-1.onrender.com/api/guest-cart/remove', {
          data: { sessionId, productId }
        });
      }

      fetchCartItems(); // Refresh cart

      // Refresh navbar counts
      if (window.refreshNavbarCounts) {
        window.refreshNavbarCounts();
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setError(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    const orderDataToPass = {
      items: cartItems,
      summary: orderSummary
    };

    console.log('Proceeding to payment with order data:', orderDataToPass);
    console.log('Order summary being passed:', orderSummary);

    // Navigate to payment with order data
    navigate('/Rachna/payment', {
      state: {
        selectedAddress,
        orderData: orderDataToPass
      }
    });
  };

  const handleChangeAddress = () => {
    navigate('/Rachna/address');
  };

  if (!user) {
    return (
      <>
        <NavBar />
        <motion.div
          className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-light text-slate-800 mb-4">Please Login</h2>
              <p className="text-slate-600 mb-8 text-lg font-light">You need to be logged in to view your order summary.</p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate('/Rachna/user-login')}
                className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Login / Sign Up
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-wide">
              Order Summary
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto">
              Review your order before proceeding to payment
            </p>
          </motion.div>

          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden"
            variants={containerVariants}
            transition={{ delay: 0.4 }}
          >
            <div className="p-8">
              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="xl:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-light text-slate-800">
                        Order Items ({cartItems.length})
                      </h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/Rachna/allproducts')}
                      className="text-slate-600 hover:text-slate-800 font-medium text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      Continue Shopping
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start space-x-6">
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                crossOrigin="anonymous"
                                className="w-24 h-24 object-cover rounded-xl shadow-md"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-medium text-slate-800 text-lg">{item.name}</h3>
                                  <p className="text-slate-600 mt-1">{item.category}</p>
                                  {item.originalPrice && (
                                    <p className="text-sm text-slate-500 line-through mt-1">₹{item.originalPrice}</p>
                                  )}
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeItem(item.productId)}
                                  className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                      className="text-slate-600 hover:text-slate-800 transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </motion.button>
                                    <span className="font-medium text-slate-800 min-w-[2rem] text-center">{item.quantity}</span>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                      className="text-slate-600 hover:text-slate-800 transition-colors"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-slate-800 text-lg">₹{item.itemTotal || (item.price * item.quantity)}</p>
                                  <p className="text-sm text-slate-500">₹{item.price} each</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {cartItems.length === 0 && !loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                          </svg>
                        </div>
                        <p className="text-slate-500 text-lg font-light mb-4">Your cart is empty</p>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => navigate('/Rachna/allproducts')}
                          className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Start Shopping
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="space-y-8">
                  {/* Delivery Address */}
                  {selectedAddress && (
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-medium text-slate-800 text-lg">Delivery Address</h3>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleChangeAddress}
                          className="text-slate-600 hover:text-slate-800 text-sm font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-all duration-200"
                        >
                          Change
                        </motion.button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-slate-700">
                          <User className="w-4 h-4 mr-3 text-slate-500" />
                          <span className="font-medium">{selectedAddress.name}</span>
                        </div>
                        <div className="flex items-center text-slate-700">
                          <Phone className="w-4 h-4 mr-3 text-slate-500" />
                          <span>{selectedAddress.phone}</span>
                        </div>
                        <div className="flex items-start text-slate-700">
                          <svg className="w-4 h-4 mr-3 mt-0.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="leading-relaxed">
                            {selectedAddress.address_line_1}
                            {selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}
                            <br />
                            {selectedAddress.city}, {selectedAddress.state} - <strong>{selectedAddress.postal_code || selectedAddress.pincode}</strong>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Price Breakdown */}
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-slate-800 text-lg">Price Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-slate-700">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span className="font-medium">₹{orderSummary.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Shipping</span>
                        <span className={`font-medium ${orderSummary.shipping === 0 ? 'text-green-600' : 'text-slate-700'}`}>
                          {orderSummary.shipping === 0 ? 'FREE' : `₹${orderSummary.shipping}`}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-between text-slate-800 text-xl font-semibold">
                          <span>Total</span>
                          <span>₹{orderSummary.total}</span>
                        </div>
                      </div>
                    </div>

                    {orderSummary.subtotal < 500 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <p className="text-sm text-amber-800 font-medium">
                            Add ₹{500 - orderSummary.subtotal} more to get FREE shipping!
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleProceedToPayment}
                      disabled={cartItems.length === 0 || loading}
                      className="w-full mt-8 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <span>Proceed to Payment</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default OrderSummaryPage;
