import React from 'react';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react'
//import './ReactionVisualizer.css'

function ReactionVisualizer({ reaction, type = 'organic' }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showBonds, setShowBonds] = useState(true)

  const steps = reaction?.steps || [
    'Initial Reactants',
    'Bond Breaking',
    'Intermediate Formation',
    'Bond Formation',
    'Final Products'
  ]

  const compounds = reaction?.compounds || {
    reactants: [
      { name: 'Reactant A', formula: 'CH₄', color: '#3b82f6' },
      { name: 'Reactant B', formula: 'O₂', color: '#10b981' }
    ],
    products: [
      { name: 'Product A', formula: 'CO₂', color: '#ef4444' },
      { name: 'Product B', formula: 'H₂O', color: '#8b5cf6' }
    ]
  }

  useEffect(() => {
    let interval
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 100
          }
          return prev + 1
        })
      }, 50)
    } else if (progress >= 100) {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, progress])

  useEffect(() => {
    // Update current step based on progress
    const stepIndex = Math.floor((progress / 100) * (steps.length - 1))
    setCurrentStep(stepIndex)
  }, [progress, steps.length])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (progress >= 100) {
      setProgress(0)
      setIsPlaying(true)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentStep(0)
  }

  const handleStepForward = () => {
    const newProgress = Math.min(100, progress + 100 / (steps.length - 1))
    setProgress(newProgress)
  }

  const handleStepBackward = () => {
    const newProgress = Math.max(0, progress - 100 / (steps.length - 1))
    setProgress(newProgress)
  }

  const renderCompounds = () => {
    const progressRatio = progress / 100
    
    return (
      <div className="compounds-container">
        <div className="reactants-section">
          <h4>Reactants</h4>
          <div className="compounds-grid">
            {compounds.reactants.map((compound, index) => (
              <motion.div
                key={index}
                className="compound-card"
                style={{ 
                  backgroundColor: compound.color + '20',
                  borderColor: compound.color,
                  opacity: 1 - progressRatio * 0.5
                }}
                animate={{
                  x: progressRatio * 100,
                  scale: 1 - progressRatio * 0.2
                }}
              >
                <div className="compound-formula" style={{ color: compound.color }}>
                  {compound.formula}
                </div>
                <div className="compound-name">{compound.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="reaction-arrow">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: isPlaying ? Infinity : 0, duration: 1 }}
          >
            →
          </motion.div>
        </div>

        <div className="products-section">
          <h4>Products</h4>
          <div className="compounds-grid">
            {compounds.products.map((compound, index) => (
              <motion.div
                key={index}
                className="compound-card"
                style={{ 
                  backgroundColor: compound.color + '20',
                  borderColor: compound.color,
                  opacity: 0.5 + progressRatio * 0.5
                }}
                animate={{
                  x: -progressRatio * 100,
                  scale: 0.8 + progressRatio * 0.2
                }}
              >
                <div className="compound-formula" style={{ color: compound.color }}>
                  {compound.formula}
                </div>
                <div className="compound-name">{compound.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderBonds = () => {
    if (!showBonds) return null

    return (
      <div className="bonds-animation">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="bond"
            animate={{
              width: ['0%', '100%', '0%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="reaction-visualizer" style={styles.container}>
      <div className="visualization-header">
        <h3 style={styles.title}>{reaction?.name || 'Reaction Visualization'}</h3>
        <div className="step-indicator">
          <span style={styles.stepText}>Step {currentStep + 1}: {steps[currentStep]}</span>
        </div>
      </div>

      <div className="animation-area" style={styles.animationArea}>
        {renderCompounds()}
        {renderBonds()}
        
        <div className="progress-indicator" style={styles.progressIndicator}>
          <div 
            className="progress-bar" 
            style={{ ...styles.progressBar, width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="controls" style={styles.controls}>
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

        <div className="control-group">
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showBonds}
              onChange={(e) => setShowBonds(e.target.checked)}
              style={styles.toggleInput}
            />
            Show Bonds
          </label>
        </div>
      </div>

      <div className="progress-info" style={styles.progressInfo}>
        <div style={styles.progressText}>
          Progress: {progress.toFixed(0)}%
        </div>
        <div style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                ...styles.stepDot,
                ...(index <= currentStep ? styles.activeStepDot : {})
              }}
              title={step}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: '600'
  },
  animationArea: {
    position: 'relative',
    minHeight: '300px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    padding: '30px',
    margin: '20px 0',
    backgroundColor: '#f9fafb',
    overflow: 'hidden'
  },
  progressIndicator: {
    position: 'absolute',
    bottom: '10px',
    left: '20px',
    right: '20px',
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.1s linear'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  controlButton: {
    backgroundColor: '#f3f4f6',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    color: '#4b5563'
  },
  playButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px',
    borderRadius: '50%'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#4b5563',
    fontSize: '0.95rem',
    marginLeft: '20px'
  },
  toggleInput: {
    margin: '0'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb'
  },
  progressText: {
    color: '#6b7280',
    fontWeight: '500'
  },
  stepsContainer: {
    display: 'flex',
    gap: '8px'
  },
  stepDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#d1d5db',
    transition: 'all 0.3s'
  },
  activeStepDot: {
    backgroundColor: '#3b82f6',
    transform: 'scale(1.2)'
  },
  stepText: {
    color: '#4b5563',
    fontSize: '0.95rem',
    fontWeight: '500'
  }
}

export default ReactionVisualizer