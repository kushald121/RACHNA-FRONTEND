import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { ShoppingBagIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { NavBar, Footer } from '../../components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { addToCart, addToFavorites, removeFromFavorites, isInFavorites } from '../../utils/cartUtils';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DynamicProductOverview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, getCurrentSessionId, getSessionType, getAuthHeaders } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Animation variants
  const containerMotion = {
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const textMotion = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeInOut' }},
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product && !loading) {
      checkFavoriteStatus();
    }
  }, [product, loading, user]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://rachna-backend-1.onrender.com/api/fetch/product/${productId}`);
      
      if (response.data.success) {
        const productData = response.data.product;
        
        // Define all available sizes
        const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

        // Get sizes from database (if any)
        const dbSizes = productData.sizes ? productData.sizes.split(',').map(size => size.trim()) : [];

        // Create sizes array with all sizes, marking database sizes as in stock
        const sizesArray = allSizes.map(size => ({
          name: size,
          inStock: dbSizes.includes(size) || dbSizes.length === 0 // If no sizes specified, all are available
        }));

        // Process product data (backend now handles pricing calculations)
        const processedProduct = {
          ...productData,
          sizes: sizesArray,
          media: productData.media || [], // Keep all media (images and videos)
          images: productData.media ? productData.media.filter(m => m.media_type === 'image') : [],
          videos: productData.media ? productData.media.filter(m => m.media_type === 'video') : [],
          finalPrice: productData.price, // Backend already calculated final price
          originalPrice: productData.originalPrice // Backend provides original price if discount exists
        };
        
        setProduct(processedProduct);
        
        // Set default size
        if (processedProduct.sizes.length > 0) {
          setSelectedSize(processedProduct.sizes[0].name);
        }
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const authContext = { getCurrentSessionId, getSessionType };
      const result = await isInFavorites(productId, authContext);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
      
      const result = await addToCart(productId, quantity, authContext);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Item added to cart successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);

        // Refresh navbar counts
        if (window.refreshNavbarCounts) {
          window.refreshNavbarCounts();
        }
      } else {
        setMessage({ type: 'error', text: result.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({ type: 'error', text: 'Failed to add item to cart' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
      
      if (isFavorite) {
        const result = await removeFromFavorites(productId, authContext);
        if (result.success) {
          setIsFavorite(false);
          setMessage({ type: 'success', text: 'Removed from favorites' });
        }
      } else {
        const result = await addToFavorites(productId, authContext);
        if (result.success) {
          setIsFavorite(true);
          setMessage({ type: 'success', text: 'Added to favorites' });
        }
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/Rachna/')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Go Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      
      {/* Hero Background */}
      <div
        className="h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://as1.ftcdn.net/jpg/02/51/96/78/1000_F_251967893_C2Juc2NmrkqrZmBjMfFGF0Pk4f7GMimO.jpg)'
        }}
      >
        <div className="h-full bg-black bg-opacity-25 flex items-center justify-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {product.name}
          </motion.h1>
        </div>
      </div>

      <div className="bg-white">
        <motion.div 
          className="pt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, amount: 0.2}}
          variants={containerMotion}
        >
          {/* Message Display */}
          {message.text && (
            <div className={`mx-auto max-w-7xl px-6 mb-4`}>
              <div className={`p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            </div>
          )}

          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb">
            <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-6 lg:max-w-7xl lg:px-10">
              <li>
                <motion.span variants={textMotion}>
                  <button
                    onClick={() => navigate('/Rachna/')}
                    className="mr-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
                  >
                    Home
                  </button>
                </motion.span>
                <motion.span variants={textMotion}>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </motion.span>
              </li>
              <li>
                <motion.span variants={textMotion}>
                  <button
                    onClick={() => navigate('/Rachna/allproducts')}
                    className="mr-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
                  >
                    Products
                  </button>
                </motion.span>
                <motion.span variants={textMotion}>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </motion.span>
              </li>
              <li className="text-sm">
                <motion.span variants={textMotion}>
                  <span className="font-medium text-gray-900">
                    {product.name}
                  </span>
                </motion.span>
              </li>
            </ol>
          </nav>

          {/* PRODUCT */}
          <div className="flex flex-col mx-auto lg:flex-row lg:max-w-7xl">
            {/* IMAGE GALLERY */}
            <div className="flex-1 mx-auto mt-6 pb-4 sm:pb-6 lg:pb-32 max-w-2xl px-4 sm:px-6 lg:px-8">
              {/* Main Media Display */}
              <motion.div className="overflow-hidden sm:rounded-lg shadow-lg flex justify-center items-center lg:mr-5 lg:ml-5" variants={textMotion}>
                {product.media && product.media.length > 0 ? (
                  <div className="h-96 w-auto flex justify-center items-center">
                    {product.media[selectedImageIndex]?.media_type === 'video' ? (
                      <video
                        src={product.media[selectedImageIndex]?.media_url}
                        controls
                        className="h-96 w-auto object-cover object-center rounded-lg"
                        poster={product.images[0]?.media_url || 'https://via.placeholder.com/600'}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={product.media[selectedImageIndex]?.media_url || 'https://via.placeholder.com/600'}
                        alt={product.name}
                        crossOrigin="anonymous"
                        className="h-96 w-auto object-cover object-center"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x600/E5E7EB/9CA3AF?text=Image+Error';
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="h-96 w-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No media available</span>
                  </div>
                )}
              </motion.div>

              {/* Media Thumbnails */}
              {product.media && product.media.length > 1 && (
                <motion.div className="flex justify-center space-x-2 sm:space-x-4 border-t border-gray-300 pt-1 mt-8 overflow-x-auto" variants={textMotion}>
                  {product.media.slice(0, 4).map((media, index) => (
                    <div
                      key={index}
                      className={`relative mt-8 h-20 w-20 sm:h-28 sm:w-28 rounded-lg shadow-lg cursor-pointer flex-shrink-0 ${
                        selectedImageIndex === index ? 'opacity-75 ring-2 ring-indigo-500' : 'hover:opacity-75'
                      }`}
                      onMouseEnter={() => setSelectedImageIndex(index)}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      {media.media_type === 'video' ? (
                        <>
                          <video
                            src={media.media_url}
                            className="h-20 w-20 sm:h-28 sm:w-28 rounded-lg object-cover object-center"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <img
                          src={media.media_url || 'https://via.placeholder.com/100'}
                          alt={`${product.name} ${index + 1}`}
                          crossOrigin="anonymous"
                          className="h-20 w-20 sm:h-28 sm:w-28 rounded-lg object-cover object-center"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/112x112/E5E7EB/9CA3AF?text=Image+Error';
                          }}
                        />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="flex-1 mx-auto max-w-2xl px-4 pb-4 pt-4 sm:px-6 lg:max-w-7xl lg:px-14 lg:pt-8">
              {/* Product Name */}
              <motion.h1 className="pt-5 lg:pt-0 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl" variants={textMotion}>
                {product.name}
              </motion.h1>

              {/* Product Options */}
              <div className="mt-4">
                {/* Price */}
                <motion.div className="flex items-center space-x-4" variants={textMotion}>
                  <p className="text-2xl tracking-tight text-gray-900 sm:text-3xl">
                    ₹{Math.round(product.finalPrice)}
                  </p>
                  {product.originalPrice && (
                    <>
                      <p className="text-lg text-gray-500 line-through">
                        ₹{Math.round(product.originalPrice)}
                      </p>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </motion.div>

                {/* Stock Status */}
                <motion.div className="mt-4" variants={textMotion}>
                  <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </motion.div>

                {/* Category */}
                <motion.div className="mt-2" variants={textMotion}>
                  <p className="text-sm text-gray-600">
                    Category: <span className="font-medium">{product.category}</span>
                  </p>
                </motion.div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <motion.div className="mt-8" variants={textMotion}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Size</h3>
                      <p className="text-xs text-gray-500">All sizes available - select any size</p>
                    </div>

                    <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4">
                        {product.sizes.map((size) => (
                          <RadioGroup.Option
                            key={size.name}
                            value={size.name}
                            className={({ active, checked }) =>
                              classNames(
                                'cursor-pointer shadow-sm border focus:outline-none transition-all duration-200',
                                checked
                                  ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500'
                                  : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-indigo-400',
                                active && !checked ? 'ring-2 ring-indigo-500' : '',
                                'group relative flex items-center justify-center rounded-md py-3 px-4 text-sm font-medium uppercase sm:flex-1 sm:py-6'
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <RadioGroup.Label
                                  as="span"
                                  className={classNames(
                                    'font-semibold relative z-10',
                                    checked ? 'text-white' : 'text-gray-900'
                                  )}
                                >
                                  {size.name}
                                </RadioGroup.Label>
                                {/* Check mark for selected size */}
                                {checked && (
                                  <span className="absolute top-1 right-1 z-10">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}

                {/* Quantity Selection */}
                <motion.div className="mt-8" variants={textMotion}>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="block w-20 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                    className={`flex-1 flex items-center justify-center rounded-full border border-transparent py-3 px-6 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      product.stock === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : addingToCart
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    variants={textMotion}
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </motion.button>

                  {/* Favorite Button */}
                  <motion.button
                    onClick={handleToggleFavorite}
                    className="flex items-center justify-center rounded-full border border-gray-300 bg-white py-3 px-6 sm:px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:flex-shrink-0"
                    variants={textMotion}
                  >
                    {isFavorite ? (
                      <>
                        <HeartIconSolid className="h-6 w-6 text-red-500 sm:mr-0 mr-2" aria-hidden="true" />
                        <span className="sm:hidden">Remove from Favorites</span>
                      </>
                    ) : (
                      <>
                        <HeartIcon className="h-6 w-6 sm:mr-0 mr-2" aria-hidden="true" />
                        <span className="sm:hidden">Add to Favorites</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Product Description */}
              <div className="pt-10 lg:pb-16 lg:pr-8">
                <motion.h3 className="text-lg font-medium text-gray-900 mb-4" variants={textMotion}>
                  About this product
                </motion.h3>
                <motion.p className="text-base text-gray-700" variants={textMotion}>
                  {product.description || 'No description available for this product.'}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  );
};

export default DynamicProductOverview;
