// src/components/common/Loader.jsx
import React from 'react';
import { Atom } from 'lucide-react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, message = 'Loading...' }) => {
  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 30% 20%, #0f172a 0%, #020617 100%)',
    zIndex: 9999
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '200px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block', marginBottom: '1rem' }}
        >
          <Atom size={48} color="#a78bfa" />
        </motion.div>
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>{message}</p>
      </div>
    </div>
  );
};

export default Loader;