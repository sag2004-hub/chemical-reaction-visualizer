import React from 'react';
import { motion } from 'framer-motion';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  style = {},
  className = '',
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden'
  };

  const variants = {
    primary: {
      backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
      color: 'white',
      border: 'none',
      '&:hover:not(:disabled)': {
        backgroundColor: '#2563eb',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
      },
      '&:active:not(:disabled)': {
        transform: 'translateY(0)'
      }
    },
    secondary: {
      backgroundColor: disabled ? '#f3f4f6' : 'white',
      color: disabled ? '#9ca3af' : '#4b5563',
      border: '1px solid',
      borderColor: disabled ? '#d1d5db' : '#d1d5db',
      '&:hover:not(:disabled)': {
        backgroundColor: '#f9fafb',
        borderColor: '#9ca3af'
      }
    },
    success: {
      backgroundColor: disabled ? '#9ca3af' : '#10b981',
      color: 'white',
      border: 'none',
      '&:hover:not(:disabled)': {
        backgroundColor: '#059669'
      }
    },
    danger: {
      backgroundColor: disabled ? '#9ca3af' : '#ef4444',
      color: 'white',
      border: 'none',
      '&:hover:not(:disabled)': {
        backgroundColor: '#dc2626'
      }
    },
    warning: {
      backgroundColor: disabled ? '#9ca3af' : '#f59e0b',
      color: 'white',
      border: 'none',
      '&:hover:not(:disabled)': {
        backgroundColor: '#d97706'
      }
    },
    outline: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#3b82f6',
      border: '1px solid',
      borderColor: disabled ? '#d1d5db' : '#3b82f6',
      '&:hover:not(:disabled)': {
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#4b5563',
      border: 'none',
      '&:hover:not(:disabled)': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }
    },
    link: {
      backgroundColor: 'transparent',
      color: disabled ? '#9ca3af' : '#3b82f6',
      border: 'none',
      padding: '0',
      textDecoration: 'underline',
      '&:hover:not(:disabled)': {
        color: '#2563eb'
      }
    }
  };

  const sizes = {
    small: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      minHeight: '36px'
    },
    medium: {
      padding: '12px 24px',
      fontSize: '1rem',
      minHeight: '44px'
    },
    large: {
      padding: '16px 32px',
      fontSize: '1.125rem',
      minHeight: '52px'
    }
  };

  const getButtonStyles = () => {
    const variantStyle = variants[variant] || variants.primary;
    const sizeStyle = sizes[size] || sizes.medium;
    
    return {
      ...baseStyles,
      ...variantStyle,
      ...sizeStyle,
      ...style,
      opacity: disabled ? 0.6 : 1
    };
  };

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const renderIcon = () => {
    if (!Icon) return null;
    
    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    
    return (
      <Icon size={iconSize} style={{
        order: iconPosition === 'right' ? 2 : 1
      }} />
    );
  };

  const renderContent = () => {
    const contentOrder = iconPosition === 'right' 
      ? { order: 1 } 
      : { order: 2 };
    
    return (
      <>
        {renderIcon()}
        <span style={contentOrder}>{children}</span>
      </>
    );
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      style={getButtonStyles()}
      className={`button ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <>
          <div style={styles.spinner} />
          <span>Loading...</span>
        </>
      ) : (
        renderContent()
      )}
      
      {/* Ripple effect */}
      {!disabled && (
        <motion.div
          style={styles.ripple}
          initial={false}
          whileTap={{
            scale: 10,
            opacity: 0
          }}
          transition={{
            duration: 0.5
          }}
        />
      )}
    </motion.button>
  );
}

const styles = {
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'rotate 1s linear infinite'
  },
  ripple: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '10px',
    height: '10px',
    opacity: 0,
    transform: 'scale(0)'
  }
};

export default Button;