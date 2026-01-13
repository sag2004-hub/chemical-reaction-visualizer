import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation, useStepAnimation, useBondAnimation } from '../../hooks/useAnimation';
import CompoundDisplay from './CompoundDisplay';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Zap, Atom } from 'lucide-react';
import '../../styles/animations.css';

function ReactionAnimation({ reaction, type = 'organic' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showElectrons, setShowElectrons] = useState(true);
  const [showBonds, setShowBonds] = useState(true);
  const [selectedCompound, setSelectedCompound] = useState(null);
  
  const { progress, setTo, reset, togglePlay, stepForward, stepBackward } = useAnimation(0);
  const animationAreaRef = useRef(null);

  // Default reaction data if none provided
  const reactionData = reaction || {
    id: 'default',
    name: 'Sample Reaction',
    type: 'combination',
    category: type,
    equation: '2H₂ + O₂ → 2H₂O',
    description: 'Formation of water from hydrogen and oxygen',
    compounds: {
      reactants: [
        { name: 'Hydrogen', formula: 'H₂', color: '#ff6b6b', state: 'gas' },
        { name: 'Oxygen', formula: 'O₂', color: '#1e90ff', state: 'gas' }
      ],
      products: [
        { name: 'Water', formula: 'H₂O', color: '#2ed573', state: 'liquid' }
      ]
    },
    steps: [
      'Reactants approach each other',
      'H-H bonds break',
      'O=O bond breaks',
      'New O-H bonds form',
      'Water molecules form'
    ]
  };

  const { reactants = [], products = [] } = reactionData.compounds || { reactants: [], products: [] };
  const steps = reactionData.steps || ['Step 1', 'Step 2', 'Step 3'];
  
  const currentStep = Math.floor((progress / 100) * (steps.length - 1));

  useEffect(() => {
    if (isPlaying && progress < 100) {
      const timer = setTimeout(() => {
        setTo(progress + 0.5);
      }, 20);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setIsPlaying(false);
    }
  }, [isPlaying, progress, setTo]);

  const handlePlayPause = () => {
    if (progress >= 100) {
      reset();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    reset();
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    const stepSize = 100 / (steps.length - 1);
    stepForward(stepSize);
  };

  const handleStepBackward = () => {
    const stepSize = 100 / (steps.length - 1);
    stepBackward(stepSize);
  };

  const renderBonds = () => {
    if (!showBonds) return null;

    const bondElements = [];
    const centerX = 50;
    const centerY = 50;

    // Render bonds based on progress
    const bondProgress = progress / 100;

    // Breaking bonds (first half of animation)
    if (bondProgress < 0.5) {
      bondElements.push(
        <motion.div
          key="bond-breaking"
          className="bond-line"
          style={{
            ...styles.bond,
            left: `${centerX - 15}%`,
            top: `${centerY}%`,
            width: `${30 * (1 - bondProgress * 2)}%`,
            backgroundColor: '#ef4444'
          }}
          animate={{
            opacity: [1, 0.5, 1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity
          }}
        />
      );
    }

    // Forming bonds (second half of animation)
    if (bondProgress > 0.5) {
      const formProgress = (bondProgress - 0.5) * 2;
      bondElements.push(
        <motion.div
          key="bond-forming"
          className="bond-line"
          style={{
            ...styles.bond,
            left: `${centerX - 15}%`,
            top: `${centerY + 10}%`,
            width: `${30 * formProgress}%`,
            backgroundColor: '#10b981'
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity
          }}
        />
      );
    }

    return bondElements;
  };

  const renderElectrons = () => {
    if (!showElectrons) return null;

    const electrons = [];
    const electronCount = Math.floor(progress / 10) + 1;

    for (let i = 0; i < electronCount; i++) {
      const angle = (i / electronCount) * Math.PI * 2 + (progress / 100) * Math.PI * 2;
      const radius = 40 + Math.sin(progress / 100 * Math.PI) * 10;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;

      electrons.push(
        <motion.div
          key={`electron-${i}`}
          className="electron-orbit"
          style={{
            ...styles.electron,
            left: `${x}%`,
            top: `${y}%`
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      );
    }

    return electrons;
  };

  const renderReactants = () => {
    const reactantProgress = Math.min(progress / 50, 1); // Reactants fade in first half
    
    return reactants.map((compound, index) => {
      const offset = index * 30;
      const x = 20 + offset * (1 - reactantProgress);
      const y = 50 + Math.sin(progress / 100 * Math.PI) * 10;

      return (
        <motion.div
          key={`reactant-${index}`}
          style={{
            ...styles.compoundWrapper,
            left: `${x}%`,
            top: `${y}%`,
            opacity: 1 - (progress / 100) * 0.8,
            transform: `translate(-50%, -50%) scale(${1 - (progress / 100) * 0.3})`
          }}
          animate={{
            x: [0, 10, 0],
            y: [0, -5, 0]
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
            onSelect={setSelectedCompound}
            animationProgress={reactantProgress}
          />
        </motion.div>
      );
    });
  };

  const renderProducts = () => {
    const productProgress = Math.max(0, (progress - 50) / 50); // Products appear second half
    
    return products.map((compound, index) => {
      const offset = index * 30;
      const x = 80 - offset * productProgress;
      const y = 50 + Math.sin((progress - 50) / 100 * Math.PI) * 10;

      return (
        <motion.div
          key={`product-${index}`}
          style={{
            ...styles.compoundWrapper,
            left: `${x}%`,
            top: `${y}%`,
            opacity: 0.2 + productProgress * 0.8,
            transform: `translate(-50%, -50%) scale(${0.7 + productProgress * 0.3})`
          }}
          animate={{
            x: [0, -10, 0],
            y: [0, 5, 0]
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
            onSelect={setSelectedCompound}
            animationProgress={productProgress}
          />
        </motion.div>
      );
    });
  };

  const renderReactionArrow = () => {
    const arrowProgress = progress / 100;
    
    return (
      <motion.div
        style={{
          ...styles.reactionArrow,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: arrowProgress < 0.5 ? 0 : 180
        }}
        transition={{
          duration: 1,
          repeat: 0
        }}
      >
        <div style={styles.arrowBody}>→</div>
        <motion.div
          style={styles.arrowProgress}
          animate={{
            width: `${progress}%`
          }}
          transition={{
            duration: 0.1
          }}
        />
      </motion.div>
    );
  };

  return (
    <div className="reaction-animation" style={styles.container}>
      <div className="animation-header" style={styles.header}>
        <div style={styles.titleSection}>
          <h3 style={styles.title}>{reactionData.name}</h3>
          <div style={styles.equation}>
            <code style={styles.equationCode}>{reactionData.equation}</code>
          </div>
        </div>
        
        <div style={styles.stepIndicator}>
          <Atom size={20} />
          <span style={styles.stepText}>
            Step {currentStep + 1}: {steps[currentStep]}
          </span>
        </div>
      </div>

      <div 
        ref={animationAreaRef}
        className="animation-area" 
        style={styles.animationArea}
      >
        {/* Background grid */}
        <div style={styles.grid} />
        
        {/* Reactants */}
        {renderReactants()}
        
        {/* Reaction arrow */}
        {renderReactionArrow()}
        
        {/* Products */}
        {renderProducts()}
        
        {/* Bonds animation */}
        {renderBonds()}
        
        {/* Electrons animation */}
        {renderElectrons()}
        
        {/* Progress indicator */}
        <div style={styles.overallProgress}>
          <div 
            style={{ 
              ...styles.progressBar, 
              width: `${progress}%` 
            }} 
          />
          <div style={styles.progressLabel}>
            {progress.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="controls" style={styles.controls}>
        <div style={styles.controlGroup}>
          <button
            onClick={handleStepBackward}
            style={styles.controlButton}
            disabled={progress <= 0}
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={handlePlayPause}
            style={{ ...styles.controlButton, ...styles.playButton }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={handleStepForward}
            style={styles.controlButton}
            disabled={progress >= 100}
          >
            <SkipForward size={20} />
          </button>
          
          <button
            onClick={handleReset}
            style={styles.controlButton}
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div style={styles.speedControl}>
          <label style={styles.speedLabel}>Speed:</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            defaultValue="1"
            style={styles.speedSlider}
            onChange={(e) => {
              // Speed control logic would go here
            }}
          />
        </div>

        <div style={styles.toggleGroup}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showElectrons}
              onChange={(e) => setShowElectrons(e.target.checked)}
              style={styles.toggleInput}
            />
            <Zap size={16} />
            <span>Electrons</span>
          </label>
          
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showBonds}
              onChange={(e) => setShowBonds(e.target.checked)}
              style={styles.toggleInput}
            />
            <Atom size={16} />
            <span>Bonds</span>
          </label>
        </div>
      </div>

      <div className="progress-section" style={styles.progressSection}>
        <div style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                ...styles.stepMarker,
                ...(index <= currentStep ? styles.activeStepMarker : {}),
                ...(index === currentStep ? styles.currentStepMarker : {})
              }}
              title={step}
              onClick={() => setTo((index / (steps.length - 1)) * 100)}
            >
              <div style={styles.stepNumber}>{index + 1}</div>
              <div style={styles.stepName}>{step}</div>
            </div>
          ))}
        </div>
        
        <div style={styles.progressInfo}>
          <div style={styles.compoundInfo}>
            {selectedCompound ? (
              <>
                <strong>Selected:</strong> {selectedCompound.name} ({selectedCompound.formula})
              </>
            ) : (
              'Click on a compound for details'
            )}
          </div>
          
          <div style={styles.energyInfo}>
            <Zap size={16} />
            <span>Energy: {reactionData.energy || 'Exothermic'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  titleSection: {
    flex: '1',
    minWidth: '300px'
  },
  title: {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  equation: {
    backgroundColor: '#f9fafb',
    padding: '12px 20px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    color: '#1e40af',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  equationCode: {
    display: 'block'
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f0f9ff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid #dbeafe',
    color: '#1e40af',
    fontWeight: '500',
    minWidth: '250px'
  },
  stepText: {
    fontSize: '1rem'
  },
  animationArea: {
    position: 'relative',
    height: '400px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    marginBottom: '25px',
    overflow: 'hidden'
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(to right, #e2e8f0 1px, transparent 1px),
      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    opacity: 0.3
  },
  compoundWrapper: {
    position: 'absolute',
    zIndex: 10
  },
  reactionArrow: {
    position: 'absolute',
    fontSize: '4rem',
    color: '#6b7280',
    zIndex: 5
  },
  arrowBody: {
    position: 'relative',
    zIndex: 2
  },
  arrowProgress: {
    position: 'absolute',
    top: '50%',
    left: '0%',
    height: '6px',
    backgroundColor: '#3b82f6',
    borderRadius: '3px',
    zIndex: 1,
    transform: 'translateY(-50%)'
  },
  bond: {
    position: 'absolute',
    height: '4px',
    borderRadius: '2px',
    transformOrigin: 'left center',
    zIndex: 3
  },
  electron: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#f59e0b',
    boxShadow: '0 0 10px #f59e0b',
    zIndex: 2,
    transform: 'translate(-50%, -50%)'
  },
  overallProgress: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '6px',
    backgroundColor: '#e5e7eb'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.1s linear',
    borderRadius: '3px'
  },
  progressLabel: {
    position: 'absolute',
    top: '-25px',
    right: '10px',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  controlGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  controlButton: {
    backgroundColor: '#f3f4f6',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    color: '#4b5563',
    minWidth: '50px'
  },
  playButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '15px',
    borderRadius: '50%',
    minWidth: '60px'
  },
  speedControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '200px'
  },
  speedLabel: {
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  speedSlider: {
    flex: '1',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#d1d5db',
    outline: 'none'
  },
  toggleGroup: {
    display: 'flex',
    gap: '20px'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#4b5563',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  toggleInput: {
    margin: '0'
  },
  progressSection: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '20px'
  },
  stepsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  stepMarker: {
    flex: '1',
    minWidth: '120px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center'
  },
  activeStepMarker: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6'
  },
  currentStepMarker: {
    backgroundColor: '#3b82f6',
    borderColor: '#1e40af',
    color: 'white'
  },
  stepNumber: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  stepName: {
    fontSize: '0.875rem',
    opacity: '0.8'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '15px'
  },
  compoundInfo: {
    color: '#4b5563',
    fontSize: '0.95rem',
    flex: '1',
    minWidth: '300px'
  },
  energyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '0.875rem'
  }
};

export default ReactionAnimation;