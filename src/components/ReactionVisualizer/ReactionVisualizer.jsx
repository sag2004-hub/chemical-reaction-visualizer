import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
  AlertCircle,
  FlaskConical,
  ArrowRight,
  Battery,
  Sparkles,
  AlertTriangle,
  Activity,
  Thermometer,
  Shield,
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
  const [expandedStep, setExpandedStep] = useState(null);

  // Default reaction structure
  const defaultReaction = {
    name: 'SN2 Nucleophilic Substitution',
    type: 'substitution',
    description: 'Backside attack mechanism with inversion of configuration',
    temperature: '25°C',
    solvent: 'DMF',
    compounds: { 
      reactants: [],
      intermediates: [],
      products: []
    },
    steps: [],
  };

  // Merge with provided reaction data
  const reactionData = useMemo(() => ({
    ...defaultReaction,
    ...reaction,
    compounds: {
      ...defaultReaction.compounds,
      ...reaction.compounds,
    },
    steps: reaction.steps?.length > 0 ? reaction.steps : defaultReaction.steps
  }), [reaction]);

  const {
    name,
    type,
    description,
    temperature,
    solvent,
    conditions,
    catalyst,
    energy,
    safety,
    applications,
    compounds,
    steps,
    mechanism,
  } = reactionData;

  // Smart intermediate detection based on reaction type
  const detectIntermediateStates = useMemo(() => {
    const baseCompounds = {
      ...compounds,
      intermediates: compounds.intermediates || []
    };

    // If intermediates are explicitly provided, use them
    if (baseCompounds.intermediates.length > 0) {
      return baseCompounds;
    }

    // Generate intermediates based on reaction type
    let generatedIntermediates = [];
    let intermediateColors = ['#c084fc', '#a855f7', '#9333ea'];

    switch(type?.toLowerCase()) {
      case 'substitution':
      case 'nucleophilic':
        generatedIntermediates = [
          {
            formula: '[Nu···C···LG]⁻',
            name: 'Transition State',
            description: 'Pentavalent transition state with partial bonds',
            electrons: 28,
            bonds: 5,
            formalCharge: -1,
            color: intermediateColors[0],
            lifetime: '10⁻¹³ s',
            geometry: 'Trigonal bipyramidal',
            stability: 'High energy, transient'
          }
        ];
        break;

      case 'elimination':
        generatedIntermediates = [
          {
            formula: '[B···H···C=C]',
            name: 'Beta-elimination intermediate',
            description: 'Proton transfer with developing double bond',
            electrons: 32,
            bonds: 4,
            formalCharge: 0,
            color: intermediateColors[1],
            lifetime: '10⁻¹² s',
            geometry: 'Planar',
            stability: 'Carbocation/carbanion intermediate'
          }
        ];
        break;

      case 'addition':
        generatedIntermediates = [
          {
            formula: '[C=C···Nu⁺]',
            name: 'Carbocation intermediate',
            description: 'Electrophilic addition intermediate',
            electrons: 24,
            bonds: 3,
            formalCharge: '+1',
            color: intermediateColors[2],
            lifetime: '10⁻¹¹ s',
            geometry: 'Trigonal planar',
            stability: 'Reactive carbocation'
          }
        ];
        break;

      case 'oxidation':
        generatedIntermediates = [
          {
            formula: '[C=O···O]',
            name: 'Peroxide intermediate',
            description: 'Oxygen insertion intermediate',
            electrons: 36,
            bonds: 4,
            formalCharge: 0,
            color: '#ef4444',
            lifetime: '10⁻¹⁰ s',
            geometry: 'Tetrahedral',
            stability: 'Unstable peroxide'
          }
        ];
        break;

      case 'reduction':
        generatedIntermediates = [
          {
            formula: '[C···H]⁻',
            name: 'Hydride complex',
            description: 'Metal-hydride reduction intermediate',
            electrons: 26,
            bonds: 3,
            formalCharge: -1,
            color: '#f59e0b',
            lifetime: '10⁻⁹ s',
            geometry: 'Linear',
            stability: 'Metal-bound intermediate'
          }
        ];
        break;

      case 'radical':
        generatedIntermediates = [
          {
            formula: 'R•',
            name: 'Free radical',
            description: 'Radical intermediate with unpaired electron',
            electrons: 17,
            bonds: 3,
            formalCharge: 0,
            color: '#ea580c',
            lifetime: '10⁻⁶ s',
            geometry: 'Planar',
            stability: 'Highly reactive radical'
          }
        ];
        break;

      case 'polymerization':
        generatedIntermediates = [
          {
            formula: '[R···C=C]•',
            name: 'Polymer radical',
            description: 'Growing polymer chain radical',
            electrons: 31,
            bonds: 4,
            formalCharge: 0,
            color: '#8b5cf6',
            lifetime: '10⁻³ s',
            geometry: 'Linear',
            stability: 'Chain propagation intermediate'
          }
        ];
        break;

      case 'condensation':
        generatedIntermediates = [
          {
            formula: '[C-OH···OR]',
            name: 'Tetrahedral intermediate',
            description: 'Nucleophilic addition intermediate',
            electrons: 40,
            bonds: 4,
            formalCharge: 0,
            color: '#10b981',
            lifetime: '10⁻⁸ s',
            geometry: 'Tetrahedral',
            stability: 'Reactive addition complex'
          }
        ];
        break;

      case 'coupling':
        generatedIntermediates = [
          {
            formula: '[R···R]',
            name: 'Dimeric intermediate',
            description: 'Radical coupling intermediate',
            electrons: 38,
            bonds: 1,
            formalCharge: 0,
            color: '#06b6d4',
            lifetime: '10⁻⁷ s',
            geometry: 'Linear',
            stability: 'Weakly bonded dimer'
          }
        ];
        break;

      case 'electrolytic':
        generatedIntermediates = [
          {
            formula: '[R-COO•]',
            name: 'Carboxyl radical',
            description: 'Anodic oxidation intermediate',
            electrons: 35,
            bonds: 3,
            formalCharge: 0,
            color: '#f97316',
            lifetime: '10⁻⁵ s',
            geometry: 'Planar',
            stability: 'Electrochemically generated radical'
          }
        ];
        break;

      case 'combustion':
        generatedIntermediates = [
          {
            formula: '[C···O₂]',
            name: 'Peroxyl radical',
            description: 'Combustion chain propagation intermediate',
            electrons: 34,
            bonds: 2,
            formalCharge: 0,
            color: '#f97316',
            lifetime: '10⁻⁶ s',
            geometry: 'Linear',
            stability: 'Highly reactive'
          }
        ];
        break;

      case 'hydrolysis':
        generatedIntermediates = [
          {
            formula: '[C-OH₂⁺]',
            name: 'Protonated intermediate',
            description: 'Water addition intermediate',
            electrons: 22,
            bonds: 4,
            formalCharge: '+1',
            color: '#3b82f6',
            lifetime: '10⁻⁹ s',
            geometry: 'Tetrahedral',
            stability: 'Acid-catalyzed intermediate'
          }
        ];
        break;

      default:
        generatedIntermediates = [
          {
            formula: '[Int]',
            name: 'Reactive Intermediate',
            description: 'Transition state or reactive species',
            electrons: 30,
            bonds: 3,
            formalCharge: 0,
            color: '#a855f7',
            lifetime: '10⁻¹² s',
            geometry: 'Variable',
            stability: 'Transient'
          }
        ];
    }

    return {
      ...baseCompounds,
      intermediates: generatedIntermediates
    };
  }, [compounds, type]);

  // Process compounds with smart defaults
  const compoundsWithDefaults = useMemo(() => {
    const processed = { ...detectIntermediateStates };
    
    ['reactants', 'intermediates', 'products'].forEach(category => {
      if (processed[category]) {
        processed[category] = processed[category].map((compound, idx) => {
          // Assign role based on position and category
          let role = compound.role;
          if (!role) {
            if (category === 'reactants') {
              role = idx === 0 ? 'Nucleophile' : 'Electrophile';
            } else if (category === 'products') {
              role = 'Product';
            } else if (category === 'intermediates') {
              role = 'Intermediate';
            }
          }

          // Assign electrons and bonds intelligently based on formula
          let electrons = compound.electrons;
          let bonds = compound.bonds;
          
          if (!electrons || !bonds) {
            // Simple heuristic based on molecular size
            const formula = compound.formula || '';
            const charCount = formula.replace(/[^A-Za-z]/g, '').length;
            electrons = compound.electrons || Math.max(8, charCount * 4 + Math.floor(Math.random() * 10));
            bonds = compound.bonds || Math.max(2, Math.floor(charCount * 1.5));
          }

          // Assign color if not present
          const colors = {
            reactants: ['#60a5fa', '#3b82f6', '#2563eb'],
            intermediates: ['#c084fc', '#a855f7', '#9333ea'],
            products: ['#10b981', '#059669', '#047857']
          };

          return {
            formula: compound.formula || 'Unknown',
            name: compound.name || `Compound ${idx + 1}`,
            role,
            electrons,
            bonds,
            formalCharge: compound.formalCharge || 0,
            lonePairs: compound.lonePairs || Math.floor(Math.random() * 3),
            color: compound.color || colors[category]?.[idx % colors[category].length] || '#6b7280',
            hybridization: compound.hybridization || 'sp³',
            geometry: compound.geometry || 'Tetrahedral',
            stability: compound.stability || 'Stable',
            lifetime: compound.lifetime,
            description: compound.description,
            ...compound
          };
        });
      } else {
        processed[category] = [];
      }
    });
    
    return processed;
  }, [detectIntermediateStates]);

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
      Math.floor((progress / 100) * steps.length)
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
    setExpandedStep(null);
  };

  const jumpToStep = (stepIndex) => {
    if (steps.length <= 1) return;
    const target = (stepIndex / (steps.length - 1)) * 100;
    setProgress(Math.min(100, Math.max(0, target)));
  };

  // Smart intermediate detection logic
  const shouldShowIntermediate = useMemo(() => {
    // Always show if explicitly provided
    if (compoundsWithDefaults.intermediates?.length > 0) {
      // Show intermediate based on reaction progress
      return progressRatio > 0.2 && progressRatio < 0.8;
    }
    
    // For specific reaction types, show intermediates at certain progress
    const showTypes = [
      'substitution', 'elimination', 'addition', 'oxidation', 
      'reduction', 'radical', 'condensation', 'polymerization'
    ];
    
    if (showTypes.includes(type?.toLowerCase())) {
      return progressRatio > 0.3 && progressRatio < 0.7;
    }
    
    return false;
  }, [progressRatio, compoundsWithDefaults.intermediates, type]);

  const typeStyles = {
    substitution: 'bg-blue-950/40 border-blue-500 text-blue-300',
    elimination: 'bg-purple-950/40 border-purple-500 text-purple-300',
    addition: 'bg-emerald-950/40 border-emerald-500 text-emerald-300',
    oxidation: 'bg-red-950/40 border-red-500 text-red-300',
    reduction: 'bg-amber-950/40 border-amber-500 text-amber-300',
    rearrangement: 'bg-cyan-950/40 border-cyan-500 text-cyan-300',
    acidbase: 'bg-pink-950/40 border-pink-500 text-pink-300',
    radical: 'bg-orange-950/40 border-orange-500 text-orange-300',
    redox: 'bg-violet-950/40 border-violet-500 text-violet-300',
    polymerization: 'bg-indigo-950/40 border-indigo-500 text-indigo-300',
    condensation: 'bg-teal-950/40 border-teal-500 text-teal-300',
    coupling: 'bg-sky-950/40 border-sky-500 text-sky-300',
    electrolytic: 'bg-rose-950/40 border-rose-500 text-rose-300',
    combustion: 'bg-orange-950/40 border-orange-500 text-orange-300',
    formylation: 'bg-lime-950/40 border-lime-500 text-lime-300',
    halogenation: 'bg-amber-950/40 border-amber-500 text-amber-300',
    hydrolysis: 'bg-blue-950/40 border-blue-500 text-blue-300',
    test: 'bg-gray-950/40 border-gray-500 text-gray-300',
  }[type?.toLowerCase()] || 'bg-gray-800/40 border-gray-600 text-gray-300';

  // Get current step data
  const currentStepData = steps[currentStep] || { 
    title: 'Reaction in Progress', 
    description: description || 'Chemical transformation occurring' 
  };

  // Get bond changes for current step - smart detection
  const getBondChanges = () => {
    if (!currentStepData) return { breaking: [], forming: [] };
    
    // Check if bond changes are explicitly defined
    if (currentStepData.bondBreaking || currentStepData.bondForming) {
      const breaking = Array.isArray(currentStepData.bondBreaking) 
        ? currentStepData.bondBreaking 
        : currentStepData.bondBreaking ? [currentStepData.bondBreaking] : [];
      
      const forming = Array.isArray(currentStepData.bondForming) 
        ? currentStepData.bondForming 
        : currentStepData.bondForming ? [currentStepData.bondForming] : [];
      
      return { breaking, forming };
    }

    // Generate bond changes based on reaction type
    let breaking = [];
    let forming = [];
    
    switch(type?.toLowerCase()) {
      case 'substitution':
        breaking = [{ atoms: ['C', 'LG'], electrons: 2, type: 'heterolytic', description: 'Leaving group departure' }];
        forming = [{ atoms: ['Nu', 'C'], electrons: 2, type: 'covalent', description: 'Nucleophile attack' }];
        break;
      case 'addition':
        forming = [{ atoms: ['C', 'Nu'], electrons: 2, type: 'covalent', description: 'Electrophile addition' }];
        break;
      case 'elimination':
        breaking = [{ atoms: ['C-H', 'C-LG'], electrons: 2, type: 'concerted', description: 'Proton and leaving group removal' }];
        forming = [{ atoms: ['C', 'C'], electrons: 2, type: 'pi', description: 'Double bond formation' }];
        break;
      case 'oxidation':
        breaking = [{ atoms: ['C-H'], electrons: 2, type: 'oxidative', description: 'Hydrogen removal' }];
        forming = [{ atoms: ['C', 'O'], electrons: 2, type: 'covalent', description: 'Oxygen insertion' }];
        break;
      case 'reduction':
        breaking = [{ atoms: ['C=O'], electrons: 2, type: 'reductive', description: 'Carbonyl reduction' }];
        forming = [{ atoms: ['C', 'H'], electrons: 2, type: 'covalent', description: 'Hydride addition' }];
        break;
      case 'polymerization':
        forming = [{ atoms: ['R', 'C'], electrons: 1, type: 'radical', description: 'Chain propagation' }];
        break;
      case 'combustion':
        breaking = [{ atoms: ['C-H', 'O=O'], electrons: 4, type: 'oxidative', description: 'Fuel-oxygen bond breaking' }];
        forming = [{ atoms: ['C=O', 'O-H'], electrons: 4, type: 'covalent', description: 'CO₂ and H₂O formation' }];
        break;
      case 'hydrolysis':
        breaking = [{ atoms: ['C-OR'], electrons: 2, type: 'heterolytic', description: 'Ester bond cleavage' }];
        forming = [{ atoms: ['C-OH', 'ROH'], electrons: 2, type: 'covalent', description: 'Water addition products' }];
        break;
      default:
        // Generic bond changes for progress visualization
        if (progressRatio > 0.3 && progressRatio < 0.7) {
          breaking = [{ atoms: ['Reactant'], electrons: 2, type: 'cleavage', description: 'Bond breaking in progress' }];
        }
        if (progressRatio > 0.5) {
          forming = [{ atoms: ['Product'], electrons: 2, type: 'formation', description: 'New bond formation' }];
        }
    }
    
    return { breaking, forming };
  };

  const { breaking: breakingBonds, forming: formingBonds } = getBondChanges();

  // Calculate molecular properties for visualization
  const getMolecularProperties = () => {
    const props = {
      totalElectrons: 0,
      totalBonds: 0,
      formalCharges: [],
      oxidationStates: [],
    };
    
    // Add reactants (scaled by disappearance)
    compoundsWithDefaults.reactants.forEach(mol => {
      const scale = 1 - progressRatio;
      props.totalElectrons += mol.electrons * scale;
      props.totalBonds += mol.bonds * scale;
      if (mol.formalCharge !== 0) {
        props.formalCharges.push({ value: mol.formalCharge, name: mol.name });
      }
    });
    
    // Add intermediates (scaled by bell curve for natural appearance)
    if (compoundsWithDefaults.intermediates && shouldShowIntermediate) {
      const intermediateScale = Math.sin(progressRatio * Math.PI);
      compoundsWithDefaults.intermediates.forEach(mol => {
        props.totalElectrons += mol.electrons * intermediateScale;
        props.totalBonds += mol.bonds * intermediateScale;
        if (mol.formalCharge !== 0) {
          props.formalCharges.push({ value: mol.formalCharge, name: mol.name });
        }
      });
    }
    
    // Add products (scaled by appearance)
    compoundsWithDefaults.products.forEach(mol => {
      const scale = progressRatio;
      props.totalElectrons += mol.electrons * scale;
      props.totalBonds += mol.bonds * scale;
      if (mol.formalCharge !== 0) {
        props.formalCharges.push({ value: mol.formalCharge, name: mol.name });
      }
    });
    
    return props;
  };

  const molecularProperties = getMolecularProperties();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        
        {/* Reaction Info Bar */}

        {/* Main visualization */}
        <div className="relative  lg:p-1">
          
          {/* Bond Breaking & Forming Dashboard */}
          <div className="mb-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Bond Breaking */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-medium">
                  <AlertTriangle size={18} />
                  <span>Bonds Breaking</span>
                  {breakingBonds.length > 0 && (
                    <span className="ml-auto text-xs bg-red-900/40 px-2 py-1 rounded">
                      {breakingBonds.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {breakingBonds.map((bond, idx) => (
                    <motion.div
                      key={`break-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm p-3 bg-red-900/20 border border-red-700/30 rounded-lg"
                    >
                      <div className="font-medium text-red-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        {bond.atoms?.join('–') || 'Chemical Bond'} breaks
                      </div>
                      <div className="text-red-400 text-xs mt-2">
                        <div className="flex items-center gap-2">
                          <Zap size={12} />
                          <span>{bond.electrons || 2} electron{bond.electrons !== 1 ? 's' : ''} released</span>
                        </div>
                        {bond.type && (
                          <div className="mt-1">Type: {bond.type}</div>
                        )}
                      </div>
                      {bond.description && (
                        <div className="text-red-400/80 text-xs mt-2 italic">{bond.description}</div>
                      )}
                    </motion.div>
                  ))}
                  {breakingBonds.length === 0 && (
                    <div className="text-slate-500 text-sm italic p-3 text-center">No bonds breaking in this phase</div>
                  )}
                </div>
              </div>

              {/* Bond Forming */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Sparkles size={18} />
                  <span>Bonds Forming</span>
                  {formingBonds.length > 0 && (
                    <span className="ml-auto text-xs bg-emerald-900/40 px-2 py-1 rounded">
                      {formingBonds.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {formingBonds.map((bond, idx) => (
                    <motion.div
                      key={`form-${idx}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg"
                    >
                      <div className="font-medium text-emerald-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        {bond.atoms?.join('–') || 'Chemical Bond'} forms
                      </div>
                      <div className="text-emerald-400 text-xs mt-2">
                        <div className="flex items-center gap-2">
                          <Zap size={12} />
                          <span>{bond.electrons || 2} electron{bond.electrons !== 1 ? 's' : ''} shared</span>
                        </div>
                        {bond.type && (
                          <div className="mt-1">Type: {bond.type}</div>
                        )}
                      </div>
                      {bond.description && (
                        <div className="text-emerald-400/80 text-xs mt-2 italic">{bond.description}</div>
                      )}
                    </motion.div>
                  ))}
                  {formingBonds.length === 0 && (
                    <div className="text-slate-500 text-sm italic p-3 text-center">No bonds forming in this phase</div>
                  )}
                </div>
              </div>
            </div>

            {/* Molecular Properties */}
            <div className="pt-0.2 border-t border-slate-700/30 mt-0.5">
              <div className="flex flex-wrap gap-2 justify-center">
                <div className="flex items-center gap-2 text-slate-300">
                  <Atom size={16} />
                  <span className="text-sm">Total electrons: </span>
                  <span className="font-bold text-blue-300">
                    {Math.round(molecularProperties.totalElectrons)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Zap size={16} />
                  <span className="text-sm">Total bonds: </span>
                  <span className="font-bold text-emerald-300">
                    {Math.round(molecularProperties.totalBonds)}
                  </span>
                </div>
                {molecularProperties.formalCharges.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Battery size={16} />
                    <span className="text-sm">Formal charges: </span>
                    <div className="flex gap-1">
                      {molecularProperties.formalCharges.map((fc, idx) => (
                        <span 
                          key={`fc-${idx}`}
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            fc.value > 0 ? 'bg-red-900/40 text-red-300' :
                            fc.value < 0 ? 'bg-blue-900/40 text-blue-300' :
                            'bg-slate-700/40 text-slate-300'
                          }`}
                        >
                          {fc.name}: {fc.value > 0 ? '+' : ''}{fc.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Molecular Visualization */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative min-h-[160px]">
            
            {/* Reactants */}
            <div className="w-full lg:w-5/12 space-y-6">
              <div className="flex items-center gap-3 text-slate-400 font-medium mb-4">
                <Target size={20} />
                <span>Reactants</span>
                <div className="ml-auto text-xs bg-slate-800 px-2 py-1 rounded">
                  {compoundsWithDefaults.reactants.reduce((sum, mol) => sum + mol.electrons, 0)} e⁻
                </div>
              </div>

              <div className="space-y-5">
                {compoundsWithDefaults.reactants.map((mol, i) => (
                  <motion.div
                    key={`r-${i}`}
                    className="bg-slate-800/60 border-2 rounded-xl p-5 text-center relative overflow-hidden group hover:scale-[1.02] transition-transform"
                    style={{ 
                      borderColor: mol.color || '#60a5fa',
                      boxShadow: `0 0 20px ${(mol.color || '#60a5fa')}20`
                    }}
                    animate={{
                      opacity: 1 - progressRatio * 0.65,
                      x: progressRatio * 60,
                      scale: 1 - progressRatio * 0.08,
                    }}
                  >
                    {/* Electron cloud */}
                    {showElectronFlow && mol.electrons > 0 && (
                      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                        {[...Array(Math.min(8, Math.floor(mol.electrons / 3)))].map((_, idx) => (
                          <motion.div
                            key={`e-r-${i}-${idx}`}
                            className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-sm"
                            initial={{ 
                              x: Math.random() * 100, 
                              y: Math.random() * 100,
                              opacity: 0.4
                            }}
                            animate={{
                              x: [null, Math.random() * 100],
                              y: [null, Math.random() * 100],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: idx * 0.2
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className="text-3xl font-bold mb-2" style={{ color: mol.color || '#60a5fa' }}>
                        {mol.formula}
                      </div>
                      <div className="text-slate-300 mb-2 font-medium">{mol.name}</div>
                      
                      {mol.role && (
                        <div className="inline-block px-3 py-1 bg-slate-700/60 rounded-full text-xs uppercase tracking-wide mb-3 border border-slate-600">
                          {mol.role}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-blue-300 bg-slate-800/50 px-2 py-1 rounded">
                          <Atom size={14} /> {mol.electrons} e⁻
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-300 bg-slate-800/50 px-2 py-1 rounded">
                          <Zap size={14} /> {mol.bonds} bonds
                        </div>
                        {mol.formalCharge !== 0 && (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${
                            mol.formalCharge > 0 ? 'bg-red-900/30 text-red-300' : 'bg-blue-900/30 text-blue-300'
                          }`}>
                            <Battery size={14} />
                            {mol.formalCharge > 0 ? '+' : ''}{mol.formalCharge}
                          </div>
                        )}
                        {mol.lonePairs > 0 && (
                          <div className="flex items-center gap-1.5 text-yellow-300 bg-slate-800/50 px-2 py-1 rounded">
                            <Shield size={14} />
                            {mol.lonePairs} LP
                          </div>
                        )}
                      </div>
                      
                      {mol.hybridization && (
                        <div className="mt-3 text-xs text-slate-400">
                          Hybridization: <span className="text-slate-300">{mol.hybridization}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reaction Arrow & Animation Area */}
            <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: isPlaying ? [1, 1.15, 1] : 1,
                  rotate: isPlaying ? [0, 2, -2, 0] : 0
                }}
                transition={{ 
                  duration: 1.8, 
                  repeat: isPlaying ? Infinity : 0,
                }}
                className="text-blue-400 relative"
              >
                <ChevronRight size={80} strokeWidth={2.5} />
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              </motion.div>

              {/* Electron flow animation */}
              {showElectronFlow && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(3)].map((_, idx) => (
                    <motion.div
                      key={`arrow-e-${idx}`}
                      className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-sm"
                      initial={{ x: '-150%', y: Math.random() * 20 - 10, opacity: 0 }}
                      animate={{ x: '250%', opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 4 / speed,
                        repeat: isPlaying ? Infinity : 0,
                        delay: idx * 0.3,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Bond breaking indicator */}
              {breakingBonds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2"
                >
                  <div className="bg-red-900/80 text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-700/60 whitespace-nowrap">
                    <AlertTriangle size={14} className="inline mr-2" />
                    Bond Breaking
                  </div>
                </motion.div>
              )}

              {/* Bond forming indicator */}
              {formingBonds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2"
                >
                  <div className="bg-emerald-900/80 text-emerald-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-700/60 whitespace-nowrap">
                    <Sparkles size={14} className="inline mr-2" />
                    Bond Forming
                  </div>
                </motion.div>
              )}
            </div>

            {/* Dynamic Intermediate Display */}
            <AnimatePresence>
              {shouldShowIntermediate && compoundsWithDefaults.intermediates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7, y: 20 }}
                  className="absolute lg:static inset-x-4 top-1/2 -translate-y-1/2 z-10 lg:translate-y-0"
                >
                  <div className="bg-gradient-to-b from-purple-950/30 to-violet-900/20 border border-purple-700/50 rounded-2xl p-2 text-center shadow-2xl shadow-purple-900/30">
                    <div className="flex items-center justify-center gap-1 text-purple-300 font-small mb-4">
                      <AlertCircle size={10} />
                      <span>Reaction Intermediate</span>
                      <div className="text-xs bg-purple-900/40 px-1 py-0.5 rounded text-purple-300">
                        {compoundsWithDefaults.intermediates.reduce((sum, mol) => sum + mol.electrons, 0)} e⁻
                      </div>
                    </div>

                    {compoundsWithDefaults.intermediates.map((mol, i) => (
                      <motion.div
                        key={`i-${i}`}
                        className="bg-slate-900/80 border-2 rounded-xl p-2 relative overflow-hidden"
                        style={{
                          borderColor: mol.color || '#c084fc',
                          boxShadow: '0 0 30px rgba(168,85,247,0.4)',
                        }}
                        animate={{
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            '0 0 30px rgba(168,85,247,0.4)',
                            '0 0 40px rgba(168,85,247,0.6)',
                            '0 0 30px rgba(168,85,247,0.4)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="relative z-10">
                          <div className="text-3xl font-bold mb-2 text-purple-300">
                            {mol.formula}
                          </div>
                          <div className="text-purple-200 mb-3 font-medium">{mol.name}</div>
                          
                          <div className="flex flex-wrap justify-center gap-3 text-sm mb-4">
                            <div className="flex items-center gap-1.5 text-purple-300 bg-purple-900/30 px-2 py-1 rounded">
                              <Atom size={14} /> {mol.electrons} e⁻
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded">
                              <Zap size={14} /> {mol.bonds} bonds
                            </div>
                            {mol.formalCharge !== 0 && (
                              <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${
                                mol.formalCharge > 0 ? 'bg-red-900/30 text-red-300' : 'bg-blue-900/30 text-blue-300'
                              }`}>
                                <Battery size={14} />
                                {mol.formalCharge > 0 ? '+' : ''}{mol.formalCharge}
                              </div>
                            )}
                          </div>
                          
                          {mol.description && (
                            <div className="text-sm text-purple-300/80 italic border-t border-purple-700/30 pt-3">
                              {mol.description}
                            </div>
                          )}
                          
                          {mol.lifetime && (
                            <div className="mt-3 text-xs text-purple-400">
                              Lifetime: {mol.lifetime}
                            </div>
                          )}
                          
                          {mol.geometry && (
                            <div className="mt-2 text-xs text-purple-400/70">
                              Geometry: {mol.geometry}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products */}
            <div className="w-full lg:w-5/12 space-y-6">
              <div className="flex items-center gap-3 text-slate-400 font-medium mb-4 justify-end">
                <div className="text-xs bg-slate-800 px-2 py-1 rounded">
                  {compoundsWithDefaults.products.reduce((sum, mol) => sum + mol.electrons, 0)} e⁻
                </div>
                <span>Products</span>
                <FlaskConical size={20} />
              </div>

              <div className="space-y-5">
                {compoundsWithDefaults.products.map((mol, i) => (
                  <motion.div
                    key={`p-${i}`}
                    className="bg-slate-800/60 border-2 rounded-xl p-5 text-center relative overflow-hidden group hover:scale-[1.02] transition-transform"
                    style={{ 
                      borderColor: mol.color || '#34d399',
                      boxShadow: `0 0 20px ${(mol.color || '#34d399')}20`
                    }}
                    animate={{
                      opacity: 0.15 + progressRatio * 0.9,
                      x: -progressRatio * 60,
                      scale: 0.92 + progressRatio * 0.08,
                    }}
                  >
                    <div className="relative z-10">
                      <div className="text-3xl font-bold mb-2" style={{ color: mol.color || '#34d399' }}>
                        {mol.formula}
                      </div>
                      <div className="text-slate-300 mb-2 font-medium">{mol.name}</div>
                      
                      <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-emerald-300 bg-slate-800/50 px-2 py-1 rounded">
                          <Atom size={14} /> {mol.electrons} e⁻
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-300 bg-slate-800/50 px-2 py-1 rounded">
                          <Zap size={14} /> {mol.bonds} bonds
                        </div>
                        {mol.formalCharge !== 0 && (
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${
                            mol.formalCharge > 0 ? 'bg-red-900/30 text-red-300' : 'bg-blue-900/30 text-blue-300'
                          }`}>
                            <Battery size={14} />
                            {mol.formalCharge > 0 ? '+' : ''}{mol.formalCharge}
                          </div>
                        )}
                      </div>
                      
                      {mol.stability && (
                        <div className="mt-3 text-xs text-slate-400">
                          Stability: <span className="text-emerald-300">{mol.stability}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span className="flex items-center gap-2">
                <Target size={14} />
                Reactants
              </span>
              <span className="text-slate-300 font-medium">{Math.round(progress)}% Complete</span>
              <span className="flex items-center gap-2">
                Products
                <FlaskConical size={14} />
              </span>
            </div>
            
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
                animate={{ width: `${progress}%` }}
                transition={{ type: 'tween', duration: 0.15 }}
              />
              
              {/* Intermediate marker */}
              {shouldShowIntermediate && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-lg"
                  style={{ left: '50%' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 md:p-6 border-t border-slate-700/50 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => jumpToStep(currentStep - 1)}
              disabled={currentStep <= 0}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition-colors"
              title="Previous Step"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={handlePlayPause}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-medium shadow-lg shadow-blue-900/30 transition-all"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => jumpToStep(currentStep + 1)}
              disabled={currentStep >= steps.length - 1}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition-colors"
              title="Next Step"
            >
              <SkipForward size={20} />
            </button>

            <button
              onClick={handleReset}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors hover:bg-red-900/30"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Speed:</span>
              {[0.5, 1, 2, 4].map((s) => (
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
                className="w-5 h-5 accent-indigo-500 rounded"
              />
              <span className="flex items-center gap-2 text-slate-300">
                <Zap size={16} /> Electron Flow
              </span>
            </label>
          </div>
        </div>

        {/* Reaction Details */}
<div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
              <Activity size={20} />
              Reaction Details
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Mechanism */}
              <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  <h4 className="text-sm text-slate-400 mb-2 font-medium">Reaction Mechanism</h4>
                  <p className="text-slate-300">
                    {description || currentStepData.description || 'Chemical transformation process'}
                  </p>
                  {mechanism && (
                    <div className="mt-3 p-3 bg-slate-950/50 rounded border border-slate-700/30">
                      <div className="text-sm text-slate-400 mb-1">Mechanism:</div>
                      <div className="text-slate-200 font-mono">{mechanism}</div>
                    </div>
                  )}
                </div>
                
                {conditions && (
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
                    <h4 className="text-sm text-blue-300 font-medium mb-2">Reaction Conditions</h4>
                    <p className="text-blue-200 text-sm">{conditions}</p>
                  </div>
                )}
              </div>
              
              {/* Middle Column - Energy & Safety */}
              <div className="space-y-4">
                {energy && (
                  <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/30">
                    <h4 className="text-sm text-amber-300 font-medium mb-2">Energy Profile</h4>
                    <p className="text-amber-200 text-sm">{energy}</p>
                  </div>
                )}
                
                {safety && (
                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/30">
                    <h4 className="text-sm text-red-300 font-medium mb-2">Safety Information</h4>
                    <p className="text-red-200 text-sm">{safety}</p>
                  </div>
                )}
                
                {solvent && (
                  <div className="bg-teal-900/20 p-4 rounded-lg border border-teal-700/30">
                    <h4 className="text-sm text-teal-300 font-medium mb-2">Solvent System</h4>
                    <p className="text-teal-200 text-sm">{solvent}</p>
                  </div>
                )}
              </div>
              
              {/* Right Column - Applications */}
              <div className="space-y-4">
                {applications && (
                  <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-700/30">
                    <h4 className="text-sm text-emerald-300 font-medium mb-2">Applications</h4>
                    {Array.isArray(applications) ? (
                      <ul className="space-y-1">
                        {applications.map((app, idx) => (
                          <li key={idx} className="text-emerald-200 text-sm">• {app}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-emerald-200 text-sm">{applications}</p>
                    )}
                  </div>
                )}
                
                {/* Electron Conservation */}
                <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30">
                  <h4 className="text-sm text-indigo-300 font-medium mb-2">Electron Conservation</h4>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="text-blue-300 text-sm">
                        Reactants: {compoundsWithDefaults.reactants.reduce((sum, mol) => sum + mol.electrons, 0)} e⁻
                      </div>
                      <ArrowRight size={16} className="text-slate-500" />
                      <div className="text-emerald-300 text-sm">
                        Products: {compoundsWithDefaults.products.reduce((sum, mol) => sum + mol.electrons, 0)} e⁻
                      </div>
                    </div>
                    <div className="text-xs text-emerald-500 font-medium">
                      ✓ Electrons conserved throughout reaction
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reaction Summary */}
        <div className="p-6 border-t border-slate-700/50 bg-gradient-to-b from-slate-900/40 to-slate-950/60">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-900/20 to-blue-950/20 rounded-xl border border-blue-700/30">
              <div className="text-2xl font-bold text-blue-400">
                {compoundsWithDefaults.reactants.length}
              </div>
              <div className="text-sm text-slate-400 mt-1">Reactants</div>
              <div className="text-xs text-blue-300/70 mt-2">
                {compoundsWithDefaults.reactants.map(r => r.formula).join(' + ') || 'None'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-900/20 to-purple-950/20 rounded-xl border border-purple-700/30">
              <div className="text-2xl font-bold text-purple-400">
                {compoundsWithDefaults.intermediates?.length || 0}
              </div>
              <div className="text-sm text-slate-400 mt-1">Intermediates</div>
              <div className="text-xs text-purple-300/70 mt-2">
                {compoundsWithDefaults.intermediates?.[0]?.formula || 'Auto-detected'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 rounded-xl border border-emerald-700/30">
              <div className="text-2xl font-bold text-emerald-400">
                {compoundsWithDefaults.products.length}
              </div>
              <div className="text-sm text-slate-400 mt-1">Products</div>
              <div className="text-xs text-emerald-300/70 mt-2">
                {compoundsWithDefaults.products.map(p => p.formula).join(' + ') || 'None'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-900/20 to-amber-950/20 rounded-xl border border-amber-700/30">
              <div className="text-2xl font-bold text-amber-400">
                {steps.length || 1}
              </div>
              <div className="text-sm text-slate-400 mt-1">Mechanism Steps</div>
              <div className="text-xs text-amber-300/70 mt-2">
                {type} mechanism
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganicReactionVisualizer;