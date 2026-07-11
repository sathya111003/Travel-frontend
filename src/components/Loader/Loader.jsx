import React from 'react';
import { motion } from 'framer-motion';
import logo1 from '../../assets/logo1.PNG';

const Loader = ({ variant = 'section', text }) => {
  if (variant === 'fullScreen') {
    return (
      <motion.div
        className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Logo Container with rotating gradient ring */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Spinning Ring */}
            <motion.div
              className="absolute w-36 h-36 rounded-full border-2 border-transparent border-t-primary border-r-primary"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
            
            {/* Inner pulsing logo */}
            <motion.img
              src={logo1}
              alt="Ravana Holidays"
              className="w-28 h-28 object-contain relative z-10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Elegant Progress Line */}
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-[#F97316] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
            />
          </div>

          {text && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/70 text-[10px] font-bold tracking-[0.3em] uppercase mt-6"
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Section variant
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full">
      <div className="relative flex items-center justify-center">
        {/* Spinner ring */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-transparent border-t-primary border-r-primary"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
        {/* Miniature logo */}
        <motion.img
          src={logo1}
          alt="Loading..."
          className="w-12 h-12 object-contain relative z-10"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
      </div>
      {text && (
        <p className="text-text/40 text-xs font-bold uppercase tracking-widest mt-4 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
