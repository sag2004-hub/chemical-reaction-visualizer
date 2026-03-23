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
  Wind,
  Shield,
  Battery,
  Radiation,
  Circle,
  Hexagon,
  Square,
  Triangle,
  Octagon
} from 'lucide-react';

function CompoundDisplay({ 
  compound, 
  type = 'reactant',
  isActive = false,
  isTransition = false,
  isIntermediate = false,
  animationProgress = 0,
  size = 'medium',
  bondType = 'covalent',
  molecularGeometry,
  onClick,
  showBonds = true,
  showElectrons = true,
  isBreaking = false,
  isForming = false,
  showLabels = true,
  orientation = 'horizontal'
}) {
  
  const getCompoundTypeColor = () => {
    if (isTransition) return '#c084fc'; // Purple for transition state
    if (isIntermediate) return '#f59e0b'; // Amber for intermediates
    if (type === 'reactant') return '#60a5fa'; // Blue for reactants
    if (type === 'catalyst') return '#8b5cf6'; // Violet for catalysts
    if (type === 'intermediate') return '#fbbf24'; // Yellow for intermediates
    if (type === 'product') return '#34d399'; // Green for products
    if (type === 'solvent') return '#94a3b8'; // Gray for solvents
    return '#60a5fa';
  };

  const getBondColor = () => {
    switch(bondType?.toLowerCase()) {
      case 'ionic': return '#f87171'; // Red for ionic
      case 'covalent': return '#60a5fa'; // Blue for covalent
      case 'metallic': return '#fbbf24'; // Yellow for metallic
      case 'hydrogen': return '#c084fc'; // Purple for hydrogen
      case 'coordinate': return '#34d399'; // Green for coordinate
      case 'van der waals': return '#94a3b8'; // Gray for vdw
      default: return '#60a5fa';
    }
  };

  const getSizeStyles = () => {
    const sizes = {
      small: {
        container: { padding: '0.6rem', minWidth: '120px', minHeight: '150px' },
        formula: { fontSize: '1.3rem' },
        name: { fontSize: '0.7rem' },
        icon: { size: 10 },
        bondLength: 30
      },
      medium: {
        container: { padding: '1rem', minWidth: '160px', minHeight: '180px' },
        formula: { fontSize: '1.8rem' },
        name: { fontSize: '0.8rem' },
        icon: { size: 12 },
        bondLength: 40
      },
      large: {
        container: { padding: '1.5rem', minWidth: '200px', minHeight: '220px' },
        formula: { fontSize: '2.2rem' },
        name: { fontSize: '0.9rem' },
        icon: { size: 14 },
        bondLength: 50
      }
    };
    return sizes[size] || sizes.medium;
  };

  const sizeStyles = getSizeStyles();
  const typeColor = getCompoundTypeColor();
  const bondColor = getBondColor();

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
    },
    transition: {
      scale: [1, 1.1, 1],
      boxShadow: [
        `0 0 20px ${typeColor}40`,
        `0 0 40px ${typeColor}80`,
        `0 0 20px ${typeColor}40`
      ],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    },
    breaking: {
      scale: [1, 1.05, 1],
      x: [0, -2, 0, 2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity
      }
    },
    forming: {
      scale: [0.9, 1, 0.9],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        repeat: Infinity
      }
    }
  };

  const getGeometryIcon = () => {
    switch(molecularGeometry?.toLowerCase()) {
      case 'linear': return <div style={styles.linearIcon}>—</div>;
      case 'trigonal planar': return <Triangle size={14} />;
      case 'tetrahedral': return <div style={styles.tetrahedralIcon}>△</div>;
      case 'trigonal bipyramidal': return <Hexagon size={14} />;
      case 'octahedral': return <Octagon size={14} />;
      case 'square planar': return <Square size={14} />;
      default: return <Circle size={14} />;
    }
  };

  const renderMolecularGeometry = () => {
    if (!molecularGeometry || !showLabels) return null;

    const geometries = {
      'linear': { bonds: 2, angle: 180 },
      'trigonal planar': { bonds: 3, angle: 120 },
      'tetrahedral': { bonds: 4, angle: 109.5 },
      'trigonal bipyramidal': { bonds: 5, angles: [90, 120] },
      'octahedral': { bonds: 6, angle: 90 },
      'square planar': { bonds: 4, angle: 90 }
    };

    const geo = geometries[molecularGeometry.toLowerCase()];
    if (!geo) return null;

    return (
      <div style={styles.geometryContainer}>
        <div style={styles.geometryIcon}>{getGeometryIcon()}</div>
        <div style={styles.geometryLabel}>{molecularGeometry}</div>
      </div>
    );
  };

  const renderChemicalBonds = () => {
    if (!showBonds) return null;
    
    const bonds = compound?.bondCount || compound?.bonds || 0;
    const bondElements = [];
    const bondLength = sizeStyles.bondLength;
    
    for (let i = 0; i < bonds; i++) {
      const angle = (i / bonds) * Math.PI * 2;
      const length = bondLength + (compound?.bondLengths?.[i] || 0) * 10;
      const bondStrength = compound?.bondStrengths?.[i] || 1;
      const width = 1 + bondStrength * 2;
      const isBreaking = compound?.breakingBonds?.includes(i);
      const isForming = compound?.formingBonds?.includes(i);
      
      bondElements.push(
        <motion.div
          key={`bond-${i}`}
          style={{
            ...styles.bond,
            background: isBreaking 
              ? `linear-gradient(90deg, transparent, #f87171, transparent)`
              : isForming
              ? `linear-gradient(90deg, transparent, #34d399, transparent)`
              : `linear-gradient(90deg, transparent, ${bondColor}, transparent)`,
            left: '50%',
            top: '50%',
            width: `${length * 2}px`,
            height: `${width}px`,
            transform: `translate(-50%, -50%) rotate(${angle}rad)`,
            opacity: isBreaking ? 0.5 : 1,
            filter: isBreaking ? 'blur(1px)' : 'none'
          }}
          animate={isBreaking ? {
            opacity: [0.3, 0.8, 0.3],
            scale: [0.9, 1.3, 0.9],
            width: [`${length * 2}px`, `${length * 3}px`, `${length * 2}px`]
          } : isForming ? {
            opacity: [0.1, 0.9, 0.1],
            scale: [0.8, 1.2, 0.8],
            width: [`${length * 0.5}px`, `${length * 2}px`, `${length * 2}px`]
          } : {
            opacity: [0.3, 0.8, 0.3],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: isBreaking ? 1.5 : isForming ? 2 : 3,
            repeat: isBreaking || isForming ? Infinity : 0,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      );
    }
    
    return bondElements;
  };

  const renderAtomCenters = () => {
    if (!compound?.atoms || !showLabels) return null;
    
    return compound.atoms.map((atom, index) => (
      <div
        key={`atom-${index}`}
        style={{
          ...styles.atomCenter,
          left: `${atom.position?.x || 50}%`,
          top: `${atom.position?.y || 50}%`,
          background: atom.color || '#ffffff',
          border: `2px solid ${atom.color || '#ffffff'}40`,
          width: atom.size || '20px',
          height: atom.size || '20px'
        }}
      >
        {showLabels && (
          <div style={styles.atomLabel}>
            {atom.symbol}
            {atom.charge !== undefined && atom.charge !== 0 && (
              <sup style={styles.atomCharge}>
                {atom.charge > 0 ? `+${atom.charge}` : atom.charge}
              </sup>
            )}
          </div>
        )}
      </div>
    ));
  };

  const renderElectronCloud = () => {
    if (!showElectrons) return null;
    
    const electrons = compound?.electrons || 0;
    const valenceElectrons = compound?.valenceElectrons || electrons;
    
    return (
      <motion.div
        style={{
          ...styles.electronCloud,
          background: `radial-gradient(circle, ${typeColor}05 0%, transparent ${valenceElectrons * 2}%)`
        }}
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
        {/* Valence electrons */}
        {[...Array(Math.min(valenceElectrons, 8))].map((_, i) => {
          const angle = (i / Math.min(valenceElectrons, 8)) * Math.PI * 2;
          const radius = 30 + (i % 2) * 10;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={`valence-${i}`}
              style={{
                ...styles.electron,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                background: `radial-gradient(circle, ${typeColor}80, ${typeColor}40)`,
                boxShadow: `0 0 10px ${typeColor}`,
                border: `1px solid ${typeColor}`
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

        {/* Lone pairs */}
        {compound?.lonePairs && [...Array(Math.min(compound.lonePairs, 4))].map((_, i) => (
          <motion.div
            key={`lonepair-${i}`}
            style={{
              ...styles.lonePair,
              left: `calc(50% + ${Math.cos(i * Math.PI/2) * 45}px)`,
              top: `calc(50% + ${Math.sin(i * Math.PI/2) * 45}px)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            <div style={styles.lonePairDot} />
            <div style={styles.lonePairDot} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderStateIcon = () => {
    const state = compound?.state?.toLowerCase();
    const icons = {
      solid: <Hash size={sizeStyles.icon.size} />,
      liquid: <Droplets size={sizeStyles.icon.size} />,
      gas: <Wind size={sizeStyles.icon.size} />,
      aqueous: <Beaker size={sizeStyles.icon.size} />,
      plasma: <Flame size={sizeStyles.icon.size} />,
      crystal: <Shield size={sizeStyles.icon.size} />
    };
    
    return state ? icons[state] || <Thermometer size={sizeStyles.icon.size} /> : null;
  };

  const renderBondTypeIcon = () => {
    const icons = {
      ionic: <Battery size={sizeStyles.icon.size} />,
      covalent: <Atom size={sizeStyles.icon.size} />,
      metallic: <Radiation size={sizeStyles.icon.size} />,
      hydrogen: <Droplets size={sizeStyles.icon.size} />,
      coordinate: <Zap size={sizeStyles.icon.size} />
    };
    
    return bondType ? icons[bondType.toLowerCase()] || <Atom size={sizeStyles.icon.size} /> : null;
  };

  const getContainerVariant = () => {
    if (isTransition) return "transition";
    if (isBreaking) return "breaking";
    if (isForming) return "forming";
    if (isActive) return "active";
    return "animate";
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
          : isTransition
          ? `0 0 20px ${typeColor}40`
          : '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}
      variants={containerVariants}
      initial="initial"
      animate={getContainerVariant()}
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
        {isTransition ? 'Transition' : isIntermediate ? 'Intermediate' : type.toUpperCase()}
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
      {showLabels && (
        <div style={{
          ...styles.name,
          ...sizeStyles.name,
          color: '#cbd5e1'
        }}>
          {compound.name}
        </div>
      )}

      {/* Bond Type Indicator */}
      {bondType && showLabels && (
        <div style={styles.bondTypeBadge}>
          {renderBondTypeIcon()}
          <span style={styles.bondTypeText}>{bondType}</span>
        </div>
      )}

      {/* Molecular Geometry */}
      {renderMolecularGeometry()}

      {/* Atom Centers */}
      {renderAtomCenters()}

      {/* Compound Details */}
      {showLabels && (
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <div style={styles.detailItem}>
              <Atom size={12} />
              <span style={styles.detailLabel}>e⁻:</span>
              <span style={styles.detailValue}>{compound.electrons || 0}</span>
              {compound.valenceElectrons && (
                <span style={styles.valenceElectrons}>({compound.valenceElectrons} valence)</span>
              )}
            </div>
            
            <div style={styles.detailItem}>
              <Zap size={12} />
              <span style={styles.detailLabel}>Bonds:</span>
              <span style={styles.detailValue}>{compound.bondCount || compound.bonds || 0}</span>
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

          {compound.oxidationState !== undefined && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Oxidation:</span>
              <span style={styles.detailValue}>{compound.oxidationState}</span>
            </div>
          )}
        </div>
      )}

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    margin: '0.5rem'
  },
  typeBadge: {
    position: 'absolute',
    top: '0.5rem',
    left: '0.5rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    border: '1px solid',
    backdropFilter: 'blur(5px)',
    zIndex: 2
  },
  bondTypeBadge: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.6rem',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    color: '#94a3b8',
    zIndex: 2,
    textTransform: 'capitalize'
  },
  bondTypeText: {
    fontSize: '0.6rem'
  },
  geometryContainer: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    zIndex: 2
  },
  geometryIcon: {
    color: '#94a3b8',
    opacity: 0.8
  },
  geometryLabel: {
    fontSize: '0.6rem',
    color: '#94a3b8',
    textTransform: 'capitalize'
  },
  tetrahedralIcon: {
    fontSize: '14px',
    lineHeight: '14px',
    color: '#94a3b8'
  },
  linearIcon: {
    fontSize: '14px',
    lineHeight: '14px',
    color: '#94a3b8'
  },
  atomCenter: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    transform: 'translate(-50%, -50%)'
  },
  atomLabel: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  atomCharge: {
    fontSize: '0.5rem',
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.3rem'
  },
  activeIndicator: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '10px',
    height: '10px',
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
    margin: '0.5rem 0 0.3rem 0',
    fontFamily: 'Times New Roman, serif',
    letterSpacing: '1px',
    zIndex: 2,
    position: 'relative'
  },
  name: {
    fontWeight: 500,
    marginBottom: '0.5rem',
    opacity: 0.9,
    zIndex: 2,
    position: 'relative'
  },
  details: {
    width: '100%',
    padding: '0.5rem',
    background: 'rgba(15, 23, 42, 0.3)',
    borderRadius: '8px',
    borderTop: '1px solid rgba(100, 180, 255, 0.1)',
    marginTop: '0.3rem',
    zIndex: 2,
    position: 'relative'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.3rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.7rem',
    color: '#94a3b8',
    marginBottom: '0.2rem',
    flexWrap: 'wrap'
  },
  detailLabel: {
    fontWeight: 500,
    fontSize: '0.65rem'
  },
  detailValue: {
    fontWeight: 600,
    color: '#e2e8f0',
    fontSize: '0.7rem'
  },
  valenceElectrons: {
    fontSize: '0.6rem',
    color: '#94a3b8',
    marginLeft: '0.2rem'
  },
  chargeBadge: {
    padding: '0.1rem 0.4rem',
    borderRadius: '8px',
    fontSize: '0.65rem',
    fontWeight: 700,
    border: '1px solid',
    marginLeft: '0.2rem'
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
    transformOrigin: 'center',
    borderRadius: '1px',
    zIndex: 1
  },
  electronCloud: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    zIndex: 0
  },
  electron: {
    position: 'absolute',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1
  },
  lonePair: {
    position: 'absolute',
    display: 'flex',
    gap: '2px',
    transform: 'translate(-50%, -50%)',
    zIndex: 1
  },
  lonePairDot: {
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    background: 'rgba(96, 165, 250, 0.8)'
  },
  particle: {
    position: 'absolute',
    width: '2px',
    height: '2px',
    borderRadius: '50%',
    opacity: 0,
    zIndex: 0
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