import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ENTER TEXT DESCRIPTIONS HERE
const callouts = [
  {
    name: 'Anime Collection',
    description: 'For anime fans, with popular characters and designs.',
    imageSrc: 'https://thalasiknitfab.com/cdn/shop/files/ANIMEOVERSIZEDTSHIRT_6e28c0e6-b2a8-4932-a59b-4cc93ec85245_490x.progressive.png.jpg?v=1734612522',
    imageAlt: 'trending collection #1',
    to: '/Rachna/coming-soon/',
  },
  {
    name: 'Plain Basics',
    description: 'Clean, simple, plain-colored t-shirts for daily wear',
    imageSrc: 'https://triprindia.com/cdn/shop/files/TGYRNOS-PLAIND1651.jpg?v=1741861583',
    imageAlt: 'trending collection #2',
    to: '/Rachna/coming-soon/',
  },
  {
    name: 'Oversized Streetwear',
    description: 'Trendy oversized fits with street-style vibes.',
    imageSrc: 'https://tenshi-streetwear.com/cdn/shop/products/Tatsuo-Oversized-T-Shirt-tenshi-streetwear_1600x.jpg?v=1647030301',
    imageAlt: 'trending collection #3',
    to: '/Rachna/coming-soon/',
  },
  {
    name: 'Graphic Prints',
    description: 'Bold designs, quotes, cartoons, and fun graphics.',
    imageSrc: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRfVdIvSJietmqzxSOCZfuVVYLDElb8kgStk7ECGtDsva8gAsD61Pzu-BcTcLVofdyQU__QgWE2JH_HZQ7DB0W8e1t4JoOBt7qxWlhmro49KXzyd5SIAxd5',
    imageAlt: 'trending collection #4',
    to: '/Rachna/coming-soon/',
  },
  {
    name: 'Vintage Retro',
    description: 'Classic vintage designs with a modern twist.',
    imageSrc: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'trending collection #5',
    to: '/Rachna/coming-soon/',
  },
  {
    name: 'Athletic Wear',
    description: 'Performance-driven activewear for your fitness journey.',
    imageSrc: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'trending collection #6',
    to: '/Rachna/coming-soon/',
  },
  {
    name: 'Formal Elegance',
    description: 'Sophisticated formal wear for special occasions.',
    imageSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'trending collection #7',
    to: '/Rachna/coming-soon/',
  },
  {
    name: 'Casual Comfort',
    description: 'Everyday comfort meets contemporary style.',
    imageSrc: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'trending collection #8',
    to: '/Rachna/coming-soon/',
  },
]

const Previews = () => {
  // stagger motion animation
  const containerMotion = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  // animation parameters for TEXT
  const textMotion = {
    // movement = FADE-IN + UPWARDS movement
    hidden: { opacity: 0, y: -50 }, // INITIAL STAGE
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' }}, // ANIMATION STAGE
  };

  // animation parameters for IMAGE
  const imageMotion = {
    // movement = FADE-IN + SLIDE DOWN
    hidden: { opacity: 0 }, // INITIAL STAGE
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }, // ANIMATION STAGE
  };

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl py-14 lg:max-w-none lg:py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, amount: 0.2}}
          variants={containerMotion}
          >
          {/* SECTION TEXT */}
          <div className='flex'>
            <motion.h2 className="text-2xl font-bold text-gray-900 mr-1.5" variants={textMotion}>
              Explore
            </motion.h2>
            <motion.h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-purple-500 mr-1.5" variants={textMotion}>
              Trending
              </motion.h2>
            <motion.h2 className="text-2xl font-bold text-gray-900" variants={textMotion}>
              Collections
            </motion.h2>
          </div>

          {/* REUSABLE TEMPlATE FORMAT */}
          <div className="mt-6 space-y-12 lg:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:space-y-0">
            {callouts.map((callout) => (
              <div key={callout.name} className="group relative">
                
                {/* Collection Image */}
                <motion.div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 shadow-xl transition-transform duration-300 transform group-hover:scale-95 sm:h-64" variants={imageMotion}>
                  <Link to={callout.to}>
                    <img
                      src={callout.imageSrc}
                      alt={callout.imageAlt}
                      className="h-full w-full object-cover object-center group-hover:opacity-80"
                    />
                  </Link>
                </motion.div>

                {/* TEXT SECTION */}
                <motion.span variants={textMotion}>
                  {/* Collection Title */}
                  <h3 className="mt-6 text-xl font-bold">
                    <Link to={callout.to}>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
                        {callout.name}
                      </span>
                    </Link>
                  </h3>

                  {/* Collection Description */}
                  <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed">{callout.description}</p>
                  
                </motion.span>

              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  )
}

export default Previews