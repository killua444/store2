import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onSearch, onCategoryFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories] = useState(['All', 'Hoodie', 'T-Shirt', 'Pants']);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <motion.section
      className="hero gradient-bg text-white py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="container relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Shadow Wear
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 opacity-90"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Premium clothing for the modern individual
        </motion.p>

        <motion.form
          onSubmit={handleSearch}
          className="max-w-md mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="btn px-6 py-3">
              Search
            </button>
          </div>
        </motion.form>

        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryFilter(category)}
              className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
    </motion.section>
  );
};

export default Hero;
