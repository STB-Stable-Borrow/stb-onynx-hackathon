import React from 'react';
import { motion } from 'framer-motion';
import spinner from "../assets/dashboard/collapseLogo.svg"

const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-10">
      <motion.img
        src={spinner}
        alt="Loading..."
        className="w-30 h-30"
        animate={{
          rotate: 360,
          scale: [1, 1.5, 1], 
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;