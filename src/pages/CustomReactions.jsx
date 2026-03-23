import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, FlaskConical, Save, Trash2, Edit, Eye, 
  Sparkles, ChevronRight, Atom, Zap, Target, Flame,
  Plus, Minus, ArrowRight, X, Check, Play, Pause,
  Copy, Download, Upload, RefreshCw, Beaker, 
  CircleDot, Orbit, Sigma, Binary, AlertTriangle,
  Search, Filter, Clock, Thermometer, Wind, Activity,
  Maximize2, Minimize2, RotateCw, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function CustomReactions() {
  const [customReactions, setCustomReactions] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingReaction, setEditingReaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [visualizationMode, setVisualizationMode] = useState('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load saved reactions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customReactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCustomReactions(parsed);
      if (parsed.length > 0) {
        setSelectedReaction(parsed[0]);
      }
    } else {
      // Load default reactions
      const defaultReactions = getDefaultReactions();
      setCustomReactions(defaultReactions);
      setSelectedReaction(defaultReactions[0]);
    }
  }, []);

  // Save reactions to localStorage
  useEffect(() => {
    if (customReactions.length > 0) {
      localStorage.setItem('customReactions', JSON.stringify(customReactions));
    }
  }, [customReactions]);

  const getDefaultReactions = () => [
    {
      id: 'default1',
      name: 'Combustion of Methane',
      description: 'Methane burns in oxygen to produce carbon dioxide and water, releasing energy.',
      reactants: ['CH4', '2O2'],
      products: ['CO2', '2H2O'],
      conditions: 'Heat, Spark',
      type: 'combustion',
      energyChange: -890,
      color: '#fbbf24',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    {
      id: 'default2',
      name: 'Photosynthesis',
      description: 'Plants convert carbon dioxide and water into glucose and oxygen using sunlight.',
      reactants: ['6CO2', '6H2O'],
      products: ['C6H12O6', '6O2'],
      conditions: 'Sunlight, Chlorophyll',
      type: 'synthesis',
      energyChange: 2870,
      color: '#34d399',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    {
      id: 'default3',
      name: 'Neutralization of HCl and NaOH',
      description: 'Hydrochloric acid reacts with sodium hydroxide to form sodium chloride and water.',
      reactants: ['HCl', 'NaOH'],
      products: ['NaCl', 'H2O'],
      conditions: 'Room Temperature',
      type: 'acidbase',
      energyChange: -57,
      color: '#f97316',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    {
      id: 'default4',
      name: 'Electrolysis of Water',
      description: 'Water decomposes into hydrogen and oxygen gases when an electric current passes through.',
      reactants: ['2H2O'],
      products: ['2H2', 'O2'],
      conditions: 'Electric Current',
      type: 'decomposition',
      energyChange: 286,
      color: '#f87171',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    {
      id: 'default5',
      name: 'Iron Rusting',
      description: 'Iron reacts with oxygen and water to form iron oxide (rust).',
      reactants: ['4Fe', '3O2', '2H2O'],
      products: ['2Fe2O3·H2O'],
      conditions: 'Oxygen, Moisture',
      type: 'redox',
      energyChange: -1648,
      color: '#c084fc',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  ];

  const handleSaveReaction = (reaction) => {
    if (editingReaction) {
      setCustomReactions(prev => 
        prev.map(r => r.id === reaction.id ? { ...reaction, lastModified: new Date().toISOString() } : r)
      );
      setEditingReaction(null);
    } else {
      const newReaction = {
        ...reaction,
        id: Date.now().toString(),
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        energyChange: reaction.energyChange || 0,
        color: reaction.color || '#a78bfa'
      };
      setCustomReactions(prev => [...prev, newReaction]);
      setSelectedReaction(newReaction);
    }
    setShowEditor(false);
  };

  const handleEditReaction = (reaction) => {
    setEditingReaction(reaction);
    setShowEditor(true);
  };

  const handleDeleteReaction = (id) => {
    if (window.confirm('Are you sure you want to delete this reaction?')) {
      const updated = customReactions.filter(r => r.id !== id);
      setCustomReactions(updated);
      if (selectedReaction?.id === id) {
        setSelectedReaction(updated[0] || null);
      }
    }
  };

  const handleDuplicateReaction = (reaction) => {
    const duplicated = {
      ...reaction,
      id: Date.now().toString(),
      name: `${reaction.name} (Copy)`,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setCustomReactions(prev => [...prev, duplicated]);
  };

  const exportReactions = () => {
    const dataStr = JSON.stringify(customReactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'custom-reactions.json');
    linkElement.click();
  };

  const importReactions = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setCustomReactions(prev => [...prev, ...imported]);
        } catch (error) {
          alert('Error importing reactions. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredReactions = customReactions.filter(reaction => {
    const matchesSearch = reaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reaction.reactants?.some(r => r.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         reaction.products?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || reaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  const typeColors = {
    synthesis: '#34d399',
    decomposition: '#f87171',
    displacement: '#60a5fa',
    redox: '#c084fc',
    combustion: '#fbbf24',
    acidbase: '#f97316',
    custom: '#a78bfa',
    all: '#818cf8'
  };

  const getTypeIcon = (type) => {
    const icons = {
      synthesis: <Plus size={16} />,
      decomposition: <Minus size={16} />,
      displacement: <Target size={16} />,
      redox: <Zap size={16} />,
      combustion: <Flame size={16} />,
      acidbase: <AlertTriangle size={16} />,
      custom: <Beaker size={16} />
    };
    return icons[type] || <Atom size={16} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  };

  return (
    <motion.div 
      className="custom-reactions"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 30% 20%, #0f172a 0%, #020617 70%)',
        color: '#f1f5f9',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: `rgba(139, 92, 246, ${Math.random() * 0.2 + 0.1})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
        }}
        variants={itemVariants}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <motion.div 
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)'
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <FlaskConical size={26} />
          </motion.div>
          
          <div>
            <motion.h1 
              style={{
                fontSize: '1.9rem',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #c4b5fd, #a78bfa, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Custom Reaction Builder
            </motion.h1>
            <motion.p 
              style={{ fontSize: '0.95rem', color: '#cbd5e1', marginTop: '0.4rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create, visualize, and save your own chemical reactions
            </motion.p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Import/Export buttons */}
          <motion.button
            onClick={exportReactions}
            style={{
              padding: '0.9rem',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: '#cbd5e1'
            }}
            whileHover={{ scale: 1.05, borderColor: '#a78bfa' }}
            whileTap={{ scale: 0.98 }}
            title="Export reactions"
          >
            <Download size={18} />
          </motion.button>
          
          <label style={{ cursor: 'pointer' }}>
            <motion.div
              style={{
                padding: '0.9rem',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                color: '#cbd5e1'
              }}
              whileHover={{ scale: 1.05, borderColor: '#a78bfa' }}
              whileTap={{ scale: 0.98 }}
              title="Import reactions"
            >
              <Upload size={18} />
            </motion.div>
            <input
              type="file"
              accept=".json"
              onChange={importReactions}
              style={{ display: 'none' }}
            />
          </label>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              color="#94a3b8"
              style={{ 
                position: 'absolute', 
                left: 16, 
                top: '50%', 
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
            />
            <motion.input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reactions..."
              style={{
                padding: '0.9rem 1.5rem 0.9rem 3.2rem',
                width: '280px',
                border: `2px solid ${searchTerm ? '#a78bfa' : 'rgba(139, 92, 246, 0.2)'}`,
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.6)',
                outline: 'none',
                color: 'white',
                fontSize: '0.95rem'
              }}
              whileFocus={{ 
                scale: 1.02,
                borderColor: '#a78bfa',
                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)'
              }}
            />
          </div>
        </div>
      </motion.header>

      <main style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Stats Banner */}
        <motion.div 
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            backdropFilter: 'blur(12px)',
            padding: '2rem',
            marginBottom: '2rem'
          }}
          variants={itemVariants}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <PlusCircle size={28} color="#a78bfa" />
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
                  Reaction Studio
                </h2>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>
                Build any chemical reaction by selecting reactants, products, and conditions
              </p>
            </div>
            <motion.button
              onClick={() => {
                setEditingReaction(null);
                setShowEditor(true);
              }}
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                border: 'none',
                borderRadius: '14px',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle size={20} />
              Create New Reaction
            </motion.button>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <div style={{
              background: `${typeColors.custom}15`,
              border: `2px solid ${typeColors.custom}40`,
              borderRadius: '20px',
              padding: '0.7rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Sparkles size={16} color="#a78bfa" />
              <span>{customReactions.length} Total Reactions</span>
            </div>
            <div style={{
              background: 'rgba(96, 165, 250, 0.15)',
              border: '2px solid rgba(96, 165, 250, 0.4)',
              borderRadius: '20px',
              padding: '0.7rem 1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Activity size={16} color="#60a5fa" />
              <span>{filteredReactions.length} Available</span>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          {/* Reactions List */}
          <motion.div 
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              backdropFilter: 'blur(12px)',
              padding: '2rem'
            }}
            variants={itemVariants}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Save size={22} color="#a78bfa" />
                Saved Reactions ({filteredReactions.length})
              </h3>
              {/* Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="synthesis">Synthesis</option>
                  <option value="decomposition">Decomposition</option>
                  <option value="displacement">Displacement</option>
                  <option value="redox">Redox</option>
                  <option value="combustion">Combustion</option>
                  <option value="acidbase">Acid-Base</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredReactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <Beaker size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No reactions found.</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Click "Create New Reaction" to get started!</p>
                </div>
              ) : (
                filteredReactions.map((reaction) => (
                  <motion.div
                    key={reaction.id}
                    onClick={() => setSelectedReaction(reaction)}
                    style={{
                      background: selectedReaction?.id === reaction.id 
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(96, 165, 250, 0.05))'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `2px solid ${selectedReaction?.id === reaction.id ? '#a78bfa' : 'transparent'}`,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      marginBottom: '1rem',
                      cursor: 'pointer'
                    }}
                    variants={cardHoverVariants}
                    whileHover="hover"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <h4 style={{ fontSize: '1.1rem', color: '#e2e8f0', margin: 0 }}>{reaction.name}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditReaction(reaction); }}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDuplicateReaction(reaction); }}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                          title="Duplicate"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteReaction(reaction.id); }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      marginBottom: '0.8rem',
                      textAlign: 'center',
                      color: reaction.color || '#a78bfa'
                    }}>
                      {reaction.reactants?.join(' + ')} → {reaction.products?.join(' + ')}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                      {reaction.conditions && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Thermometer size={12} />
                          <span>{reaction.conditions}</span>
                        </div>
                      )}
                      {reaction.energyChange !== undefined && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Flame size={12} />
                          <span>{reaction.energyChange > 0 ? '+' : ''}{reaction.energyChange} kJ/mol</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Visualization Panel */}
          <motion.div 
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              border: '2px solid rgba(139, 92, 246, 0.25)',
              backdropFilter: 'blur(12px)',
              padding: '1.5rem',
              position: 'relative'
            }}
            variants={itemVariants}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Eye size={22} color="#a78bfa" />
                Reaction Visualization
              </h3>
              {selectedReaction && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setVisualizationMode('2d')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: visualizationMode === '2d' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    2D View
                  </button>
                  <button
                    onClick={() => setVisualizationMode('3d')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: visualizationMode === '3d' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    3D View
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    style={{
                      padding: '0.5rem',
                      background: 'transparent',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      cursor: 'pointer'
                    }}
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </div>
              )}
            </div>

            <div style={{
              minHeight: isFullscreen ? 'calc(100vh - 200px)' : '550px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'min-height 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {selectedReaction ? (
                <ReactionVisualizer
                  reaction={selectedReaction}
                  mode={visualizationMode}
                  type="custom"
                  isFullscreen={isFullscreen}
                />
              ) : (
                <motion.div 
                  style={{ textAlign: 'center', color: '#94a3b8' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Beaker size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '1.1rem' }}>No Reaction Selected</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Select a reaction from the list or create a new one!</p>
                  <button
                    onClick={() => {
                      setEditingReaction(null);
                      setShowEditor(true);
                    }}
                    style={{
                      marginTop: '1.5rem',
                      padding: '0.6rem 1.2rem',
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid #a78bfa',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      cursor: 'pointer'
                    }}
                  >
                    Create Your First Reaction
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '24px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ReactionEditor
                reaction={editingReaction}
                onSave={handleSaveReaction}
                onCancel={() => {
                  setShowEditor(false);
                  setEditingReaction(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Home */}
      <motion.div 
        style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 50 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.8rem 1.5rem',
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            color: '#e2e8f0',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
            e.currentTarget.style.borderColor = '#a78bfa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
          }}
        >
          <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Professional Reaction Visualizer Component
const ReactionVisualizer = ({ reaction, mode = '3d', type = 'custom', isFullscreen = false }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [step, setStep] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const canvasRef = useRef(null);

  // Animate the reaction steps
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % 3);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Auto-rotation for 3D mode
  useEffect(() => {
    if (mode === '3d' && isAnimating) {
      const rotationInterval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(rotationInterval);
    }
  }, [mode, isAnimating]);

  // Draw canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw molecules
    const drawMolecule = (x, y, name, isActive) => {
      // Draw glow effect
      if (isActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#a78bfa';
      }
      
      // Draw circle background
      const gradient = ctx.createRadialGradient(x - 10, y - 10, 5, x, y, 30);
      gradient.addColorStop(0, isActive ? 'rgba(139, 92, 246, 0.3)' : 'rgba(96, 165, 250, 0.2)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = isActive ? '#a78bfa' : '#60a5fa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw atoms/bonds representation
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = isActive ? '#a78bfa' : '#60a5fa';
      ctx.shadowBlur = 0;
      ctx.fillText(name.charAt(0), x - 10, y + 8);
      
      // Draw molecule name
      ctx.font = '12px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(name, x - 20, y + 45);
      
      // Draw electrons (particles)
      if (isActive && isAnimating) {
        for (let i = 0; i < 6; i++) {
          const angle = Date.now() / 500 + i * Math.PI * 2 / 6;
          const px = x + Math.cos(angle) * 45;
          const py = y + Math.sin(angle) * 45;
          ctx.fillStyle = `rgba(139, 92, 246, ${0.5 + Math.sin(Date.now() / 200) * 0.3})`;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    
    const drawArrow = (x1, y1, x2, y2, progress) => {
      const midX = x1 + (x2 - x1) * progress;
      const midY = y1 + (y2 - y1) * progress;
      
      // Draw dashed line
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw moving particles
      ctx.fillStyle = `rgba(139, 92, 246, 0.8)`;
      ctx.beginPath();
      ctx.arc(midX, midY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowX = x2 - 15;
      const arrowY = y2 - 15 * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12, y2 - 6);
      ctx.lineTo(x2 - 12, y2 + 6);
      ctx.fillStyle = '#a78bfa';
      ctx.fill();
    };
    
    const startX = width * 0.25;
    const startY = height / 2;
    const endX = width * 0.75;
    const endY = height / 2;
    
    // Calculate active step based on animation
    const activeStep = isAnimating ? step : 1;
    
    // Draw reactants
    reaction.reactants?.forEach((reactant, idx) => {
      const x = startX - (reaction.reactants.length - 1) * 40 + idx * 80;
      const isActive = activeStep === 0 && isAnimating;
      drawMolecule(x, startY, reactant, isActive);
    });
    
    // Draw arrow
    const progress = isAnimating ? (step === 0 ? 0 : step === 1 ? 0.5 : 1) : 0.5;
    drawArrow(startX + 50, startY, endX - 50, endY, progress);
    
    // Draw products
    reaction.products?.forEach((product, idx) => {
      const x = endX - (reaction.products.length - 1) * 40 + idx * 80;
      const isActive = activeStep === 2 && isAnimating;
      drawMolecule(x, endY, product, isActive);
    });
    
    // Draw energy diagram if available
    if (reaction.energyChange !== undefined && showInfo) {
      const energyY = height - 60;
      const energyX = width / 2 - 100;
      const energyHeight = Math.min(80, Math.abs(reaction.energyChange) / 20);
      
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(energyX, energyY - 80, 200, 85);
      
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px monospace';
      ctx.fillText(`ΔH = ${reaction.energyChange > 0 ? '+' : ''}${reaction.energyChange} kJ/mol`, energyX + 10, energyY - 10);
      
      if (reaction.energyChange > 0) {
        // Endothermic
        ctx.fillStyle = '#f97316';
        ctx.fillRect(energyX + 20, energyY - 50 - energyHeight, 40, energyHeight);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(energyX + 80, energyY - 50, 40, 20);
      } else {
        // Exothermic
        ctx.fillStyle = '#f97316';
        ctx.fillRect(energyX + 20, energyY - 50, 40, 20);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(energyX + 80, energyY - 50 - energyHeight, 40, energyHeight);
      }
      
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Reactants', energyX + 25, energyY - 55);
      ctx.fillText('Products', energyX + 85, energyY - 55);
    }
  }, [reaction, step, isAnimating, mode, showInfo]);

  const getEnergyColor = () => {
    if (!reaction.energyChange) return '#a78bfa';
    return reaction.energyChange > 0 ? '#f97316' : '#34d399';
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Controls Bar */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 10,
        display: 'flex',
        gap: '0.5rem',
        background: 'rgba(0,0,0,0.6)',
        padding: '0.5rem',
        borderRadius: '12px',
        backdropFilter: 'blur(8px)'
      }}>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          style={{
            background: isAnimating ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
            border: '1px solid #a78bfa',
            borderRadius: '8px',
            padding: '0.4rem 0.8rem',
            color: '#e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.75rem'
          }}
        >
          {isAnimating ? <Pause size={14} /> : <Play size={14} />}
          {isAnimating ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            background: showInfo ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
            border: '1px solid #a78bfa',
            borderRadius: '8px',
            padding: '0.4rem',
            color: '#e2e8f0',
            cursor: 'pointer'
          }}
          title="Toggle Info"
        >
          <Info size={14} />
        </button>
        
        {mode === '3d' && (
          <button
            onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
            style={{
              background: 'transparent',
              border: '1px solid #a78bfa',
              borderRadius: '8px',
              padding: '0.4rem',
              color: '#e2e8f0',
              cursor: 'pointer'
            }}
          >
            +
          </button>
        )}
        
        {mode === '3d' && (
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
            style={{
              background: 'transparent',
              border: '1px solid #a78bfa',
              borderRadius: '8px',
              padding: '0.4rem',
              color: '#e2e8f0',
              cursor: 'pointer'
            }}
          >
            -
          </button>
        )}
        
        <button
          onClick={() => setRotation(0)}
          style={{
            background: 'transparent',
            border: '1px solid #a78bfa',
            borderRadius: '8px',
            padding: '0.4rem',
            color: '#e2e8f0',
            cursor: 'pointer'
          }}
          title="Reset View"
        >
          <RotateCw size={14} />
        </button>
      </div>
      
      {/* Main Visualization */}
      <div style={{
        width: '100%',
        height: '100%',
        minHeight: isFullscreen ? 'calc(100vh - 200px)' : '500px',
        position: 'relative',
        transform: mode === '3d' ? `perspective(1000px) rotateY(${rotation}deg) scale(${zoom})` : 'none',
        transition: 'transform 0.1s ease',
        transformOrigin: 'center center'
      }}>
        <canvas
          ref={canvasRef}
          width={isFullscreen ? window.innerWidth - 100 : 800}
          height={isFullscreen ? window.innerHeight - 250 : 500}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        />
      </div>
      
      {/* Reaction Info Card */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ color: '#a78bfa', margin: 0 }}>{reaction.name}</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {reaction.conditions && (
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Thermometer size={10} /> {reaction.conditions}
              </span>
            )}
            {reaction.energyChange !== undefined && (
              <span style={{ fontSize: '0.7rem', color: getEnergyColor(), display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Flame size={10} /> {reaction.energyChange > 0 ? 'Endothermic' : 'Exothermic'}
              </span>
            )}
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>{reaction.description}</p>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: '#94a3b8',
          marginTop: '0.5rem',
          padding: '0.5rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {reaction.reactants?.join(' + ')} → {reaction.products?.join(' + ')}
        </div>
      </div>
      
      {/* Step Indicator */}
      {isAnimating && (
        <div style={{
          position: 'absolute',
          bottom: '5rem',
          right: '1rem',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '20px',
          padding: '0.3rem 0.8rem',
          fontSize: '0.7rem',
          color: '#a78bfa'
        }}>
          Step {step + 1}/3
        </div>
      )}
    </div>
  );
};

// Reaction Editor Component
const ReactionEditor = ({ reaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: reaction?.name || '',
    description: reaction?.description || '',
    reactants: reaction?.reactants || [''],
    products: reaction?.products || [''],
    conditions: reaction?.conditions || '',
    type: reaction?.type || 'custom',
    energyChange: reaction?.energyChange || 0,
    color: reaction?.color || '#a78bfa'
  });

  const [newReactant, setNewReactant] = useState('');
  const [newProduct, setNewProduct] = useState('');

  const addReactant = () => {
    if (newReactant.trim()) {
      setFormData({ ...formData, reactants: [...formData.reactants, newReactant.trim()] });
      setNewReactant('');
    }
  };

  const addProduct = () => {
    if (newProduct.trim()) {
      setFormData({ ...formData, products: [...formData.products, newProduct.trim()] });
      setNewProduct('');
    }
  };

  const removeReactant = (index) => {
    const newReactants = formData.reactants.filter((_, i) => i !== index);
    setFormData({ ...formData, reactants: newReactants.length ? newReactants : [''] });
  };

  const removeProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts.length ? newProducts : [''] });
  };

  const updateReactant = (index, value) => {
    const newReactants = [...formData.reactants];
    newReactants[index] = value;
    setFormData({ ...formData, reactants: newReactants });
  };

  const updateProduct = (index, value) => {
    const newProducts = [...formData.products];
    newProducts[index] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a reaction name');
      return;
    }
    const filteredReactants = formData.reactants.filter(r => r.trim());
    const filteredProducts = formData.products.filter(p => p.trim());
    if (filteredReactants.length === 0 || filteredProducts.length === 0) {
      alert('Please add at least one reactant and one product');
      return;
    }
    onSave({
      ...formData,
      reactants: filteredReactants,
      products: filteredProducts,
      id: reaction?.id
    });
  };

  const moleculeSuggestions = [
    'H2', 'O2', 'H2O', 'NaCl', 'CO2', 'CH4', 'C2H5OH', 
    'NaOH', 'HCl', 'NH3', 'CaCO3', 'H2SO4', 'C6H12O6',
    'Fe', 'Cu', 'AgNO3', 'KMnO4', 'SO2', 'NO2'
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#e2e8f0', margin: 0 }}>
          {reaction ? 'Edit Reaction' : 'Create New Reaction'}
        </h2>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: formData.color,
          cursor: 'pointer',
          border: '2px solid #fff'
        }}
        onClick={() => {
          const colors = ['#34d399', '#f87171', '#60a5fa', '#c084fc', '#fbbf24', '#f97316', '#a78bfa'];
          const newColor = colors[(colors.indexOf(formData.color) + 1) % colors.length];
          setFormData({ ...formData, color: newColor });
        }}
        title="Click to change color"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Reaction Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            width: '100%',
            padding: '0.8rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '1rem'
          }}
          placeholder="e.g., Combustion of Methane"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Description (Optional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{
            width: '100%',
            padding: '0.8rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: 'white',
            minHeight: '80px',
            fontSize: '0.95rem'
          }}
          placeholder="Describe your reaction..."
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
        {/* Reactants */}
        <div>
          <label style={{ color: '#60a5fa', display: 'block', marginBottom: '0.5rem' }}>Reactants *</label>
          {formData.reactants.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                value={r}
                onChange={(e) => updateReactant(i, e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem'
                }}
                placeholder="e.g., H2"
              />
              {formData.reactants.length > 1 && (
                <button onClick={() => removeReactant(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              value={newReactant}
              onChange={(e) => setNewReactant(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addReactant()}
              placeholder="Add reactant..."
              style={{
                flex: 1,
                padding: '0.6rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
            <button onClick={addReactant} style={{ padding: '0.6rem 1rem', background: '#60a5fa', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              <Plus size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {moleculeSuggestions.slice(0, 6).map(m => (
              <button
                key={m}
                onClick={() => setNewReactant(m)}
                style={{
                  padding: '0.2rem 0.6rem',
                  background: 'rgba(96, 165, 250, 0.2)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <label style={{ color: '#34d399', display: 'block', marginBottom: '0.5rem' }}>Products *</label>
          {formData.products.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                value={p}
                onChange={(e) => updateProduct(i, e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem'
                }}
                placeholder="e.g., H2O"
              />
              {formData.products.length > 1 && (
                <button onClick={() => removeProduct(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProduct()}
              placeholder="Add product..."
              style={{
                flex: 1,
                padding: '0.6rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.95rem'
              }}
            />
            <button onClick={addProduct} style={{ padding: '0.6rem 1rem', background: '#34d399', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              <Plus size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {moleculeSuggestions.slice(6, 12).map(m => (
              <button
                key={m}
                onClick={() => setNewProduct(m)}
                style={{
                  padding: '0.2rem 0.6rem',
                  background: 'rgba(52, 211, 153, 0.2)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Reaction Conditions</label>
          <input
            type="text"
            value={formData.conditions}
            onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.95rem'
            }}
            placeholder="e.g., Heat, Catalyst, Room Temperature"
          />
        </div>

        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Energy Change (kJ/mol)</label>
          <input
            type="number"
            value={formData.energyChange}
            onChange={(e) => setFormData({ ...formData, energyChange: parseFloat(e.target.value) || 0 })}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.95rem'
            }}
            placeholder="e.g., -890 (negative = exothermic, positive = endothermic)"
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Reaction Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          style={{
            width: '100%',
            padding: '0.8rem',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.95rem'
          }}
        >
          <option value="synthesis">Synthesis (A + B → AB)</option>
          <option value="decomposition">Decomposition (AB → A + B)</option>
          <option value="displacement">Displacement (A + BC → AC + B)</option>
          <option value="redox">Redox (Oxidation-Reduction)</option>
          <option value="combustion">Combustion (Fuel + O₂ → CO₂ + H₂O)</option>
          <option value="acidbase">Acid-Base (H⁺ + OH⁻ → H₂O)</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'transparent',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}
        >
          <Check size={18} />
          {reaction ? 'Update' : 'Create'} Reaction
        </button>
      </div>
    </div>
  );
};

export default CustomReactions;