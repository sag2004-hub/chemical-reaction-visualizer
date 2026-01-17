import React from 'react';
import { motion } from 'framer-motion';
import { 
  Atom, 
  Zap, 
  Hash, 
  Thermometer, 
  Beaker,
  Flame,
  Droplets,
  Wind
} from 'lucide-react';

function CompoundDisplay({ 
  compound, 
  type = 'reactant',
  isActive = false,
  isTransition = false,
  animationProgress = 0,
  size = 'medium',
  onClick
}) {
  
  const getCompoundTypeColor = () => {
    if (isTransition) return '#c084fc'; // Purple for transition state
    if (type === 'reactant') return '#60a5fa'; // Blue for reactants
    if (type === 'intermediate') return '#fbbf24'; // Yellow for intermediates
    return '#34d399'; // Green for products
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        container: { padding: '0.8rem', minWidth: '140px' },
        formula: { fontSize: '1.5rem' },
        name: { fontSize: '0.75rem' }
      },
      medium: {
        container: { padding: '1.2rem', minWidth: '180px' },
        formula: { fontSize: '2rem' },
        name: { fontSize: '0.875rem' }
      },
      large: {
        container: { padding: '1.5rem', minWidth: '220px' },
        formula: { fontSize: '2.5rem' },
        name: { fontSize: '1rem' }
      }
    };
    return sizes[size] || sizes.medium;
  };

  const sizeStyles = getSizeStyles();
  const typeColor = getCompoundTypeColor();

  const containerVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      borderColor: `${typeColor}80`,
      boxShadow: `0 15px 30px ${typeColor}20`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    active: {
      scale: 1.02,
      borderColor: typeColor,
      boxShadow: `0 0 0 3px ${typeColor}40, 0 20px 40px ${typeColor}15`,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const renderChemicalBonds = () => {
    const bonds = compound?.bonds || 0;
    const bondElements = [];
    
    for (let i = 0; i < bonds; i++) {
      const angle = (i / bonds) * Math.PI * 2;
      const length = 40;
      const x = Math.cos(angle) * length;
      const y = Math.sin(angle) * length;
      
      bondElements.push(
        <motion.div
          key={`bond-${i}`}
          style={{
            ...styles.bond,
            background: `linear-gradient(90deg, transparent, ${typeColor}40, transparent)`,
            left: '50%',
            top: '50%',
            width: `${length * 2}px`,
            transform: `translate(-50%, -50%) rotate(${angle}rad)`
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      );
    }
    
    return bondElements;
  };

  const renderElectronCloud = () => {
    const electrons = compound?.electrons || 0;
    
    return (
      <motion.div
        style={styles.electronCloud}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Electron dots */}
        {[...Array(Math.min(electrons, 12))].map((_, i) => {
          const angle = (i / Math.min(electrons, 12)) * Math.PI * 2;
          const radius = 30 + (i % 2) * 10;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={`electron-${i}`}
              style={{
                ...styles.electron,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                background: `radial-gradient(circle, ${typeColor}80, ${typeColor}40)`,
                boxShadow: `0 0 10px ${typeColor}`
              }}
              animate={{
                x: [0, Math.cos(angle + Math.PI/2) * 5, 0],
                y: [0, Math.sin(angle + Math.PI/2) * 5, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </motion.div>
    );
  };

  const renderStateIcon = () => {
    const state = compound?.state?.toLowerCase();
    const icons = {
      solid: <Hash size={12} />,
      liquid: <Droplets size={12} />,
      gas: <Wind size={12} />,
      aqueous: <Beaker size={12} />,
      plasma: <Flame size={12} />
    };
    
    return state ? icons[state] || <Thermometer size={12} /> : null;
  };

  if (!compound) return null;

  return (
    <motion.div
      style={{
        ...styles.container,
        ...sizeStyles.container,
        background: `linear-gradient(135deg, ${typeColor}08, ${typeColor}02)`,
        border: `2px solid ${typeColor}30`,
        boxShadow: isActive 
          ? `0 0 0 3px ${typeColor}40, 0 20px 40px ${typeColor}15`
          : '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}
      variants={containerVariants}
      initial="initial"
      animate={isActive ? "active" : "animate"}
      whileHover="hover"
      onClick={onClick}
    >
      {/* Type Badge */}
      <div style={{
        ...styles.typeBadge,
        background: `${typeColor}20`,
        borderColor: `${typeColor}40`,
        color: typeColor
      }}>
        {isTransition ? 'Transition' : type.toUpperCase()}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          style={styles.activeIndicator}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        >
          <div style={styles.activePulse} />
        </motion.div>
      )}

      {/* Chemical Formula */}
      <div style={{
        ...styles.formula,
        ...sizeStyles.formula,
        color: typeColor,
        textShadow: `0 0 20px ${typeColor}40`
      }}>
        {compound.formula}
      </div>

      {/* Compound Name */}
      <div style={{
        ...styles.name,
        ...sizeStyles.name,
        color: '#cbd5e1'
      }}>
        {compound.name}
      </div>

      {/* Compound Details */}
      <div style={styles.details}>
        <div style={styles.detailRow}>
          <div style={styles.detailItem}>
            <Atom size={14} />
            <span style={styles.detailLabel}>e⁻:</span>
            <span style={styles.detailValue}>{compound.electrons || 0}</span>
          </div>
          
          <div style={styles.detailItem}>
            <Zap size={14} />
            <span style={styles.detailLabel}>Bonds:</span>
            <span style={styles.detailValue}>{compound.bonds || 0}</span>
          </div>
        </div>

        {compound.state && (
          <div style={styles.detailItem}>
            {renderStateIcon()}
            <span style={styles.detailLabel}>State:</span>
            <span style={styles.detailValue}>
              {compound.state.charAt(0).toUpperCase() + compound.state.slice(1)}
            </span>
          </div>
        )}

        {compound.charge !== undefined && compound.charge !== 0 && (
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Charge:</span>
            <span style={{
              ...styles.chargeBadge,
              background: compound.charge > 0 ? '#f8717120' : '#60a5fa20',
              color: compound.charge > 0 ? '#f87171' : '#60a5fa',
              borderColor: compound.charge > 0 ? '#f8717140' : '#60a5fa40'
            }}>
              {compound.charge > 0 ? `+${compound.charge}` : compound.charge}
            </span>
          </div>
        )}
      </div>

      {/* Animated Background Effects */}
      <div style={styles.backgroundEffects}>
        {renderChemicalBonds()}
        {renderElectronCloud()}
        
        {/* Particle effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            style={{
              ...styles.particle,
              background: typeColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    position: 'relative',
    borderRadius: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  typeBadge: {
    position: 'absolute',
    top: '0.8rem',
    left: '0.8rem',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    border: '1px solid',
    backdropFilter: 'blur(5px)',
    zIndex: 2
  },
  activeIndicator: {
    position: 'absolute',
    top: '0.8rem',
    right: '0.8rem',
    width: '12px',
    height: '12px',
    zIndex: 2
  },
  activePulse: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 10px #10b981',
    animation: 'pulse 1.5s infinite'
  },
  formula: {
    fontWeight: 800,
    margin: '1rem 0 0.5rem 0',
    fontFamily: 'Times New Roman, serif',
    letterSpacing: '1px',
    zIndex: 2,
    position: 'relative'
  },
  name: {
    fontWeight: 500,
    marginBottom: '1rem',
    opacity: 0.9,
    zIndex: 2,
    position: 'relative'
  },
  details: {
    width: '100%',
    padding: '0.8rem',
    background: 'rgba(15, 23, 42, 0.3)',
    borderRadius: '10px',
    borderTop: '1px solid rgba(100, 180, 255, 0.1)',
    marginTop: '0.5rem',
    zIndex: 2,
    position: 'relative'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginBottom: '0.3rem'
  },
  detailLabel: {
    fontWeight: 500
  },
  detailValue: {
    fontWeight: 600,
    color: '#e2e8f0'
  },
  chargeBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 700,
    border: '1px solid',
    marginLeft: '0.3rem'
  },
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  bond: {
    position: 'absolute',
    height: '2px',
    transformOrigin: 'center'
  },
  electronCloud: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100, 180, 255, 0.05) 0%, transparent 70%)'
  },
  electron: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)'
  },
  particle: {
    position: 'absolute',
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    opacity: 0
  }
};

// Add CSS animation for pulse
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }
`;

// Inject styles if needed
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pulseAnimation;
  document.head.appendChild(styleSheet);
}

export default CompoundDisplay;