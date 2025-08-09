import React, { useState, useEffect } from 'react';
import { Footer, NavBar } from '../../components';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, TrashIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { getFavorites, removeFromFavorites, addToCart } from '../../utils/cartUtils';
import { Link } from 'react-router-dom';

function Fav() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { getCurrentSessionId, getSessionType, getAuthHeaders } = useAuth();

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
            const result = await getFavorites(authContext);

            if (result.success) {
                setFavorites(result.favorites);
            } else {
                setError('Failed to load favorites');
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRemoveFromFavorites = async (productId) => {
        try {
            const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
            const result = await removeFromFavorites(productId, authContext);

            if (result.success) {
                setFavorites(favorites.filter(item => item.productId !== productId));
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
            const result = await addToCart(productId, 1, authContext);

            if (result.success) {
                // Show success message or update UI
                console.log('Added to cart successfully');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: { duration: 0.3 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                                <HeartIconSolid className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-light text-slate-800 tracking-wide">
                                Wishlist
                            </h1>
                        </div>
                        <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto mb-4 rounded-full"></div>
                        <p className="text-slate-600 text-lg font-light">
                            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later
                        </p>
                    </motion.div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                                <span className="text-slate-600 font-light">Loading your wishlist...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XMarkIcon className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-red-600 text-lg font-medium mb-2">Oops! Something went wrong</p>
                            <p className="text-slate-500">{error}</p>
                        </motion.div>
                    ) : favorites.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HeartIcon className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-light text-slate-800 mb-4">
                                Your wishlist is empty
                            </h3>
                            <p className="text-slate-600 mb-8 font-light">
                                Start adding items you love to your wishlist
                            </p>
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Link
                                    to="/Rachna/allproducts"
                                    className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Continue Shopping
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence>
                                {favorites.map((item, index) => (
                                    <motion.div
                                        key={item.productId}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 overflow-hidden"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                                            <Link to={`/Rachna/product/${item.productId}`}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    crossOrigin="anonymous"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300x300/E5E7EB/9CA3AF?text=No+Image';
                                                    }}
                                                />
                                            </Link>

                                            {/* Remove from wishlist button */}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemoveFromFavorites(item.productId)}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-200"
                                            >
                                                <XMarkIcon className="w-4 h-4 text-slate-600" />
                                            </motion.button>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-4">
                                            <Link
                                                to={`/Rachna/product/${item.productId}`}
                                                className="block"
                                            >
                                                <h3 className="font-medium text-slate-800 hover:text-slate-600 transition-colors duration-200 line-clamp-2 mb-2">
                                                    {item.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-semibold text-slate-800">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                    {item.originalPrice && (
                                                        <span className="text-sm text-slate-500 line-through">
                                                            {formatCurrency(item.originalPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.originalPrice && (
                                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            {item.stock > 0 ? (
                                                <div className="flex items-center text-xs text-green-600 mb-4">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                    In Stock
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-xs text-red-600 mb-4">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                                    Out of Stock
                                                </div>
                                            )}

                                            {/* Add to Cart Button */}
                                            <motion.button
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                onClick={() => handleAddToCart(item.productId)}
                                                disabled={item.stock === 0}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                                    item.stock === 0
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900 shadow-lg hover:shadow-xl'
                                                }`}
                                            >
                                                <ShoppingBagIcon className="h-4 w-4" />
                                                {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Fav;