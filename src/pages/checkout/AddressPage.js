import React, { useState, useEffect, Fragment } from 'react';
import { Footer, NavBar } from '../../components';
import { LocateFixed, Plus, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddressPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
    address_type: 'HOME'
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

  const addressVariants = {
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

  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const token = localStorage.getItem('userToken');

      console.log('Fetching addresses with token:', token ? 'Present' : 'Missing');

      const response = await axios.get('https://rachna-backend-1.onrender.com/api/user/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetch addresses response:', response.data);

      if (response.data.success) {
        setAddresses(response.data.addresses);
        if (response.data.addresses.length > 0 && !selectedAddress) {
          setSelectedAddress(response.data.addresses[0].id);
        }
      } else {
        setError(response.data.message || 'Failed to load addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Failed to load addresses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const nominatimURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      try {
        const response = await fetch(nominatimURL, {
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();

          // Parse the address components
          const addressParts = data.address || {};
          setNewAddress(prev => ({
            ...prev,
            address_line_1: `${addressParts.house_number || ''} ${addressParts.road || ''}`.trim(),
            address_line_2: `${addressParts.suburb || ''} ${addressParts.neighbourhood || ''}`.trim(),
            city: addressParts.city || addressParts.town || addressParts.village || '',
            state: addressParts.state || '',
            pincode: addressParts.postcode || ''
          }));
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("Failed to get address from location");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      alert("Failed to get current location");
      setLoading(false);
    });
  };

  const handleInputChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!newAddress.name || !newAddress.phone || !newAddress.address_line_1 ||
          !newAddress.city || !newAddress.state || !newAddress.pincode) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('userToken');

      // Prepare address data with proper field mapping
      const addressData = {
        ...newAddress,
        postal_code: newAddress.pincode, // Map pincode to postal_code for backend compatibility
        type: newAddress.address_type,   // Map address_type to type for backend compatibility
        country: 'India'                 // Set default country
      };

      console.log('Sending address data:', addressData);
      console.log('Token:', token ? 'Present' : 'Missing');

      const response = await axios.post('https://rachna-backend-1.onrender.com/api/user/addresses', addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Address save response:', response.data);

      if (response.data.success) {
        await fetchAddresses();
        setShowNewAddress(false);
        setNewAddress({
          name: user?.name || '',
          phone: user?.phone || '',
          address_line_1: '',
          address_line_2: '',
          city: '',
          state: '',
          pincode: '',
          address_type: 'HOME'
        });
        setError(''); // Clear any previous errors
      } else {
        setError(response.data.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Invalid address data');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Failed to save address');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.delete(`https://rachna-backend-1.onrender.com/api/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await fetchAddresses();
        if (selectedAddress === addressId) {
          setSelectedAddress(addresses.length > 1 ? addresses.find(a => a.id !== addressId)?.id : null);
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToOrderSummary = () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    // Store selected address in localStorage for order summary page
    const address = addresses.find(a => a.id === selectedAddress);
    localStorage.setItem('selectedAddress', JSON.stringify(address));

    // Navigate to order summary page
    navigate('/Rachna/order-summary');
  };

  // Redirect to login if not authenticated
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
              <p className="text-slate-600 mb-8 text-lg font-light">You need to be logged in to manage delivery addresses.</p>
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
        <div className="max-w-5xl mx-auto px-4">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-wide">
              Delivery Address
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto">
              Choose or add a delivery address for your order
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

              {/* Add New Address Button */}
              <div className="mb-8">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowNewAddress(!showNewAddress)}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 px-8 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-300/20 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNewAddress ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    <span>{showNewAddress ? 'Cancel' : 'Add New Address'}</span>
                  </div>
                </motion.button>
              </div>

              {/* New Address Form */}
              <AnimatePresence>
                {showNewAddress && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-slate-50/50 border border-slate-200 rounded-2xl p-8 mb-8 backdrop-blur-sm"
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-light text-slate-800">Add New Address</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newAddress.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="First Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="(000) 000-0000"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address Line 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address_line_1"
                          value={newAddress.address_line_1}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="House/Flat/Office No, Building Name"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="address_line_2"
                          value={newAddress.address_line_2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Area, Landmark (Optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter state"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                          placeholder="000000"
                          maxLength="6"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address Type
                        </label>
                        <select
                          name="address_type"
                          value={newAddress.address_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        >
                          <option value="HOME">Home</option>
                          <option value="OFFICE">Office</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Use Current Location Button */}
                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUseCurrentLocation}
                        disabled={loading}
                        className="flex items-center space-x-3 text-slate-600 hover:text-slate-800 font-medium transition-all duration-300 disabled:opacity-50 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
                      >
                        <LocateFixed className="w-5 h-5" />
                        <span>{loading ? 'Getting location...' : 'Use Current Location'}</span>
                      </motion.button>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleSaveAddress}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          'Save Address'
                        )}
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setShowNewAddress(false)}
                        className="flex-1 sm:flex-none bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-medium hover:bg-slate-300 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Existing Addresses */}
              <div className="space-y-6">
                <h3 className="text-lg font-light text-slate-800 mb-4">Saved Addresses</h3>
                <AnimatePresence>
                  {addresses.map((address) => (
                    <motion.div
                      key={address.id}
                      variants={addressVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`relative bg-white/70 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        selectedAddress === address.id
                          ? 'border-slate-400 shadow-lg ring-2 ring-slate-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <label className="flex items-start space-x-4 cursor-pointer">
                        <div className="relative mt-1">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={() => setSelectedAddress(address.id)}
                            className="w-5 h-5 text-slate-600 border-slate-300 focus:ring-slate-400 focus:ring-2"
                          />
                          {selectedAddress === address.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-3 h-3 bg-slate-600 rounded-full flex items-center justify-center"
                            >
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <p className="font-medium text-slate-800 text-lg">
                                  {address.name}
                                </p>
                                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                                  {address.type || address.address_type || 'HOME'}
                                </span>
                              </div>
                              <p className="text-slate-600 mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {address.phone}
                              </p>
                              <p className="text-slate-600 leading-relaxed flex items-start">
                                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>
                                  {address.address_line_1}
                                  {address.address_line_2 && `, ${address.address_line_2}`}
                                  <br />
                                  {address.city}, {address.state} - <strong>{address.postal_code || address.pincode}</strong>
                                </span>
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address.id);
                                }}
                                className="text-red-400 hover:text-red-600 transition-colors duration-300 p-2 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </label>

                      {selectedAddress === address.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-slate-200"
                        >
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleProceedToOrderSummary}
                            className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-4 rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <div className="flex items-center justify-center space-x-3">
                              <span>Continue to Order Summary</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {addresses.length === 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-lg font-light">No addresses found</p>
                    <p className="text-slate-400 text-sm mt-2">Please add a new address to continue</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default AddressPage;
