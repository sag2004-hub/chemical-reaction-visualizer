import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  overlayStyle = {},
  modalStyle = {},
  className = '',
  footer,
  hideHeader = false,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, closeOnEscape, handleClose]);

  const sizes = {
    small: {
      width: '400px',
      maxWidth: '90vw'
    },
    medium: {
      width: '600px',
      maxWidth: '90vw'
    },
    large: {
      width: '800px',
      maxWidth: '90vw'
    },
    xlarge: {
      width: '1000px',
      maxWidth: '95vw'
    },
    full: {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      borderRadius: '0'
    }
  };

  const selectedSize = sizes[size] || sizes.medium;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            ...styles.overlay,
            ...overlayStyle
          }}
          className={`modal-overlay ${className}`}
          onClick={handleOverlayClick}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          {...props}
        >
          <motion.div
            style={{
              ...styles.modal,
              ...selectedSize,
              ...modalStyle
            }}
            className="modal-content"
            variants={modalVariants}
            transition={{ 
              duration: 0.3,
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
          >
            {!hideHeader && (
              <div style={styles.header}>
                {title && <h2 style={styles.title}>{title}</h2>}
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    style={styles.closeButton}
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            )}

            <div style={styles.body}>
              {children}
            </div>

            {footer && (
              <div style={styles.footer}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(4px)'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  header: {
    padding: '24px 30px 20px 30px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexShrink: 0
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    paddingRight: '20px',
    lineHeight: '1.3'
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    flexShrink: 0,
    '&:hover': {
      backgroundColor: '#f3f4f6',
      color: '#1f2937'
    }
  },
  body: {
    padding: '30px',
    overflowY: 'auto',
    flex: 1,
    minHeight: 0
  },
  footer: {
    padding: '24px 30px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    flexShrink: 0
  }
};

export default Modal;