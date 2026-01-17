import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Zap,
  Target,
  Atom,
  Eye,
  ChevronRight,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';

function OrganicReactionVisualizer({
  reaction = {},
  autoPlay = false,
  initialProgress = 0,
}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(initialProgress);
  const [currentStep, setCurrentStep] = useState(0);
  const [showElectronFlow, setShowElectronFlow] = useState(true);
  const [speed, setSpeed] = useState(1);

  const {
    name = 'Reaction Mechanism',
    type = 'organic',
    description = '',
    compounds = { reactants: [], intermediates: [], products: [] },
    steps = [],
  } = reaction;

  // Auto progress when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = speed * 0.4;
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Sync current step with progress
  useEffect(() => {
    if (!steps?.length) {
      setCurrentStep(0);
      return;
    }
    const stepIndex = Math.min(
      steps.length - 1,
      Math.floor((progress / 100) * (steps.length - 1))
    );
    setCurrentStep(stepIndex);
  }, [progress, steps?.length]);

  const progressRatio = progress / 100;

  const handlePlayPause = () => {
    if (progress >= 99.5 && !isPlaying) {
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentStep(0);
  };

  const jumpToStep = (stepIndex) => {
    if (steps.length <= 1) return;
    const target = (stepIndex / (steps.length - 1)) * 100;
    setProgress(Math.min(100, Math.max(0, target)));
  };

  const shouldShowIntermediate =
    progressRatio > 0.25 &&
    progressRatio < 0.75 &&
    (compounds.intermediates?.length ?? 0) > 0;

  const typeStyles = {
    substitution: 'bg-blue-950/40 border-blue-500 text-blue-300',
    elimination: 'bg-purple-950/40 border-purple-500 text-purple-300',
    addition: 'bg-emerald-950/40 border-emerald-500 text-emerald-300',
    oxidation: 'bg-red-950/40 border-red-500 text-red-300',
  }[type] || 'bg-gray-800/40 border-gray-600 text-gray-300';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              {name}
            </h1>
            {description && (
              <p className="mt-2 text-slate-400 text-lg">{description}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <span className="px-4 py-1.5 bg-blue-900/40 text-blue-300 rounded-full text-sm font-medium border border-blue-700/50">
                Step {currentStep + 1} / {Math.max(1, steps.length)}
              </span>
              <span className="text-slate-300 text-lg font-medium">
                {steps[currentStep]?.title || '—'}
              </span>
            </div>
          </div>

          <div
            className={`px-5 py-2 rounded-full text-sm font-bold border-2 ${typeStyles}`}
          >
            {type.toUpperCase()}
          </div>
        </div>

        {/* Main visualization area */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6 relative min-h-[340px]">
            {/* Reactants */}
            <div className="w-full md:w-5/12 space-y-6">
              <div className="flex items-center gap-3 text-slate-400 font-medium mb-4">
                <Target size={20} />
                <span>Reactants</span>
              </div>

              <div className="space-y-5">
                {compounds.reactants.map((mol, i) => (
                  <motion.div
                    key={`r-${i}`}
                    className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl p-5 text-center transition-all"
                    style={{ borderColor: mol.color || '#60a5fa', color: mol.color || '#60a5fa' }}
                    animate={{
                      opacity: 1 - progressRatio * 0.65,
                      x: progressRatio * 80,
                      scale: 1 - progressRatio * 0.08,
                    }}
                  >
                    <div className="text-3xl font-bold mb-2">{mol.formula}</div>
                    <div className="text-slate-300 mb-2">{mol.name}</div>
                    {mol.role && (
                      <div className="inline-block px-3 py-1 bg-slate-700/60 rounded-full text-xs uppercase tracking-wide mb-3">
                        {mol.role}
                      </div>
                    )}
                    <div className="flex justify-center gap-6 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Atom size={14} /> {mol.electrons ?? '?'} e⁻
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap size={14} /> {mol.bonds ?? '?'} bonds
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow + effects */}
            <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center">
              <motion.div
                animate={{ scale: isPlaying ? [1, 1.18, 1] : 1 }}
                transition={{ duration: 1.6, repeat: isPlaying ? Infinity : 0, repeatType: 'reverse' }}
                className="text-blue-400"
              >
                <ChevronRight size={72} strokeWidth={2.5} />
              </motion.div>

              <AnimatePresence mode="wait">
                {steps[currentStep]?.bondBreaking && (
                  <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-950/80 text-red-300 px-4 py-2 rounded-lg text-sm font-medium border border-red-700/60 whitespace-nowrap"
                  >
                    Bond Breaking
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {steps[currentStep]?.bondForming && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-lg text-sm font-medium border border-emerald-700/60 whitespace-nowrap"
                  >
                    Bond Forming
                  </motion.div>
                )}
              </AnimatePresence>

              {showElectronFlow && (
                <div className="absolute inset-0 flex items-center">
                  <motion.div
                    className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    animate={{ x: ['-150%', '150%'] }}
                    transition={{ duration: 2.5, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                  >
                    <div className="absolute inset-y-0 left-1/4 w-3 h-3 bg-blue-400 rounded-full blur-sm" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Intermediate */}
            <AnimatePresence>
              {shouldShowIntermediate && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 60 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7, y: 60 }}
                  className="absolute md:static inset-x-0 md:w-5/12 top-1/2 md:top-auto -translate-y-1/2 md:translate-y-0 z-10"
                >
                  <div className="bg-purple-950/30 backdrop-blur-md border border-purple-700/50 rounded-2xl p-6 text-center shadow-2xl shadow-purple-900/30">
                    <div className="flex items-center justify-center gap-3 text-purple-300 font-medium mb-5">
                      <AlertCircle size={20} />
                      <span>Intermediate</span>
                    </div>

                    <div className="space-y-6">
                      {compounds.intermediates.map((mol, i) => (
                        <motion.div
                          key={`i-${i}`}
                          className="bg-slate-900/70 border-2 rounded-xl p-5"
                          style={{
                            borderColor: mol.color || '#c084fc',
                            color: mol.color || '#c084fc',
                            boxShadow: '0 0 25px rgba(168,85,247,0.3)',
                          }}
                          animate={{
                            scale: [1, 1.08, 1],
                          }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                        >
                          <div className="text-3xl font-bold mb-2">{mol.formula}</div>
                          <div className="text-purple-200 mb-2">{mol.name}</div>
                          {mol.description && (
                            <div className="text-sm text-purple-300/80 italic">
                              {mol.description}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products */}
            <div className="w-full md:w-5/12 space-y-6">
              <div className="flex items-center gap-3 text-slate-400 font-medium mb-4 justify-end">
                <span>Products</span>
                <FlaskConical size={20} />
              </div>

              <div className="space-y-5">
                {compounds.products.map((mol, i) => (
                  <motion.div
                    key={`p-${i}`}
                    className="bg-slate-800/60 backdrop-blur-sm border rounded-xl p-5 text-center transition-all"
                    style={{ borderColor: mol.color || '#f87171', color: mol.color || '#f87171' }}
                    animate={{
                      opacity: 0.15 + progressRatio * 0.9,
                      x: -progressRatio * 80,
                      scale: 0.92 + progressRatio * 0.08,
                    }}
                  >
                    <div className="text-3xl font-bold mb-2">{mol.formula}</div>
                    <div className="text-slate-300 mb-2">{mol.name}</div>
                    <div className="flex justify-center gap-6 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Atom size={14} /> {mol.electrons ?? '?'} e⁻
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap size={14} /> {mol.bonds ?? '?'} bonds
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-10 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'tween', duration: 0.15 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => jumpToStep(currentStep - 1)}
              disabled={currentStep <= 0}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition-colors"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={handlePlayPause}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-medium shadow-lg shadow-blue-900/30 transition-all"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={() => jumpToStep(currentStep + 1)}
              disabled={currentStep >= steps.length - 1}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition-colors"
            >
              <SkipForward size={20} />
            </button>

            <button
              onClick={handleReset}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    speed === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showElectronFlow}
                onChange={(e) => setShowElectronFlow(e.target.checked)}
                className="w-5 h-5 accent-indigo-500"
              />
              <span className="flex items-center gap-2 text-slate-300">
                <Eye size={18} /> Electron Flow
              </span>
            </label>
          </div>
        </div>

        {/* Steps timeline */}
        {steps.length > 1 && (
          <div className="p-6 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-4 justify-center">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToStep(idx)}
                  className={`flex-1 min-w-[180px] p-4 rounded-xl transition-all border ${
                    idx <= currentStep
                      ? 'bg-indigo-950/40 border-indigo-600/60'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                        idx <= currentStep
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="text-left">
                      <div className="font-medium text-slate-200">{step.title}</div>
                      {step.description && (
                        <div className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {step.description}
                        </div>
                      )}
                    </div>

                    {idx <= currentStep && (
                      <div className="ml-auto text-emerald-400 text-xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganicReactionVisualizer;