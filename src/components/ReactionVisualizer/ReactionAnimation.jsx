import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CompoundDisplay from './CompoundDisplay';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Zap, 
  Atom, 
  Target,
  Eye,
  EyeOff,
  Gauge,
  AlertCircle,
  Clock,
  Thermometer,
  ChevronRight,
  Sparkles
} from 'lucide-react';

function ReactionAnimation({ reaction, style }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showElectrons, setShowElectrons] = useState(true);
  const [showBonds, setShowBonds] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  // Enhanced reaction data with detailed animation steps
  const reactionData = reaction || {
    id: 'default',
    name: 'SN2 Nucleophilic Substitution',
    type: 'substitution',
    description: 'Backside attack with inversion of configuration',
    equation: 'CH₃Br + OH⁻ → CH₃OH + Br⁻',
    energy: '-45 kJ/mol (Exothermic)',
    temperature: '25°C',
    mechanism: 'Concerted bimolecular',
    compounds: {
      reactants: [
        { 
          name: 'Methyl Bromide', 
          formula: 'CH₃Br', 
          color: '#60a5fa',
          electrons: 26,
          bonds: 4,
          state: 'liquid',
          charge: 0
        },
        { 
          name: 'Hydroxide Ion', 
          formula: 'OH⁻', 
          color: '#34d399',
          electrons: 10,
          bonds: 1,
          state: 'aqueous',
          charge: -1
        }
      ],
      products: [
        { 
          name: 'Methanol', 
          formula: 'CH₃OH', 
          color: '#f87171',
          electrons: 26,
          bonds: 4,
          state: 'liquid',
          charge: 0
        },
        { 
          name: 'Bromide Ion', 
          formula: 'Br⁻', 
          color: '#fbbf24',
          electrons: 36,
          bonds: 0,
          state: 'aqueous',
          charge: -1
        }
      ]
    },
    steps: [
      { 
        title: 'Reactants Approach',
        description: 'Nucleophile approaches electrophilic carbon',
        duration: 2,
        keyEvents: ['Optimal orientation', 'Orbital alignment']
      },
      { 
        title: 'Nucleophilic Attack',
        description: 'OH⁻ attacks carbon from backside',
        duration: 3,
        keyEvents: ['Bond formation begins', 'Electron donation']
      },
      { 
        title: 'Transition State',
        description: 'Maximum energy configuration',
        duration: 4,
        keyEvents: ['Partial bonds', 'High energy state']
      },
      { 
        title: 'Bond Breaking',
        description: 'C-Br bond breaks as C-OH bond forms',
        duration: 2,
        keyEvents: ['Bond cleavage', 'Leaving group departure']
      },
      { 
        title: 'Product Formation',
        description: 'Final products with inverted configuration',
        duration: 2,
        keyEvents: ['Steric relaxation', 'Energy release']
      }
    ]
  };

  const { reactants = [], products = [] } = reactionData.compounds || {};
  const steps = reactionData.steps || [];
  const currentStep = Math.floor((progress / 100) * (steps.length - 1));
  const stepProgress = (progress % (100 / steps.length)) / (100 / steps.length);

  useEffect(() => {
    if (isPlaying && progress < 100) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = speed * 0.3;
          return prev >= 100 ? 100 : prev + increment;
        });
      }, 16);
      return () => clearInterval(interval);
    } else if (progress >= 100) {
      setIsPlaying(false);
    }
  }, [isPlaying, progress, speed]);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [reaction]);

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
    setSelectedCompound(null);
  };

  const handleStepForward = () => {
    const stepSize = 100 / steps.length;
    setProgress(prev => Math.min(100, prev + stepSize));
  };

  const handleStepBackward = () => {
    const stepSize = 100 / steps.length;
    setProgress(prev => Math.max(0, prev - stepSize));
  };

  const renderBackgroundEffects = () => {
    return (
      <div style={styles.backgroundEffects}>
        {/* Orbital rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            style={{
              ...styles.orbitRing,
              borderColor: `rgba(96, 165, 250, ${0.1 + i * 0.1})`,
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Energy particles */}
        {isPlaying && [...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            style={{
              ...styles.energyParticle,
              background: i % 2 ? '#60a5fa' : '#34d399',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    );
  };

  const renderElectronFlow = () => {
    if (!showElectrons) return null;

    const flowCount = Math.floor(stepProgress * 5) + 1;

    return (
      <div style={styles.electronFlowContainer}>
        {[...Array(flowCount)].map((_, i) => (
          <motion.div
            key={`flow-${i}`}
            style={styles.electronFlow}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear"
            }}
          >
            <div style={styles.electron}>•</div>
            <div style={styles.electron}>•</div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderBondAnimations = () => {
    if (!showBonds) return null;

    const centerX = 50;
    const centerY = 50;
    const bondProgress = stepProgress;

    return (
      <div style={styles.bondAnimations}>
        {/* Breaking bond */}
        {bondProgress < 0.5 && (
          <motion.div
            style={{
              ...styles.bond,
              left: `${centerX}%`,
              top: `${centerY}%`,
              width: `${100 * (0.5 - bondProgress)}px`,
              background: `linear-gradient(90deg, #f87171, transparent)`
            }}
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity
            }}
          />
        )}

        {/* Forming bond */}
        {bondProgress >= 0.5 && (
          <motion.div
            style={{
              ...styles.bond,
              left: `${centerX}%`,
              top: `${centerY}%`,
              width: `${100 * (bondProgress - 0.5) * 2}px`,
              background: `linear-gradient(90deg, #34d399, transparent)`
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1.2, 0.9]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )}

        {/* Orbital overlap */}
        <motion.div
          style={{
            ...styles.orbitalOverlap,
            left: `${centerX}%`,
            top: `${centerY}%`,
            background: `radial-gradient(circle, rgba(96, 165, 250, ${0.2 * bondProgress}) 0%, transparent 70%)`
          }}
          animate={{
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
      </div>
    );
  };

  const renderReactionArrow = () => {
    return (
      <motion.div
        style={styles.reactionArrow}
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : 1,
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      >
        <div style={styles.arrowBody}>
          <ChevronRight size={48} />
        </div>
        {renderElectronFlow()}
        <div style={styles.arrowLabel}>
          <Sparkles size={14} />
          Reaction Progress
        </div>
      </motion.div>
    );
  };

  const renderProgressTimeline = () => {
    return (
      <div style={styles.timeline}>
        {steps.map((step, index) => {
          const stepStart = (index / steps.length) * 100;
          const stepEnd = ((index + 1) / steps.length) * 100;
          const isActive = progress >= stepStart;
          const isCurrent = progress >= stepStart && progress < stepEnd;

          return (
            <div
              key={index}
              style={styles.timelineStep}
              onClick={() => setProgress(stepStart)}
            >
              <motion.div
                style={{
                  ...styles.timelineMarker,
                  background: isActive ? '#60a5fa' : 'rgba(96, 165, 250, 0.2)',
                  borderColor: isActive ? '#60a5fa' : 'rgba(96, 165, 250, 0.4)'
                }}
                whileHover={{ scale: 1.2 }}
              >
                {isActive && (
                  <motion.div
                    style={styles.activePulse}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                )}
                {index + 1}
              </motion.div>
              
              <div style={styles.timelineInfo}>
                <div style={{
                  ...styles.stepTitle,
                  color: isCurrent ? '#e2e8f0' : '#94a3b8'
                }}>
                  {step.title}
                </div>
                {isCurrent && (
                  <div style={styles.stepDescription}>
                    {step.description}
                  </div>
                )}
              </div>
              
              {isCurrent && (
                <motion.div
                  style={styles.progressIndicator}
                  initial={{ width: 0 }}
                  animate={{ width: `${stepProgress * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={containerRef} style={{...styles.container, ...style}}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <motion.div 
            style={styles.titleBadge}
            whileHover={{ scale: 1.05 }}
          >
            <Atom size={20} />
            <span>Reaction Animation</span>
          </motion.div>
          <h3 style={styles.title}>{reactionData.name}</h3>
          <div style={styles.equationContainer}>
            <div style={styles.equation}>{reactionData.equation}</div>
            <div style={styles.reactionInfo}>
              <div style={styles.infoItem}>
                <Thermometer size={14} />
                {reactionData.energy}
              </div>
              <div style={styles.infoItem}>
                <Clock size={14} />
                {reactionData.temperature}
              </div>
              <div style={styles.infoItem}>
                <Target size={14} />
                {reactionData.mechanism}
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.stepDisplay}>
          <div style={styles.currentStep}>
            <div style={styles.stepNumber}>STEP {currentStep + 1}</div>
            <div style={styles.stepName}>{steps[currentStep]?.title}</div>
          </div>
          <div style={styles.progressDisplay}>
            <div style={styles.progressText}>
              {progress.toFixed(1)}%
            </div>
            <div style={styles.progressBar}>
              <motion.div 
                style={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Animation Area */}
      <div ref={animationRef} style={styles.animationArea}>
        {renderBackgroundEffects()}
        
        {/* Reactants */}
        <div style={styles.reactantsArea}>
          {reactants.map((compound, index) => (
            <motion.div
              key={`reactant-${index}`}
              style={styles.compoundWrapper}
              animate={{
                x: [0, 5, 0],
                y: [0, -3, 0],
                opacity: [0.8 - (progress / 100) * 0.5, 1 - (progress / 100) * 0.5, 0.8 - (progress / 100) * 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
            >
              <CompoundDisplay
                compound={compound}
                type="reactant"
                isActive={selectedCompound?.formula === compound.formula}
                onClick={() => setSelectedCompound(compound)}
                size="medium"
              />
            </motion.div>
          ))}
        </div>

        {/* Center Animation */}
        <div style={styles.centerArea}>
          {renderReactionArrow()}
          {renderBondAnimations()}
          
          {/* Transition State Indicator */}
          {progress > 30 && progress < 70 && (
            <motion.div
              style={styles.transitionState}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <AlertCircle size={24} />
              <div style={styles.transitionText}>Transition State</div>
            </motion.div>
          )}
        </div>

        {/* Products */}
        <div style={styles.productsArea}>
          {products.map((compound, index) => (
            <motion.div
              key={`product-${index}`}
              style={styles.compoundWrapper}
              animate={{
                x: [0, -5, 0],
                y: [0, 3, 0],
                opacity: [0.2 + (progress / 100) * 0.8, 0.3 + (progress / 100) * 0.7, 0.2 + (progress / 100) * 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
            >
              <CompoundDisplay
                compound={compound}
                type="product"
                isActive={selectedCompound?.formula === compound.formula}
                onClick={() => setSelectedCompound(compound)}
                size="medium"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls Section */}
      <div style={styles.controls}>
        <div style={styles.controlsLeft}>
          <motion.button
            onClick={handleStepBackward}
            style={styles.controlButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={progress <= 0}
          >
            <SkipBack size={20} />
          </motion.button>
          
          <motion.button
            onClick={handlePlayPause}
            style={styles.playButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </motion.button>
          
          <motion.button
            onClick={handleStepForward}
            style={styles.controlButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={progress >= 100}
          >
            <SkipForward size={20} />
          </motion.button>
          
          <motion.button
            onClick={handleReset}
            style={styles.controlButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
          </motion.button>
        </div>

        <div style={styles.controlsRight}>
          {/* Speed Control */}
          <div style={styles.speedControl}>
            <Gauge size={16} />
            <span style={styles.controlLabel}>Speed:</span>
            <div style={styles.speedButtons}>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    ...styles.speedButton,
                    ...(speed === s && styles.activeSpeedButton)
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Controls */}
          <div style={styles.toggleGroup}>
            <motion.label
              style={styles.toggleLabel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                checked={showElectrons}
                onChange={(e) => setShowElectrons(e.target.checked)}
                style={styles.toggleInput}
              />
              {showElectrons ? <Zap size={16} /> : <Zap size={16} />}
              <span>Electrons</span>
            </motion.label>
            
            <motion.label
              style={styles.toggleLabel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                checked={showBonds}
                onChange={(e) => setShowBonds(e.target.checked)}
                style={styles.toggleInput}
              />
              {showBonds ? <Atom size={16} /> : <Atom size={16} />}
              <span>Bonds</span>
            </motion.label>
          </div>
        </div>
      </div>

      {/* Timeline & Details */}
      <div style={styles.footer}>
        {renderProgressTimeline()}
        
        {/* Selected Compound Details */}
        {selectedCompound && (
          <motion.div
            style={styles.compoundDetails}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={styles.detailsHeader}>
              <Eye size={18} />
              <span>Selected Compound</span>
            </div>
            <div style={styles.detailsContent}>
              <div style={styles.detailRow}>
                <strong>Name:</strong> {selectedCompound.name}
              </div>
              <div style={styles.detailRow}>
                <strong>Formula:</strong> {selectedCompound.formula}
              </div>
              <div style={styles.detailRow}>
                <strong>State:</strong> {selectedCompound.state}
              </div>
              {selectedCompound.charge !== 0 && (
                <div style={styles.detailRow}>
                  <strong>Charge:</strong> {selectedCompound.charge}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    color: '#f1f5f9',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  titleSection: {
    flex: 1,
    minWidth: '300px'
  },
  titleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(96, 165, 250, 0.15)',
    color: '#60a5fa',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '0.8rem',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    cursor: 'default'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#e2e8f0',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(90deg, #a5b4fc, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  equationContainer: {
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    border: '1px solid rgba(100, 180, 255, 0.1)'
  },
  equation: {
    fontFamily: 'Times New Roman, serif',
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#a5b4fc',
    marginBottom: '0.8rem',
    textAlign: 'center'
  },
  reactionInfo: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(30, 41, 59, 0.7)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    color: '#cbd5e1',
    border: '1px solid rgba(100, 180, 255, 0.1)'
  },
  stepDisplay: {
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '12px',
    padding: '1.2rem',
    minWidth: '250px',
    border: '1px solid rgba(100, 180, 255, 0.1)'
  },
  currentStep: {
    marginBottom: '1rem'
  },
  stepNumber: {
    fontSize: '0.75rem',
    color: '#60a5fa',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: '0.3rem'
  },
  stepName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#e2e8f0'
  },
  progressDisplay: {
    marginTop: '0.5rem'
  },
  progressText: {
    textAlign: 'right',
    fontSize: '0.875rem',
    color: '#94a3b8',
    marginBottom: '0.3rem'
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
    borderRadius: '3px'
  },
  animationArea: {
    position: 'relative',
    height: '350px',
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: '16px',
    border: '1px solid rgba(100, 180, 255, 0.1)',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    overflow: 'hidden'
  },
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none'
  },
  orbitRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid',
    borderRadius: '50%',
    opacity: 0.3
  },
  energyParticle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    opacity: 0
  },
  reactantsArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  productsArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  centerArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1
  },
  compoundWrapper: {
    position: 'relative',
    zIndex: 10
  },
  reactionArrow: {
    position: 'relative',
    color: 'rgba(96, 165, 250, 0.7)',
    zIndex: 5
  },
  arrowBody: {
    position: 'relative',
    zIndex: 2,
    filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))'
  },
  arrowLabel: {
    position: 'absolute',
    bottom: '-2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
    background: 'rgba(30, 41, 59, 0.7)',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    border: '1px solid rgba(100, 180, 255, 0.1)'
  },
  electronFlowContainer: {
    position: 'absolute',
    top: '50%',
    left: '-50%',
    right: '50%',
    height: '2px',
    transform: 'translateY(-50%)',
    overflow: 'hidden'
  },
  electronFlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)'
  },
  electron: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    background: '#60a5fa',
    borderRadius: '50%',
    top: '-2px',
    boxShadow: '0 0 10px #60a5fa'
  },
  bondAnimations: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  },
  bond: {
    position: 'absolute',
    height: '3px',
    borderRadius: '2px',
    transform: 'translateX(-50%)',
    filter: 'blur(1px)'
  },
  orbitalOverlap: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  },
  transitionState: {
    position: 'absolute',
    top: '-4rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(192, 132, 252, 0.2)',
    border: '1px solid rgba(192, 132, 252, 0.4)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: '#c084fc',
    fontSize: '0.875rem',
    fontWeight: 600
  },
  transitionText: {
    marginTop: '0.1rem'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderTop: '1px solid rgba(100, 180, 255, 0.1)',
    borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  controlsLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  controlButton: {
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    color: '#e2e8f0',
    padding: '0.8rem',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    minWidth: '50px',
    minHeight: '50px'
  },
  playButton: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    border: 'none',
    color: 'white',
    padding: '0.8rem 1.5rem',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
    minWidth: '120px',
    justifyContent: 'center'
  },
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  speedControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    background: 'rgba(30, 41, 59, 0.5)',
    padding: '0.6rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(100, 180, 255, 0.1)'
  },
  controlLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem'
  },
  speedButtons: {
    display: 'flex',
    gap: '0.3rem'
  },
  speedButton: {
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    color: '#94a3b8',
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    transition: 'all 0.3s ease'
  },
  activeSpeedButton: {
    background: 'rgba(96, 165, 250, 0.2)',
    borderColor: '#60a5fa',
    color: '#60a5fa'
  },
  toggleGroup: {
    display: 'flex',
    gap: '1rem'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(30, 41, 59, 0.5)',
    padding: '0.6rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#94a3b8',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: '1px solid rgba(100, 180, 255, 0.1)',
    transition: 'all 0.3s ease'
  },
  toggleInput: {
    margin: 0,
    marginRight: '0.3rem'
  },
  footer: {
    position: 'relative'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    position: 'relative',
    padding: '0.8rem',
    borderRadius: '10px',
    transition: 'background 0.3s ease'
  },
  timelineMarker: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#e2e8f0',
    border: '2px solid',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2
  },
  activePulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#60a5fa',
    opacity: 0.5
  },
  timelineInfo: {
    flex: 1
  },
  stepTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    marginBottom: '0.2rem'
  },
  stepDescription: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    opacity: 0.9
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
    borderRadius: '0 0 10px 10px'
  },
  compoundDetails: {
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(100, 180, 255, 0.1)',
    animation: 'slideIn 0.3s ease'
  },
  detailsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#60a5fa',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '1rem'
  },
  detailsContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.8rem'
  },
  detailRow: {
    fontSize: '0.9rem',
    color: '#cbd5e1',
    lineHeight: 1.5
  }
};

// CSS animation for slide-in effect
const slideInAnimation = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = slideInAnimation;
  document.head.appendChild(styleSheet);
}

export default ReactionAnimation;