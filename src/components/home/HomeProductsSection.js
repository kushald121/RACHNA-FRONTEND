import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiFilter, FiX, FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { addToCart, addToFavorites, removeFromFavorites, isInFavorites } from "../../utils/cartUtils";
import axios from "axios";

const HomeProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    maxPrice: 5000,
    gender: [],
  });
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const { user, getCurrentSessionId, getSessionType, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlistedProducts();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://rachna-backend-1.onrender.com/api/fetch/");

      if (!response.data.success || !response.data.products || response.data.products.length === 0) {
        setProducts([]);
        setFilteredProducts([]);
        return;
      }
      
      // Transform the data and limit to 9 products for home page
      const transformedProducts = response.data.products.slice(0, 9).map(product => {
        const discountValue = parseFloat(product.discount);
        const currentPrice = parseFloat(product.price);

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: currentPrice,
          currentPrice: currentPrice,
          originalPrice: discountValue > 0 ?
            currentPrice / (1 - discountValue / 100) :
            null,
          category: product.category,
          gender: product.gender,
          image: product.image ?
            (product.image.startsWith('http') ?
              product.image :
              `http://localhost:5000/public${product.image}`) :
            'https://via.placeholder.com/300',
          rating: 4.5,
          stock: product.stock,
          sizes: product.sizes
        };
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishlistedProducts = async () => {
    try {
      const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
      const result = await isInFavorites(null, authContext);
      
      if (result.success && result.favorites) {
        const wishlistedSet = new Set(result.favorites.map(fav => fav.productId || fav.product_id));
        setWishlistedIds(wishlistedSet);
      }
    } catch (error) {
      console.error('Error fetching wishlisted products:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Filter by gender
    if (filters.gender.length > 0) {
      filtered = filtered.filter(product => 
        filters.gender.includes(product.gender)
      );
    }

    // Filter by price
    filtered = filtered.filter(product => product.price <= filters.maxPrice);

    setFilteredProducts(filtered);
  };

  const toggleWishlist = async (productId) => {
    try {
      const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
      
      if (wishlistedIds.has(productId)) {
        const result = await removeFromFavorites(productId, authContext);
        if (result.success) {
          setWishlistedIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        }
      } else {
        const result = await addToFavorites(productId, authContext);
        if (result.success) {
          setWishlistedIds(prev => new Set([...prev, productId]));
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const uniqueCategories = [...new Set(products.map(product => product.category))];
  const uniqueGenders = [...new Set(products.map(product => product.gender))];

  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleGender = (gender) => {
    setFilters(prev => ({
      ...prev,
      gender: prev.gender.includes(gender)
        ? prev.gender.filter(g => g !== gender)
        : [...prev.gender, gender]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      maxPrice: 5000,
      gender: [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-gray-900">Our</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Products
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium clothing
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {uniqueCategories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Gender</h4>
                <div className="space-y-2">
                  {uniqueGenders.map(gender => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.gender.includes(gender)}
                        onChange={() => toggleGender(gender)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Max Price</h4>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹{filters.maxPrice}</span>
                  <span>₹10,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <Link
                to="/Rachna/allproducts"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View All Products →
              </Link>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistedIds.has(product.id)}
                  onToggleWishlist={toggleWishlist}
                  authContext={{ getCurrentSessionId, getSessionType, getAuthHeaders }}
                />
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Product Card Component
function ProductCard({ product, isWishlisted, onToggleWishlist, authContext }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, {
    once: true,
    margin: "-100px 0px -100px 0px"
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(product.id, 1, authContext);
      if (result.success) {
        // Refresh navbar counts
        if (window.refreshNavbarCounts) {
          window.refreshNavbarCounts();
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={() => navigate(`/Rachna/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          crossOrigin="anonymous"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/E5E7EB/9CA3AF?text=Image+Error';
          }}
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <FiHeart
            className={`w-4 h-4 ${
              isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/Rachna/product/${product.id}`);
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <FiEye className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="p-2 bg-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <FiShoppingCart className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {product.originalPrice && (
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default HomeProductsSection;
