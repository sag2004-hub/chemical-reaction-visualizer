import React from 'react';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(function Card({
  children,
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  clickable = false,
  onClick,
  style = {},
  className = '',
  title,
  subtitle,
  header,
  footer,
  ...props
}, ref) {
  const baseStyles = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    position: 'relative'
  };

  const variants = {
    default: {
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    elevated: {
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    outlined: {
      border: '2px solid #d1d5db',
      boxShadow: 'none'
    },
    filled: {
      backgroundColor: '#f9fafb',
      border: 'none',
      boxShadow: 'none'
    },
    danger: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      boxShadow: 'none'
    },
    warning: {
      backgroundColor: '#fef3c7',
      border: '1px solid #fde047',
      boxShadow: 'none'
    },
    success: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #86efac',
      boxShadow: 'none'
    },
    info: {
      backgroundColor: '#eff6ff',
      border: '1px solid #93c5fd',
      boxShadow: 'none'
    }
  };

  const paddings = {
    none: '0',
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  const getCardStyles = () => {
    const variantStyle = variants[variant] || variants.default;
    const paddingStyle = { padding: paddings[padding] || paddings.medium };
    
    return {
      ...baseStyles,
      ...variantStyle,
      ...paddingStyle,
      ...style,
      cursor: clickable ? 'pointer' : 'default'
    };
  };

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const renderHeader = () => {
    if (header) return header;
    
    if (title || subtitle) {
      return (
        <div style={styles.header}>
          {title && <h3 style={styles.title}>{title}</h3>}
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
      );
    }
    
    return null;
  };

  const renderFooter = () => {
    if (footer) {
      return <div style={styles.footer}>{footer}</div>;
    }
    return null;
  };

  return (
    <motion.div
      ref={ref}
      style={getCardStyles()}
      className={`card ${className}`}
      onClick={handleClick}
      whileHover={hoverable ? { y: -4, boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)' } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      {...props}
    >
      {renderHeader()}
      
      <div style={styles.content}>
        {children}
      </div>
      
      {renderFooter()}
    </motion.div>
  );
});

const styles = {
  header: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0',
    lineHeight: '1.5'
  },
  content: {
    width: '100%'
  },
  footer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  }
};

export default Card;