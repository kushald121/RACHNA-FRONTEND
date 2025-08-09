import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  SparklesIcon,
  SwatchIcon,
  PaintBrushIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { NavBar, Footer } from '../../components';

const AboutUs = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <NavBar />
      
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 lg:py-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">RACHNA</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Where Fashion Meets Innovation - Crafting Tomorrow's Trends Today
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Brand Story Section */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          variants={itemVariants}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Story</span>
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-900">RACHNA</strong> is more than just a fashion brand – we're a creative revolution that bridges the gap between contemporary style and personalized expression. Founded with a vision to democratize fashion, we specialize in curating the latest trends while offering bespoke customization services.
              </p>
              <p>
                Our journey began with a simple belief: everyone deserves to wear their personality. From trendy ready-to-wear collections to custom-printed t-shirts, jackets, and hoodies, we transform fashion into a canvas for self-expression.
              </p>
              <p>
                At RACHNA, we don't just follow trends – we create them. Our team of passionate designers and fashion enthusiasts work tirelessly to bring you pieces that are not only stylish but also meaningful, sustainable, and uniquely yours.
              </p>
            </div>
          </div>
          
          <motion.div 
            className="relative"
            variants={cardVariants}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <SparklesIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Latest Trends</h3>
                  <p className="text-sm text-gray-600 mt-2">Cutting-edge fashion that defines tomorrow</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <PaintBrushIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Custom Prints</h3>
                  <p className="text-sm text-gray-600 mt-2">Personalized designs on premium apparel</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Section */}
        <motion.div 
          className="mb-20"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Offer</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <ShoppingBagIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready-to-Wear Collection</h3>
              <p className="text-gray-600">
                Discover our curated selection of the latest fashion trends, from casual wear to statement pieces that define contemporary style.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <PaintBrushIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Printing</h3>
              <p className="text-gray-600">
                Transform your ideas into wearable art with our premium custom printing services on t-shirts, jackets, and hoodies.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-pink-500 to-red-600 rounded-full p-4 w-16 h-16 mb-6 flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trend Forecasting</h3>
              <p className="text-gray-600">
                Stay ahead of the curve with our trend-setting designs that anticipate and shape the future of fashion.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Touch</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CalendarIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Established</h3>
              <p className="text-gray-600">2025</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPinIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">Mumbai, India</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-pink-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PhoneIcon className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+91 77189 86445</p>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <EnvelopeIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">aymnsk45@gmail.com</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default AboutUs;
