import React from "react";
import { NavBar, Footer } from "../../components";

const product = {
  name: "Nike Pegasus 41 shoes",
  tagline: "Run Strong. Run Beyond.",
  category: "Sports",
  price: 189,
  offerPrice: 159,
  rating: 4,
  images: [
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage2.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage4.png",
  ],
  description: [
    "High-quality engineered mesh for maximum breathability.",
    "Lightweight ReactX foam for ultimate cushioning and energy return.",
    "Flywire cables ensure a secure fit for every stride.",
    "Available in multiple sizes and striking colors.",
    "Perfect for daily runs, intense workouts, and urban adventures.",
  ],
  features: [
    {
      title: "Advanced Cushioning",
      desc: "ReactX foam midsole ensures a plush, responsive ride.",
      icon: (
        <svg width="26" height="26" fill="none" className="text-indigo-500"><circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="2" /><path d="M8 13l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ),
    },
    {
      title: "Breathable Mesh",
      desc: "Keeps feet cool and comfortable during every activity.",
      icon: (
        <svg width="26" height="26" fill="none" className="text-indigo-500"><circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="2" /><path d="M9 13a2 2 0 104 0 2 2 0 00-4 0zm7 0a2 2 0 104 0 2 2 0 00-4 0z" stroke="currentColor" strokeWidth="2" /></svg>
      ),
    },
    {
      title: "Secure Fit",
      desc: "Flywire technology locks your foot in for every run.",
      icon: (
        <svg width="26" height="26" fill="none" className="text-indigo-500"><circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="2" /><path d="M13 9v8m0-8l4 3m-4-3l-4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ),
    },
  ],
};




const ProductOverview = () => {
  const [thumbnail, setThumbnail] = React.useState(product.images[0]);

  // Responsive image aspect ratio
  const aspectWidth = 1;
  const aspectHeight = 1;

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-br from-blue-50/90 to-gray-50/95 min-h-screen flex flex-col">
        {/* Enhanced Hero Section with Full Height */}
        <section
          className="relative flex flex-col justify-center min-h-screen w-full overflow-hidden bg-gray-900"
          style={{
            background: `linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(49, 46, 129, 0.75), rgba(79, 70, 229, 0.6)), url(https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=cover&w=1920&q=80) center center/cover no-repeat fixed`
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating Particles Effect */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>

          <div className="container max-w-7xl mx-auto px-6 pt-20 pb-16 sm:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10">
            <div className="w-full md:w-4/6 text-white flex flex-col gap-6">
              {/* Enhanced Category Badge */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-200 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-indigo-300/30">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-300 font-medium">In Stock</span>
                </div>
              </div>

              {/* Enhanced Product Title */}
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-2xl bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
                {product.name}
              </h1>

              {/* Enhanced Tagline */}
              <p className="text-xl lg:text-2xl font-medium tracking-wide text-indigo-100/90 mb-6 leading-relaxed">
                {product.tagline}
              </p>

              {/* Enhanced Rating Section */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) =>
                    product.rating > i ? (
                      <svg key={i} width="24" height="24" viewBox="0 0 18 17" fill="currentColor" className="text-yellow-400 drop-shadow-lg">
                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" />
                      </svg>
                    ) : (
                      <svg key={i} width="24" height="24" viewBox="0 0 18 17" fill="currentColor" className="text-indigo-200/50">
                        <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" />
                      </svg>
                    )
                  )}
                </div>
                <span className="text-lg font-semibold text-white drop-shadow-lg">{product.rating}/5</span>
                <span className="text-sm text-indigo-200">• 2,847 reviews</span>
              </div>

              {/* Enhanced Price Display */}
              <div className="flex items-center gap-4 mt-6">
                <span className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">${product.offerPrice}</span>
                <span className="text-xl text-gray-300 line-through">${product.price}</span>
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                </span>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl py-4 px-8 rounded-xl font-bold text-lg text-white transform hover:scale-105 hover:shadow-indigo-500/25">
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Buy Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                </button>
                <button className="group relative bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    </svg>
                    Add to Cart
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm text-indigo-200">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free Shipping
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-200">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  30-Day Returns
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-200">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Checkout
                </div>
              </div>
            </div>
            
            {/* Enhanced Product Image Section */}
            <div className="hidden md:flex flex-col items-center w-2/6 gap-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm bg-white/10 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:rotate-1" style={{ width: 450, height: 450 }}>
                  <img
                    src={thumbnail}
                    alt="Main showcase product visual"
                    crossOrigin="anonymous"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    style={{ aspectRatio: `${aspectWidth} / ${aspectHeight}` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold tracking-wider backdrop-blur-sm">
                    Featured
                  </span>
                  <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Thumbnail Gallery */}
              <div className="flex gap-4 mt-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setThumbnail(img)}
                    className={`group relative rounded-2xl border-2 transition-all duration-300 bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl
                    ${thumbnail === img ? "border-indigo-400 ring-2 ring-indigo-300 scale-110" : "border-white/30 hover:border-indigo-400 hover:scale-105"}
                    focus:outline-none overflow-hidden`}
                    style={{ width: 90, height: 90 }}
                    aria-label={`Show alternate product image ${idx + 1}`}
                    type="button"
                  >
                    <img
                      src={img}
                      alt={`Product thumbnail ${idx + 1}`}
                      crossOrigin="anonymous"
                      className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    {thumbnail === img && (
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/50 to-transparent flex items-end justify-center pb-2">
                        <span className="text-white text-xs font-bold">Active</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        
        {/* Enhanced Breadcrumb Navigation */}
        <nav
          className="container mx-auto max-w-7xl px-6 mt-8 mb-4"
          aria-label="Breadcrumb"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <ol className="flex items-center space-x-3 text-sm">
              <li>
                <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200">Products</a>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="capitalize text-gray-700 font-medium">{product.category}</li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-indigo-700 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {product.name}
              </li>
            </ol>
          </div>
        </nav>

        

        <main className="container mx-auto max-w-7xl w-full px-4 md:px-6 py-12 flex-1">
          <div className="flex flex-col lg:flex-row gap-16">
            
            <aside className="w-full lg:max-w-md mb-8 lg:mb-0">
              
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative rounded-3xl overflow-hidden border-2 border-indigo-200 bg-white shadow-2xl flex items-center justify-center mb-6 min-h-[400px] group-hover:shadow-indigo-300/60 transition-all duration-500 hover:scale-105">
                  <img
                    src={thumbnail}
                    alt="Main product"
                    className="object-contain w-full h-full max-h-[450px] transition-transform duration-500 group-hover:scale-110 drop-shadow-lg"
                    style={{ aspectRatio: "1/1" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThumbnail(img)}
                    className={`group relative bg-gradient-to-br from-indigo-50 to-white border-2 transition-all duration-300 rounded-xl p-1 shadow-lg hover:shadow-xl transform hover:scale-105
              ${thumbnail === img ? "border-indigo-600 ring-2 ring-indigo-300 scale-110" : "border-gray-200 hover:border-indigo-400"}
            `}
                    style={{ width: 80, height: 80 }}
                    aria-label={`Show alternate image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Product thumbnail ${idx + 1}`}
                      crossOrigin="anonymous"
                      className="object-contain w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-110"
                    />
                    {thumbnail === img && (
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/30 to-transparent rounded-lg flex items-end justify-center pb-1">
                        <span className="text-indigo-700 text-xs font-bold">Active</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-lg px-4 py-2 text-emerald-700 font-semibold text-sm shadow-sm">
                  <span className="text-lg">🚚</span> <span>Free Shipping & Returns</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-lg px-4 py-2 text-indigo-700 font-semibold text-sm shadow-sm">
                  <span className="text-lg">✅</span> <span>100% Authentic Product</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-white border border-orange-200 rounded-lg px-4 py-2 text-orange-700 font-semibold text-sm shadow-sm">
                  <span className="text-lg">⏱</span> <span>Ships in 24 hours</span>
                </div>
              </div>
            </aside>
            
            <section className="flex-1 w-full max-w-xl px-0 sm:px-4">
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                {product.name}
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded shadow-sm ml-2 animate-pulse">New</span>
              </h2>
              <p className="uppercase text-xs tracking-widest text-indigo-400 font-bold mb-2">{product.category}</p>
              
              <div className="flex items-center gap-2 mb-3">
                
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="20"
                      height="20"
                      fill="currentColor"
                      className={i < product.rating ? "text-yellow-400 animate-bounce-slow" : "text-gray-300"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2l2.39 4.84L18 7.24l-3.8 3.7L15.3 17 10 14l-5.3 3 1.1-6.06L2 7.24l5.61-.4z" />
                    </svg>
                  ))}
                </div>
                <span className="text-base text-gray-700 font-semibold">{product.rating}/5</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 ml-3 rounded-md text-xs font-medium shadow">In Stock</span>
              </div>
              
              <div className="block lg:hidden mt-4 mb-5">
                <img
                  src={thumbnail}
                  alt="Product"
                  className="w-full max-w-xs mx-auto rounded-2xl border-2 border-indigo-200 bg-white object-cover shadow-lg"
                  style={{ aspectRatio: "1/1" }}
                  loading="lazy"
                />
              </div>
              
              <div className="mt-3 mb-3 flex items-center gap-4 text-2xl font-bold">
                <span className="text-indigo-700 drop-shadow">${product.offerPrice}</span>
                <span className="text-gray-400/70 text-lg line-through font-medium">${product.price}</span>
                <span className="text-emerald-600 ml-2 text-sm font-semibold bg-emerald-50 px-2 py-0.5 rounded shadow-sm">
                  {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                </span>
              </div>

              <div className="mb-6">
                <span className="inline-flex items-center px-2 py-0.5 bg-indigo-100 text-xs font-medium text-indigo-700 rounded shadow-sm">
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10.29 3.86l1.42-2.36 1.42 2.36C15.37 4.71 17 7.03 17 9.76c0 2.15-1.16 4.14-3 5.25C7.16 13.9 6 11.91 6 9.76c0-2.73 1.63-5.05 4.29-5.9z" strokeLinejoin="round" />
                  </svg>
                  24h Dispatch. Easy Returns.
                </span>
              </div>
              
              <section className="my-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span> Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/80 rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
                      <div aria-hidden="true" className="bg-indigo-50 rounded-full p-2 flex items-center justify-center shadow">
                        {feat.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{feat.title}</p>
                        <p className="text-gray-600 text-sm">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="mb-8">
                <h4 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span> About Product
                </h4>
                <ul className="list-disc ml-6 text-gray-700 space-y-1 text-base">
                  {product.description.map((desc, index) => (
                    <li key={index} className="pl-1">{desc}</li>
                  ))}
                </ul>
              </section>
              
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
                  <span className="bg-indigo-100 text-indigo-600 rounded-full p-1 text-base">🔒</span>
                  Secure checkout
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
                  <span className="bg-emerald-100 text-emerald-700 rounded-full p-1 text-base">💵</span>
                  30-day money-back guarantee
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
                  <span className="bg-orange-100 text-orange-700 rounded-full p-1 text-base">📦</span>
                  Free doorstep delivery
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2 shadow-sm">
                  <span className="bg-green-100 text-green-700 rounded-full p-1 text-base">🌱</span>
                  Sustainable materials
                </div>
              </div>
              
              <div className="flex gap-4 mt-6 font-semibold">
                <button className="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-200 to-indigo-500 hover:from-indigo-400 hover:to-indigo-700 hover:text-white text-indigo-900 border border-indigo-100 shadow-lg transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
                  Add to Cart
                </button>
                <button className="flex-1 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-indigo-600 text-white hover:from-emerald-500 hover:to-indigo-700 shadow-xl transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                  Buy Now
                </button>
              </div>
            </section>
          </div>
        </main>


      </div>
      <Footer />
    </>
  );
};

export default ProductOverview;
