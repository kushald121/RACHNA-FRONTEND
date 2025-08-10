import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Sparkles } from 'lucide-react';
import { NavBar, Footer } from '../../components';

const ComingSoonPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <NavBar />
      
      <main className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full opacity-20"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Main Content */}
          <div className="text-center">
            {/* Icon */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="text-gray-900">Coming</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Soon
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              This amazing collection will be added soon to our store
            </motion.p>

            {/* Description */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
            >
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-indigo-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">
                  We're Working Hard
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our team is carefully curating this special collection to bring you the best products. 
                Stay tuned for an amazing shopping experience that's worth the wait!
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/Rachna/allproducts"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Explore Current Collection</span>
              </Link>
              
              <Link
                to="/"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span>Back to Home</span>
              </Link>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              variants={itemVariants}
              className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Notified When It's Ready
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to know when this collection launches
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  Notify Me
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoonPage;
