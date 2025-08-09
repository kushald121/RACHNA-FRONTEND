import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiFilter, FiX, FiHeart, FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSearch } from "../../contexts/SearchContext";
import { addToCart, addToFavorites, removeFromFavorites, isInFavorites } from "../../utils/cartUtils";
import axios from "axios";

const ProductsContent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    maxPrice: 2000,
    sortBy: "relevance",
  });
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PRODUCTS_PER_PAGE = 9;

  const { user, getCurrentSessionId, getSessionType, getAuthHeaders } = useAuth();
  const { searchQuery } = useSearch();

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
  }, [products, filters, searchQuery]);

  // Update displayed products when filtered products change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedProducts(filteredProducts.slice(0, PRODUCTS_PER_PAGE));
  }, [filteredProducts]);

  // Load more products function
  const loadMoreProducts = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const newProducts = filteredProducts.slice(startIndex, endIndex);

    setTimeout(() => {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500); // Simulate loading delay
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedProducts.length < filteredProducts.length) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [displayedProducts, filteredProducts, isLoadingMore]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("https://rachna-backend-1.onrender.com/api/fetch/");

      if (!response.data.success || !response.data.products || response.data.products.length === 0) {
        setProducts([]);
        setFilteredProducts([]);
        return;
      }
      
      // Transform the data
      const transformedProducts = response.data.products.map(product => {
        const discountValue = parseFloat(product.discount);
        const currentPrice = parseFloat(product.price);



        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: currentPrice, // This is the actual selling price (already discounted)
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
    if (products.length === 0) return;

    let filtered = [...products];

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const productName = product.name ? product.name.toLowerCase() : '';
        const productDescription = product.description ? product.description.toLowerCase() : '';
        const productCategory = product.category ? product.category.toLowerCase() : '';
        const productGender = product.gender ? product.gender.toLowerCase() : '';

        return (
          productName.includes(searchTerm) ||
          productDescription.includes(searchTerm) ||
          productCategory.includes(searchTerm) ||
          productGender.includes(searchTerm)
        );
      });
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.some(category =>
          product.category?.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by price
    filtered = filtered.filter(product => product.price <= filters.maxPrice);

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  };



  const clearFilters = () => {
    setFilters({
      categories: [],
      maxPrice: 2000,
      sortBy: "relevance",
    });
  };

  const toggleWishlist = async (productId) => {
    try {
      const authContext = { getCurrentSessionId, getSessionType, getAuthHeaders };
      const isCurrentlyWishlisted = wishlistedIds.has(productId);

      if (isCurrentlyWishlisted) {
        const result = await removeFromFavorites(productId, authContext);
        if (result.success) {
          setWishlistedIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          // Refresh navbar counts
          if (window.refreshNavbarCounts) {
            window.refreshNavbarCounts();
          }
        }
      } else {
        const result = await addToFavorites(productId, authContext);
        if (result.success) {
          setWishlistedIds(prev => {
            const newSet = new Set(prev);
            newSet.add(productId);
            return newSet;
          });
          // Refresh navbar counts
          if (window.refreshNavbarCounts) {
            window.refreshNavbarCounts();
          }
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const removeFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value),
    }));
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  // Get unique categories for filters
  const uniqueCategories = [...new Set(products.map(product => product.category))];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <main className="container mx-auto py-10 md:py-16 px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <FiltersSidebar
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            filters={filters}
            setFilters={setFilters}
            uniqueCategories={uniqueCategories}
          />
          <section className="w-full">
            <PageHeader
              productCount={filteredProducts.length}
              filters={filters}
              setFilters={setFilters}
              searchQuery={searchQuery}
            />
            <ActiveFilters filters={filters} onRemove={removeFilter} searchQuery={searchQuery} />
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-rose-100 via-indigo-100 to-zinc-100 border border-zinc-300 rounded-lg shadow text-base font-medium text-zinc-700 hover:bg-white transition-colors w-full mb-7"
            >
              <FiFilter size={18} /> Show Filters
            </button>

            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {displayedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      custom={index}
                      variants={{
                        hidden: { opacity: 0, y: 50, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            delay: index * 0.1,
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          },
                        },
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      <ProductCard
                        product={product}
                        isWishlisted={wishlistedIds.has(product.id)}
                        onToggleWishlist={() => toggleWishlist(product.id)}
                        authContext={{
                          getCurrentSessionId,
                          getSessionType,
                          getAuthHeaders,
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More Trigger */}
            {displayedProducts.length < filteredProducts.length && (
              <div id="load-more-trigger" className="w-full h-20 flex items-center justify-center mt-8">
                {isLoadingMore && (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="text-gray-600">Loading more products...</span>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Hero Banner Component
function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Discover Your Style
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 opacity-90"
        >
          Premium clothing for every occasion
        </motion.p>
      </div>
    </section>
  );
}

// OLD Filter Sidebar Component (UNUSED)
function OldFilterSidebar({ filters, setFilters, uniqueCategories, toggleCategory, clearFilters }) {
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    kids: false,
    shopByPrice: true,
    saleOffers: false,
    colour: false,
    brand: false,
    collections: false,
    width: false,
    sports: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white sticky top-6">
      {/* Gender Filter */}
      <FilterSection
        title="Gender"
        isExpanded={expandedSections.gender}
        onToggle={() => toggleSection('gender')}
      >
        {['Men', 'Women', 'Unisex'].map(gender => (
          <label key={gender} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">{gender}</span>
          </label>
        ))}
      </FilterSection>

      {/* Kids Filter */}
      <FilterSection
        title="Kids"
        isExpanded={expandedSections.kids}
        onToggle={() => toggleSection('kids')}
      >
        {['Boys', 'Girls'].map(kid => (
          <label key={kid} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">{kid}</span>
          </label>
        ))}
      </FilterSection>

      {/* Shop By Price */}
      <FilterSection
        title="Shop By Price"
        isExpanded={expandedSections.shopByPrice}
        onToggle={() => toggleSection('shopByPrice')}
      >
        {['Under ₹ 2 500.00', '₹ 2 500.00 - ₹ 7 500.00', '₹ 7 500.00 - ₹ 12 500.00', 'Over ₹ 12 500.00'].map(price => (
          <label key={price} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">{price}</span>
          </label>
        ))}
      </FilterSection>

      {/* Sale & Offers */}
      <FilterSection
        title="Sale & Offers"
        isExpanded={expandedSections.saleOffers}
        onToggle={() => toggleSection('saleOffers')}
      >
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="ml-2 text-sm text-gray-700">Sale</span>
        </label>
      </FilterSection>

      {/* Colour */}
      <FilterSection
        title="Colour"
        isExpanded={expandedSections.colour}
        onToggle={() => toggleSection('colour')}
      >
        {['Black', 'White', 'Blue', 'Red', 'Green'].map(color => (
          <label key={color} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">{color}</span>
          </label>
        ))}
      </FilterSection>

      {/* Brand */}
      <FilterSection
        title="Brand"
        isExpanded={expandedSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        {uniqueCategories.map(category => (
          <label key={category} className="flex items-center">
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={() => toggleCategory(category)}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">{category}</span>
          </label>
        ))}
      </FilterSection>

      {/* Collections */}
      <FilterSection
        title="Collections (1)"
        isExpanded={expandedSections.collections}
        onToggle={() => toggleSection('collections')}
      >
        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="ml-2 text-sm text-gray-700">Basketball</span>
        </label>
      </FilterSection>

      {/* Width */}
      <FilterSection
        title="Width"
        isExpanded={expandedSections.width}
        onToggle={() => toggleSection('width')}
      >
        {['Regular', 'Wide'].map(width => (
          <label key={width} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">{width}</span>
          </label>
        ))}
      </FilterSection>

      {/* Sports */}
      <FilterSection
        title="Sports"
        isExpanded={expandedSections.sports}
        onToggle={() => toggleSection('sports')}
      >
        {['Basketball', 'Running', 'Training', 'Lifestyle'].map(sport => (
          <label key={sport} className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">{sport}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );
}

// OLD Mobile Filter Modal Component (UNUSED)
function OldMobileFilterModal({ isOpen, onClose, filters, setFilters, uniqueCategories, toggleCategory, clearFilters }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-40 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <FiltersSidebar
                isOpen={false}
                onClose={() => {}}
                filters={filters}
                setFilters={setFilters}
                uniqueCategories={uniqueCategories}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



// Product Card Component
function ProductCard({ product, isWishlisted, onToggleWishlist, authContext }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, {
    once: true,
    margin: "-100px 0px -100px 0px"
  });

  const discount = product.discount || 0;

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
      className="bg-white rounded-2xl flex flex-col overflow-hidden group relative border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200 h-full"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Wishlist Button */}
      <motion.button
        aria-label="Toggle Wishlist"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200
                   transition-all duration-200 ease-in-out hover:shadow-xl
                   ${
                     isWishlisted
                       ? "text-red-500 border-red-200 bg-red-50"
                       : "text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                   }`}
      >
        <motion.div
          animate={isWishlisted ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isWishlisted ? <FaHeart size={18} /> : <FiHeart size={18} />}
        </motion.div>
      </motion.button>

      {/* Image Area */}
      <motion.div
        className="relative w-full aspect-square overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => navigate(`/Rachna/product/${product.id}`)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <img
          key={`product-image-${product.id}`}
          src={product.image}
          alt={product.name}
          crossOrigin="anonymous"
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/E5E7EB/9CA3AF?text=Image+Error';
          }}
        />

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
            {discount}% OFF
          </span>
        )}

        <motion.div
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial="hidden"
          whileHover="visible"
        />
      </motion.div>

      {/* Details & Call-to-Action Area */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.gender}
          </p>
          <h3 className="font-semibold text-gray-800 text-base leading-tight mb-2 line-clamp-2 h-12 overflow-hidden">
            {product.name}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mt-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-medium text-white bg-green-500 px-2 py-0.5 rounded">
                  Best Price
                </span>
              )}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          style={{
            background: 'linear-gradient(to right, #9333ea, #7c3aed)',
            color: 'white'
          }}
          className="w-full mt-4 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2"
        >
          <FiShoppingCart className="w-4 h-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

// --- PAGE HEADER ---
function PageHeader({ productCount, filters, setFilters, searchQuery }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {searchQuery ? `Search Results` : "All Products"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {searchQuery
              ? `Found ${productCount} product${productCount !== 1 ? "s" : ""} for "${searchQuery}"`
              : `Showing ${productCount} product${productCount !== 1 ? "s" : ""}`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
            }
            value={filters.sortBy}
            className="w-full md:w-48 p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white shadow-sm transition-colors"
            style={{
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#9333ea';
              e.target.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// --- ACTIVE FILTERS ---
function ActiveFilters({ filters, onRemove, searchQuery }) {
  const activeFilters = [
    ...filters.categories.map((c) => ({ type: "categories", value: c })),
  ];

  if (activeFilters.length === 0 && !searchQuery) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center flex-wrap gap-2">
        {searchQuery && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            <span>Search: "{searchQuery}"</span>
            <button
              onClick={() => window.location.href = '/Rachna/allproducts/'}
              className="text-blue-600 hover:text-blue-800"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        )}
        {activeFilters.map(({ type, value }) => (
          <motion.div
            key={value}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            <span>{value}</span>
            <button
              onClick={() => onRemove(type, value)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- FILTERS SIDEBAR ---
function FiltersSidebar({ isOpen, onClose, filters, setFilters, uniqueCategories }) {
  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const currentValues = prev[type] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: newValues };
    });
  };

  const sidebarContent = (
    <div className="p-6 h-full overflow-y-auto bg-white">
      <div className="flex justify-between items-center pb-4 mb-2 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">
          Filters
        </h3>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="space-y-1 divide-y divide-gray-200">
        <FilterSection
          title="Category"
          items={uniqueCategories}
          selectedItems={filters.categories}
          onChange={(v) => handleFilterChange("categories", v)}
        />
        <div className="py-5">
          <label
            htmlFor="price"
            className="font-semibold text-gray-800 mb-4 block"
          >
            Max Price
          </label>
          <input
            type="range"
            id="price"
            min="0"
            max="2000"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value) }))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>₹0</span>
            <span>₹{filters.maxPrice}</span>
            <span>₹2000</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-80 h-full bg-white z-40 lg:hidden shadow-xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// --- FILTER SECTION ---
function FilterSection({ title, items, selectedItems, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="py-5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full text-left"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <label key={item} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onChange={() => onChange(item)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">{item}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductsContent;
