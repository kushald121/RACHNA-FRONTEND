import React, { useState, useEffect, useRef } from "react";
import { NavBar, Footer } from "../../components";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiFilter, FiX, FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSearch } from "../../contexts/SearchContext";
import {
  addToCart,
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
} from "../../utils/cartUtils";
import axios from "axios";

// --- MAIN PRODUCTS PAGE COMPONENT ---
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    maxPrice: 2000,
    sortBy: "relevance",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PRODUCTS_PER_PAGE = 9;
  const { getCurrentSessionId, getSessionType, getAuthHeaders } = useAuth();
  const { searchQuery, clearSearch } = useSearch();

  // Fetch products from PostgreSQL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get("https://rachna-backend-1.onrender.com/api/fetch");



        if (
          !response.data.success ||
          !response.data.products ||
          response.data.products.length === 0
        ) {
          console.log('No products found or API error');
          setProducts([]);
          setFilteredProducts([]);
          return;
        }

        // Transform the data
        const transformedProducts = response.data.products.map((product) => {
          const discountValue = parseFloat(product.discount);
          const currentPrice = parseFloat(product.price);



          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: currentPrice, // This is the actual selling price (already discounted)
            currentPrice: currentPrice, // Add this for filtering
            originalPrice:
              discountValue > 0
                ? currentPrice / (1 - discountValue / 100)
                : null, // Calculate what the original price was before discount
            category: product.category,
            gender: product.gender,
            image: product.image
              ? product.image.startsWith("http")
                ? product.image
                : `http://localhost:5000/public${product.image}`
              : "https://via.placeholder.com/300",
            rating: 4.5,
            stock: product.stock,
            sizes: product.sizes,
          };
        });

        // Remove duplicates (same product with multiple images - keep first one)
        const uniqueProducts = transformedProducts.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
        );

        setProducts(uniqueProducts);
        setFilteredProducts(uniqueProducts);
      } catch (error) {
        setError(`Failed to load products: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
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
      filtered = filtered.filter((product) => {
        if (!product.category) return false;
        return filters.categories.some(
          (selectedCategory) =>
            product.category
              .toLowerCase()
              .includes(selectedCategory.toLowerCase()) ||
            selectedCategory
              .toLowerCase()
              .includes(product.category.toLowerCase())
        );
      });
    }

    // Filter by price
    filtered = filtered.filter(
      (product) => product.currentPrice <= filters.maxPrice
    );

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

    const loadMoreTrigger = document.getElementById('load-more-trigger-all-products');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [displayedProducts, filteredProducts, isLoadingMore]);

  const toggleWishlist = async (productId) => {
    try {
      const authContext = {
        getCurrentSessionId,
        getSessionType,
        getAuthHeaders,
      };
      const isCurrentlyFavorite = wishlistedIds.has(productId);

      if (isCurrentlyFavorite) {
        const result = await removeFromFavorites(productId, authContext);
        if (result.success) {
          setWishlistedIds((prevIds) => {
            const newIds = new Set(prevIds);
            newIds.delete(productId);
            return newIds;
          });
          // Refresh navbar counts
          if (window.refreshNavbarCounts) {
            window.refreshNavbarCounts();
          }
        }
      } else {
        const result = await addToFavorites(productId, authContext);
        if (result.success) {
          setWishlistedIds((prevIds) => {
            const newIds = new Set(prevIds);
            newIds.add(productId);
            return newIds;
          });
          // Refresh navbar counts
          if (window.refreshNavbarCounts) {
            window.refreshNavbarCounts();
          }
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const removeFilter = (type, value) => {
    if (type === 'search') {
      // Clear search query
      clearSearch();
    } else {
      setFilters((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
    }
  };

  // Get all unique categories from products
  const allCategories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // Define preferred categories, but also include any other categories found
  const preferredCategories = ["T-shirt", "Jacket", "Hoodies"];
  const uniqueCategories = [
    ...preferredCategories.filter((cat) =>
      allCategories.some((prodCat) =>
        prodCat.toLowerCase().includes(cat.toLowerCase())
      )
    ),
    ...allCategories.filter(
      (cat) =>
        !preferredCategories.some((prefCat) =>
          cat.toLowerCase().includes(prefCat.toLowerCase())
        )
    ),
  ];

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />
      <main className="container mx-auto py-6 md:py-10 px-2 sm:px-4">
        <HeroBanner searchQuery={searchQuery} productCount={filteredProducts.length} />
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-12 items-start">
          <FiltersSidebar
            isOpen={isFilterOpen}
            onClose={() => setFilterOpen(false)}
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
          onClick={() => setFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 py-3 px-5 bg-white border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 w-full mb-6"
        >
          <FiFilter size={18} /> Show Filters
        </button>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? `No products found for "${searchQuery}"` : "No products available"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? "Try adjusting your search terms or browse our complete collection"
                      : "Please check back later for new products"
                    }
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => window.location.href = '/Rachna/allproducts/'}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View All Products
                    </button>
                  )}
                </div>
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

            {/* Load More Trigger */}
            {displayedProducts.length < filteredProducts.length && (
              <div id="load-more-trigger-all-products" className="w-full h-20 flex items-center justify-center mt-8">
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
      <Footer />
    </div>
  );
};

// --- HERO BANNER ---
function HeroBanner({ searchQuery, productCount }) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
      </h1>
      <p className="text-base text-gray-600 max-w-2xl mx-auto">
        {searchQuery 
          ? `Found ${productCount} product${productCount !== 1 ? 's' : ''} matching your search`
          : "Discover our complete collection of premium products"
        }
      </p>
    </div>
  );
}

// --- MODIFIED FILTERS SIDEBAR ---
function FiltersSidebar({
  isOpen,
  onClose,
  filters,
  setFilters,
  uniqueCategories,
}) {
  const handleFilterChange = (type, value) =>
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((i) => i !== value)
        : [...prev[type], value],
    }));

  const clearFilters = () =>
    setFilters({
      categories: [],
      maxPrice: 2000,
      sortBy: "relevance",
    });

  const FilterSection = ({ title, items, selectedItems, onChange }) => (
    <div className="py-5 border-b border-gray-200">
      <h4 className="font-semibold text-gray-700 mb-4 tracking-wide uppercase text-xs">
        {title}
      </h4>
      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center cursor-pointer group hover:bg-gray-50 p-2 rounded transition-colors"
          >
                         <input
               type="checkbox"
               onChange={() => onChange(item)}
               checked={selectedItems.includes(item)}
               style={{
                 accentColor: '#9333ea'
               }}
               className="h-4 w-4 rounded border-gray-400 focus:ring-purple-500"
             />
            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

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
               setFilters((p) => ({ ...p, maxPrice: Number(e.target.value) }))
             }
             style={{
               accentColor: '#9333ea'
             }}
             className="w-full mt-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
           />
          <div className="text-center text-gray-600 mt-2 text-sm">
            Up to ₹{filters.maxPrice.toLocaleString("en-IN")}
          </div>
        </div>
                 <div className="pt-4">
           <button
             onClick={clearFilters}
             style={{
               background: 'linear-gradient(to right, #9333ea, #7c3aed)',
               color: 'white'
             }}
             className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
             onMouseEnter={(e) => {
               e.target.style.background = 'linear-gradient(to right, #7c3aed, #6d28d9)';
             }}
             onMouseLeave={(e) => {
               e.target.style.background = 'linear-gradient(to right, #9333ea, #7c3aed)';
             }}
           >
             Clear All Filters
           </button>
         </div>
      </div>
    </div>
  );

  return (
    <>
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
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ ease: "easeInOut", duration: 0.4 }}
              className="fixed top-0 left-0 w-80 h-full bg-white z-40 lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <aside className="hidden lg:block w-72 xl:w-80 rounded-xl lg:sticky top-28 h-max border border-gray-200 bg-white shadow-lg">
        {sidebarContent}
      </aside>
    </>
  );
}

// --- PRODUCT CARD (unchanged) ---
// Enhanced animation variants for product cards
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotateY: 2,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};



const overlayVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    y: -2,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

function ProductCard({ product, isWishlisted, onToggleWishlist, authContext }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, {
    once: true,
    margin: "-100px 0px -100px 0px",
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
        // Show success message or update cart count
        // Item added successfully
        // Refresh navbar counts
        if (window.refreshNavbarCounts) {
          window.refreshNavbarCounts();
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      layout
      className="bg-white rounded-2xl flex flex-col overflow-hidden group relative border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200 h-full"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Wishlist Button */}
      <motion.button
        aria-label="Toggle Wishlist"
        onClick={() => onToggleWishlist(product.id)}
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
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
            {discount}% OFF
          </span>
        )}

        <motion.div
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          variants={overlayVariants}
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
                <span className="text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded">
                  Best Price
                </span>
              )}
            </div>
          </div>
        </div>
                 <motion.button
           variants={buttonVariants}
           whileHover="hover"
           whileTap="tap"
           onClick={handleAddToCart}
           style={{
             background: 'linear-gradient(to right, #9333ea, #7c3aed)',
             color: 'white'
           }}
           className="w-full mt-4 py-2.5 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2"
           onMouseEnter={(e) => {
             e.target.style.background = 'linear-gradient(to right, #7c3aed, #6d28d9)';
           }}
           onMouseLeave={(e) => {
             e.target.style.background = 'linear-gradient(to right, #9333ea, #7c3aed)';
           }}
         >
           <FiShoppingCart size={16} />
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
  
  // Add search query as an active filter if present
  if (searchQuery) {
    activeFilters.unshift({ type: "search", value: searchQuery });
  }
  
  if (activeFilters.length === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">
          Active Filters:
        </span>
        {activeFilters.map(({ type, value }) => (
          <motion.div
            key={`${type}-${value}`}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <span 
              className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium"
              style={{
                backgroundColor: type === 'search' ? '#dbeafe' : '#f3e8ff',
                color: type === 'search' ? '#1e40af' : '#6b21a8',
                border: type === 'search' ? '1px solid #93c5fd' : '1px solid #c084fc'
              }}
            >
              {type === 'search' ? `Search: "${value}"` : value}
              <button
                onClick={() => onRemove(type, value)}
                className="group -mr-1 h-3.5 w-3.5 rounded-full"
                style={{
                  color: type === 'search' ? '#3b82f6' : '#9333ea'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = type === 'search' ? '#bfdbfe' : '#e9d5ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;