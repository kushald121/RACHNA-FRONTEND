import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Package, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

// Add CSS animations
const orderPageStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = orderPageStyles;
  document.head.appendChild(styleSheet);
}

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const { user, getAuthHeaders } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    // Filter orders based on search term
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(product => 
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://rachna-backend-1.onrender.com/api/orders/my-orders', {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        console.log('Orders fetched successfully:', response.data.orders);
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'processing':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100 border-indigo-200';
      case 'delivered':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'refund completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'replacement completed':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageLoad = (orderId, productIndex) => {
    console.log(`Image loaded successfully for order ${orderId}, product ${productIndex}`);
    setImageLoadingStates(prev => ({
      ...prev,
      [`${orderId}-${productIndex}`]: false
    }));
  };

  const handleImageError = (orderId, productIndex) => {
    console.log(`Image failed to load for order ${orderId}, product ${productIndex}`);
    setImageLoadingStates(prev => ({
      ...prev,
      [`${orderId}-${productIndex}`]: false
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-80 animate-pulse"></div>
          </div>
          
          {/* Order Cards Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your orders here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="absolute inset-y-0 right-0 px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Search Orders
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ? 'No orders match your search criteria. Try adjusting your search terms.' : 'You haven\'t placed any orders yet. Start shopping to see your order history here!'}
            </p>
            {!searchTerm && (
              <Link to="/Rachna/allproducts" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-block">
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
                            <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Product Images Gallery */}
                      <div className="flex-shrink-0">
                        <div className="flex space-x-2">
                          {order.products && order.products.slice(0, 3).map((product, index) => (
                            <div key={index} className="relative">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                                {product.image ? (
                                  <>
                                    {/* Loading skeleton */}
                                    {imageLoadingStates[`${order.id}-${index}`] !== false && (
                                      <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
                                    )}
                                    <img
                                      src={product.image}
                                      alt={product.productName}
                                      crossOrigin="anonymous"
                                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                                        imageLoadingStates[`${order.id}-${index}`] !== false ? 'hidden' : 'block'
                                      }`}
                                      onLoad={() => handleImageLoad(order.id, index)}
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/64x64/E5E7EB/9CA3AF?text=?';
                                        handleImageError(order.id, index);
                                      }}
                                    />
                                  </>
                                ) : null}
                                <div 
                                  className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center ${
                                    product.image && imageLoadingStates[`${order.id}-${index}`] !== false ? 'hidden' : 'flex'
                                  }`}
                                >
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              </div>
                              {index === 2 && order.products.length > 3 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">+{order.products.length - 3}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {order.products && order.products.length === 0 && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Order Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {order.products && order.products.length > 0 ? order.products[0].productName : 'Order Items'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {order.products && order.products.length > 1
                            ? `${order.products[0].productName} and ${order.products.length - 1} more item${order.products.length > 2 ? 's' : ''}`
                            : order.products?.[0]?.productName || 'Order details'
                          }
                        </p>
                        <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border shadow-sm ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status?.toLowerCase() === 'delivered' ? 'Order Completed' : order.status}</span>
                      </span>
                      <p className="text-sm text-gray-500">Ordered on {formatDate(order.orderedAt)}</p>
                      <p className="text-xs text-gray-400">Order #{order.orderNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  {order.status?.toLowerCase() === 'delivered' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Your order has been completed and delivered successfully
                      </p>
                    </div>
                  )}

                  {order.status === 'cancelled' && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <XCircle className="w-4 h-4 inline mr-2" />
                        You requested a cancellation because you needed an earlier delivery date.
                      </p>
                    </div>
                  )}

                  {order.status === 'refund completed' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 font-medium">Refund Completed</p>
                      <p className="text-sm text-green-700">
                        The money was sent to your UPI linked bank account on {formatDate(order.orderedAt)}.
                        For any questions, please contact your bank with reference number 516400051599.
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        For any questions, please contact your bank with reference number 516400051599.
                      </p>
                    </div>
                  )}

                  {order.status === 'replacement completed' && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800 font-medium">Replacement Completed</p>
                      <p className="text-sm text-blue-700">
                        We have resent this product. Due to shipment-related issues, we could not deliver this product via the original order. Please track the new order from My Orders.
                      </p>
                    </div>
                  )}

                  {/* Detailed Product List */}
                  {order.products && order.products.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.products.map((product, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-md border border-gray-200 group-hover:shadow-lg transition-all duration-300">
                                {product.image ? (
                                  <>
                                    {/* Loading skeleton */}
                                    {imageLoadingStates[`${order.id}-detail-${index}`] !== false && (
                                      <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl" />
                                    )}
                                    <img
                                      src={product.image}
                                      alt={product.productName}
                                      crossOrigin="anonymous"
                                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                                        imageLoadingStates[`${order.id}-detail-${index}`] !== false ? 'hidden' : 'block'
                                      }`}
                                      onLoad={() => handleImageLoad(order.id, `detail-${index}`)}
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/80x80/E5E7EB/9CA3AF?text=?';
                                        handleImageError(order.id, `detail-${index}`);
                                      }}
                                    />
                                  </>
                                ) : null}
                                <div 
                                  className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ${
                                    product.image && imageLoadingStates[`${order.id}-detail-${index}`] !== false ? 'hidden' : 'flex'
                                  }`}
                                >
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-semibold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                {product.productName}
                              </h5>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                    <span className="font-semibold">Qty:</span> {product.quantity}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Item #{index + 1}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-gray-900">
                                    ₹{product.price}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Total: ₹{(product.price * product.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} • Payment Status: <span className="font-medium capitalize">{order.paymentStatus}</span>
                    </div>
                    <div className="flex space-x-3">
                      {order.status?.toLowerCase() === 'delivered' && (
                        <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                          <Star className="w-4 h-4 mr-1" />
                          Rate & Review Product
                        </button>
                      )}
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
