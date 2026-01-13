import React from 'react';
import { motion } from 'framer-motion';
import { useElementAnimation } from '../../hooks/useAnimation';
import { calculateMolarMass } from '../../utils/validationUtils';

function CompoundDisplay({ 
  compound, 
  type = 'reactant',
  isActive = false,
  showDetails = false,
  onSelect,
  animationProgress = 0 
}) {
  const { position, scale, pulse } = useElementAnimation(compound?.formula || '');
  
  const containerStyle = {
    ...styles.container,
    backgroundColor: type === 'reactant' ? '#dbeafe' : '#d1fae5',
    borderColor: type === 'reactant' ? '#3b82f6' : '#10b981',
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    opacity: isActive ? 1 : 0.7
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(compound);
      pulse(1);
    }
  };

  if (!compound) return null;

  const molarMass = calculateMolarMass(compound.formula);

  return (
    <motion.div
      className="compound-display"
      style={containerStyle}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: isActive ? [0, -5, 0] : 0,
        transition: {
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut"
        }
      }}
    >
      <div className="compound-header" style={styles.header}>
        <div className="compound-type" style={styles.typeLabel}>
          {type === 'reactant' ? 'Reactant' : 'Product'}
        </div>
        {isActive && (
          <div className="active-indicator" style={styles.activeIndicator}>
            ●
          </div>
        )}
      </div>
      
      <div className="compound-formula" style={styles.formula}>
        {compound.formula}
      </div>
      
      <div className="compound-name" style={styles.name}>
        {compound.name}
      </div>
      
      {showDetails && (
        <div className="compound-details" style={styles.details}>
          <div className="detail-item" style={styles.detailItem}>
            <span style={styles.detailLabel}>Molar Mass:</span>
            <span style={styles.detailValue}>{molarMass.toFixed(2)} g/mol</span>
          </div>
          
          {compound.color && (
            <div className="detail-item" style={styles.detailItem}>
              <span style={styles.detailLabel}>Color:</span>
              <span 
                style={{ 
                  ...styles.colorIndicator,
                  backgroundColor: compound.color 
                }}
                title={compound.color}
              />
            </div>
          )}
          
          {compound.state && (
            <div className="detail-item" style={styles.detailItem}>
              <span style={styles.detailLabel}>State:</span>
              <span style={styles.detailValue}>{compound.state}</span>
            </div>
          )}
          
          {compound.charge !== undefined && (
            <div className="detail-item" style={styles.detailItem}>
              <span style={styles.detailLabel}>Charge:</span>
              <span style={styles.detailValue}>
                {compound.charge > 0 ? `+${compound.charge}` : compound.charge}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="compound-atoms" style={styles.atomsContainer}>
        {renderAtoms(compound.formula, animationProgress)}
      </div>
    </motion.div>
  );
}

function renderAtoms(formula, progress) {
  // Simple atom representation
  const atoms = [];
  const atomSize = 20;
  const spacing = 30;
  
  // Parse formula for atom counts
  const atomPattern = /([A-Z][a-z]*)(\d*)/g;
  let match;
  let totalAtoms = 0;
  
  while ((match = atomPattern.exec(formula)) !== null) {
    const element = match[1];
    const count = match[2] ? parseInt(match[2]) : 1;
    
    for (let i = 0; i < count; i++) {
      const angle = (totalAtoms / 10) * Math.PI * 2;
      const x = Math.cos(angle) * 30 * progress;
      const y = Math.sin(angle) * 30 * progress;
      
      atoms.push(
        <motion.div
          key={`${element}-${i}`}
          style={{
            ...styles.atom,
            backgroundColor: getElementColor(element),
            left: `${50 + x}%`,
            top: `${50 + y}%`
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          title={element}
        >
          <span style={styles.atomSymbol}>{element}</span>
        </motion.div>
      );
      
      totalAtoms++;
    }
  }
  
  return atoms;
}

function getElementColor(element) {
  const colorMap = {
    H: '#ff6b6b',
    C: '#333333',
    O: '#ff4757',
    N: '#1e90ff',
    Na: '#ffa502',
    Cl: '#2ed573',
    // Add more elements as needed
  };
  
  return colorMap[element] || '#a4b0be';
}

const styles = {
  container: {
    position: 'relative',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid',
    minWidth: '180px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  typeLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4b5563',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  activeIndicator: {
    color: '#3b82f6',
    fontSize: '1.2rem',
    animation: 'pulse 2s infinite'
  },
  formula: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    fontFamily: 'Times New Roman, serif',
    color: '#1f2937'
  },
  name: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '15px',
    fontWeight: '500'
  },
  details: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '0.875rem'
  },
  detailLabel: {
    color: '#6b7280',
    fontWeight: '500'
  },
  detailValue: {
    color: '#1f2937',
    fontWeight: '600'
  },
  colorIndicator: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
  },
  atomsContainer: {
    position: 'relative',
    height: '80px',
    width: '100%',
    marginTop: '15px'
  },
  atom: {
    position: 'absolute',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  atomSymbol: {
    fontSize: '0.7rem',
    fontWeight: 'bold'
  }
};

export default CompoundDisplay;