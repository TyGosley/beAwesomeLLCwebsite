import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function PulsatingButton({ onClick, isTransformed }) {
  const [scale, setScale] = useState(1);

  // Gradually increase button size over time
  useEffect(() => {
    if (isTransformed) return; // Stop growing after click

    const interval = setInterval(() => {
      setScale(prev => Math.min(prev + 0.02, 1.5)); // Grow up to 150%
    }, 1000); // Every second

    return () => clearInterval(interval);
  }, [isTransformed]);

  // Reset size when clicked
  useEffect(() => {
    if (isTransformed) {
      setScale(1); // Return to original size
    }
  }, [isTransformed]);

  return (
    <motion.button
      onClick={onClick}
      style={{ scale, transformOrigin: 'right center' }}
      animate={{
        backgroundColor: isTransformed 
          ? '#ffffff' // white when showing Reset
          : [
              '#ffffff', // white
              '#5bcbca', // turquoise
              '#ffffff', // back to white
            ],
        boxShadow: isTransformed 
          ? 'none' // No glow when showing Reset
          : [
              '0 0 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(91, 203, 202, 0.6)',
              '0 0 40px rgba(0, 0, 0, 0.8), 0 0 60px rgba(91, 203, 202, 1)',
              '0 0 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(91, 203, 202, 0.6)',
            ],
      }}
      transition={{
        backgroundColor: {
          duration: 2,
          repeat: isTransformed ? 0 : Infinity,
          ease: "easeInOut"
        },
        boxShadow: {
          duration: 2,
          repeat: isTransformed ? 0 : Infinity,
          ease: "easeInOut"
        }
      }}
      whileHover={{ scale: scale * 1.1 }}
      whileTap={{ scale: scale * 0.95 }}
      className="origin-right px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-black uppercase text-xs sm:text-sm tracking-wide transition-colors duration-300 border-8 text-black border-black cursor-pointer"
    >
      {isTransformed ? 'Reset' : 'Click Here'}
    </motion.button>
  );
}

export default PulsatingButton;
