import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, FlaskConical, Zap, Atom, Flame, ChevronRight, Play, Pause, Target, Clock, AlertCircle, Eye, Sparkles, ChevronDown, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactionVisualizer from '../components/ReactionVisualizer/ReactionVisualizer';
import organicReactionsData from '../assets/organicReactions.json';

function OrganicReactions() {
  const [reactions, setReactions] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setReactions(organicReactionsData.reactions);
    if (organicReactionsData.reactions.length > 0) {
      setSelectedReaction(organicReactionsData.reactions[0]);
    }
  }, []);

  const filteredReactions = reactions.filter(reaction => {
    const matchesSearch = reaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || reaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Professional color scheme matching home page
  const typeColors = {
    substitution: '#60a5fa', // Blue
    addition: '#34d399',     // Green
    elimination: '#c084fc',  // Purple
    oxidation: '#f87171',    // Red
    reduction: '#fbbf24',    // Yellow
    all: '#818cf8'           // Indigo
  };

  const getTypeIcon = (type) => {
    const icons = {
      substitution: <Target size={16} />,
      addition: <Plus size={16} />,
      elimination: <Minus size={16} />,
      oxidation: <Flame size={16} />,
      reduction: <Zap size={16} />
    };
    return icons[type] || <Atom size={16} />;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      className="organic-reactions"
      style={{
        minHeight: '216vh',
        background: 'radial-gradient(circle at 30% 20%, #0f172a 0%, #020617 70%)',
        color: '#f1f5f9',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background particles */}
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
              background: `rgba(100, 180, 255, ${Math.random() * 0.2 + 0.1})`,
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
          borderBottom: '1px solid rgba(100, 180, 255, 0.15)',
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem'
        }}>
          <motion.div 
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
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
                background: 'linear-gradient(90deg, #a5b4fc, #60a5fa, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                letterSpacing: '-0.5px'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Organic Reactions
            </motion.h1>
            <motion.p 
              style={{
                fontSize: '0.95rem',
                color: '#cbd5e1',
                marginTop: '0.4rem',
                fontWeight: 500,
                opacity: 0.9
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Interactive visualization of organic chemical mechanisms
            </motion.p>
          </div>
        </div>

        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem'
          }}
          variants={itemVariants}
        >
          {/* Search Bar */}
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
                border: `2px solid ${searchTerm ? '#60a5fa' : 'rgba(100, 180, 255, 0.2)'}`,
                borderRadius: '12px',
                fontSize: '0.95rem',
                background: 'rgba(30, 41, 59, 0.6)',
                outline: 'none',
                fontWeight: 500,
                color: 'white',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              whileFocus={{ 
                scale: 1.02,
                borderColor: '#60a5fa',
                boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.2)'
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.9rem 1.5rem',
                border: `2px solid ${filter !== 'all' ? typeColors[filter] : 'rgba(100, 180, 255, 0.2)'}`,
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.6)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                minWidth: '160px',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.02, borderColor: '#60a5fa' }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter size={18} color={typeColors[filter]} />
              <span>{filter === 'all' ? 'All Types' : filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  marginLeft: 'auto',
                  transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </motion.button>
            
            {isFilterOpen && (
              <motion.div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(100, 180, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  zIndex: 101
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  onClick={() => { setFilter('all'); setIsFilterOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    background: filter === 'all' ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
                    transition: 'background 0.2s ease'
                  }}
                  whileHover={{ background: 'rgba(96, 165, 250, 0.15)' }}
                >
                  All Types
                </motion.button>
                {['substitution', 'addition', 'elimination', 'oxidation', 'reduction'].map((type, i) => (
                  <motion.button
                    key={type}
                    onClick={() => { setFilter(type); setIsFilterOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      background: filter === type ? `${typeColors[type]}20` : 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderBottom: i < 4 ? '1px solid rgba(100, 180, 255, 0.1)' : 'none',
                      transition: 'background 0.2s ease'
                    }}
                    whileHover={{ background: `${typeColors[type]}15` }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* Stats Banner */}
        <motion.div 
          style={{
            minHeight: '14vh',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(100, 180, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
          variants={itemVariants}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.8rem'
              }}>
                <BookOpen size={28} color="#60a5fa" />
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  margin: 0
                }}>
                  Reaction Library
                </h2>
              </div>
              <p style={{
                fontSize: '1.1rem',
                color: '#cbd5e1',
                maxWidth: '800px',
                lineHeight: 1.6,
                margin: 0,
                opacity: 0.9
              }}>
                Explore detailed organic reaction mechanisms with interactive visualizations
              </p>
            </div>
            
            <motion.div 
              style={{
                background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '2px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '14px',
                padding: '1rem 1.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Sparkles size={18} color="#60a5fa" />
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#60a5fa'
              }}>
                {filteredReactions.length} Reactions
              </span>
            </motion.div>
          </div>

          {/* Reaction Type Tags */}
          <div style={{
            display: 'flex',
            gap: '0.8rem',
            flexWrap: 'wrap'
          }}>
            {Object.entries(typeColors).filter(([type]) => type !== 'all').map(([type, color]) => (
              <motion.div 
                key={type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.7rem 1.2rem',
                  background: `${color}15`,
                  border: `2px solid ${color}40`,
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: `${color}25`,
                  borderColor: color
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div style={{ color: color }}>
                  {getTypeIcon(type)}
                </div>
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span style={{
                  background: `${color}30`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {reactions.filter(r => r.type === type).length}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '2rem',
          minHeight: '1280px'
        }}>
          {/* Reactions List Panel */}
          <motion.div 
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              border: '1px solid rgba(100, 180, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
            variants={itemVariants}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(100, 180, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#e2e8f0',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <Eye size={22} color="#60a5fa" />
                Available Reactions
              </h3>
              <div style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                fontWeight: 600,
                background: 'rgba(100, 180, 255, 0.1)',
                padding: '0.6rem 1.2rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <Sparkles size={14} />
                {filteredReactions.length} found
              </div>
            </div>

            {/* Reactions List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '0.5rem',
              maxHeight: '1130px'
            }}>
              {filteredReactions.map((reaction) => (
                <motion.div
                  key={reaction.id}
                  onClick={() => setSelectedReaction(reaction)}
                  style={{
                    background: selectedReaction?.id === reaction.id 
                      ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${selectedReaction?.id === reaction.id ? '#60a5fa' : 'transparent'}`,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  variants={cardHoverVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.8rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      color: '#e2e8f0',
                      margin: 0,
                      fontWeight: 700
                    }}>
                      {reaction.name}
                    </h4>
                    <div style={{
                      background: `${typeColors[reaction.type]}20`,
                      color: typeColors[reaction.type],
                      padding: '0.4rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      {getTypeIcon(reaction.type)}
                      {reaction.type.charAt(0).toUpperCase() + reaction.type.slice(1)}
                    </div>
                  </div>

                  <p style={{
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    marginBottom: '1.2rem',
                    lineHeight: 1.5,
                    opacity: 0.9
                  }}>
                    {reaction.description}
                  </p>

                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '1.2rem',
                    color: '#a5b4fc',
                    fontWeight: 600,
                    border: '1px solid rgba(100, 180, 255, 0.1)'
                  }}>
                    {reaction.equation}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.875rem',
                    color: '#94a3b8'
                  }}>
                    <Clock size={14} />
                    <span>Complexity: {reaction.complexity}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visualization Panel */}
          <motion.div 
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              border: '2px solid rgba(96, 165, 250, 0.25)',
              backdropFilter: 'blur(12px)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            variants={itemVariants}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(100, 180, 255, 0.1)'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <Zap size={22} color="#60a5fa" />
                  Reaction Visualization
                </h3>
                {selectedReaction && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#cbd5e1',
                    marginTop: '0.4rem',
                    marginBottom: 0,
                    opacity: 0.9
                  }}>
                    {selectedReaction.name} • {selectedReaction.type}
                  </p>
                )}
              </div>

              {selectedReaction && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: `${typeColors[selectedReaction.type]}20`,
                    color: typeColors[selectedReaction.type],
                    padding: '0.8rem 1.2rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    border: `1px solid ${typeColors[selectedReaction.type]}40`
                  }}>
                    {getTypeIcon(selectedReaction.type)}
                    {selectedReaction.type.charAt(0).toUpperCase() + selectedReaction.type.slice(1)}
                  </div>
                </div>
              )}
            </div>

            {/* Visualization Container */}
<div style={{
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '750px', // CHANGED: Increased from 550px to 750px
  background: 'rgba(15, 23, 42, 0.4)',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(100, 180, 255, 0.1)'
}}>
  {selectedReaction ? (
    <>
      {/* Interactive Visualization Badge - ENHANCED */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '2rem', // CHANGED: Increased from 1.5rem
          left: '2rem', // CHANGED: Increased from 1.5rem
          background: 'rgba(96, 165, 250, 0.15)', // CHANGED: Slightly darker background
          border: '1px solid rgba(96, 165, 250, 0.4)', // CHANGED: Stronger border
          padding: '0.8rem 1.5rem', // CHANGED: Larger padding
          borderRadius: '12px',
          fontSize: '1rem', // CHANGED: Larger font size
          fontWeight: 600,
          color: '#60a5fa',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem', // CHANGED: Larger gap
          zIndex: 2,
          backdropFilter: 'blur(10px)' // NEW: Added blur effect
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AlertCircle size={16} /> {/* CHANGED: Larger icon */}
        Interactive Visualization
      </motion.div>
      
      {/* Reaction Details Panel - NEW */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '2rem', // NEW
          right: '2rem', // NEW
          background: 'rgba(15, 23, 42, 0.85)', // NEW
          backdropFilter: 'blur(10px)', // NEW
          border: '1px solid rgba(100, 180, 255, 0.2)', // NEW
          borderRadius: '12px', // NEW
          padding: '1.5rem', // NEW
          maxWidth: '300px', // NEW
          zIndex: 2, // NEW
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' // NEW
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '1rem'
        }}>
          <BookOpen size={18} color="#60a5fa" />
          <h4 style={{
            margin: 0,
            fontSize: '1rem',
            color: '#e2e8f0',
            fontWeight: 600
          }}>
            Reaction Details
          </h4>
        </div>
        
        <div style={{
          fontSize: '0.875rem',
          color: '#cbd5e1',
          lineHeight: 1.6
        }}>
          <div style={{ 
            marginBottom: '0.6rem',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#94a3b8' }}>Type:</span>
            <span style={{ 
              color: typeColors[selectedReaction.type],
              fontWeight: 600
            }}>
              {selectedReaction.type}
            </span>
          </div>
          
          <div style={{ 
            marginBottom: '0.6rem',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#94a3b8' }}>Complexity:</span>
            <span style={{ fontWeight: 500 }}>{selectedReaction.complexity}</span>
          </div>
          
          <div style={{ marginBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(100, 180, 255, 0.1)' }}>
            <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Key Features:</span>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '1.2rem',
              fontSize: '0.8rem',
              color: '#a5b4fc'
            }}>
              <li>Step-by-step mechanism</li>
              <li>Bond formation/breakage</li>
              <li>Electron flow animation</li>
              <li>3D molecular view</li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      {/* Reaction Visualizer Container - ENHANCED */}
      <div style={{
        width: '90%', // NEW: Take more width
        height: '80%', // NEW: Take more height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem' // NEW: Added padding
      }}>
        <ReactionVisualizer 
          reaction={selectedReaction} 
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      </div>
      
      {/* Controls Panel - ENHANCED */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: '2rem', // CHANGED: Increased from 1.5rem
          right: '2rem', // CHANGED: Increased from 1.5rem
          background: 'rgba(30, 41, 59, 0.8)', // CHANGED: Darker background
          backdropFilter: 'blur(10px)', // NEW: Added blur
          padding: '0.8rem 1.2rem', // CHANGED: Larger padding
          borderRadius: '10px',
          border: '1px solid rgba(100, 180, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem', // NEW: Added gap
          fontSize: '0.875rem', // CHANGED: Larger font
          color: '#94a3b8'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Zap size={14} color="#60a5fa" />
          <span>Real-time animation</span>
        </div>
        
        {/* NEW: Speed control */}
        <div style={{
          height: '20px',
          width: '1px',
          background: 'rgba(100, 180, 255, 0.2)'
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Play size={14} color="#34d399" />
          <span>Click to play</span>
        </div>
      </motion.div>
      
      {/* NEW: Progress Indicator */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '0.8rem 1.2rem',
          borderRadius: '10px',
          border: '1px solid rgba(100, 180, 255, 0.2)',
          fontSize: '0.875rem',
          color: '#94a3b8'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={14} color="#c084fc" />
          <span>Mechanism: 4 steps</span>
        </div>
      </motion.div>
    </>
  ) : (
    <motion.div 
      style={{
        textAlign: 'center',
        color: '#cbd5e1',
        padding: '4rem' // CHANGED: Increased from 3rem
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        style={{ 
          fontSize: '6rem', // CHANGED: Increased from 4rem
          marginBottom: '2rem' // CHANGED: Increased from 1.5rem
        }}
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.2, 1] // CHANGED: Increased scale animation
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        ⚗️
      </motion.div>
      <p style={{ 
        fontWeight: 800, 
        fontSize: '2rem', // CHANGED: Increased from 1.5rem
        marginBottom: '1.5rem', // CHANGED: Increased from 1rem
        color: '#e2e8f0'
      }}>
        Select a Reaction
      </p>
      <p style={{ 
        fontSize: '1.1rem', // CHANGED: Increased from 0.9rem
        maxWidth: '400px', // CHANGED: Increased from 300px
        lineHeight: 1.6,
        margin: '0 auto',
        opacity: 0.8
      }}>
        Choose a reaction from the list to visualize its chemical mechanism
      </p>
      
      {/* NEW: Instruction hint */}
      <motion.div 
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(96, 165, 250, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(96, 165, 250, 0.2)',
          fontSize: '0.9rem',
          color: '#cbd5e1'
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        💡 <strong>Tip:</strong> Click on any reaction card to start visualization
      </motion.div>
    </motion.div>
  )}
</div>
          </motion.div>
        </div>
      </main>

      {/* Back to Home Link */}
      <motion.div 
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 50
        }}
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
            border: '1px solid rgba(100, 180, 255, 0.2)',
            borderRadius: '12px',
            color: '#e2e8f0',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
            e.currentTarget.style.borderColor = '#60a5fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
            e.currentTarget.style.borderColor = 'rgba(100, 180, 255, 0.2)';
          }}
        >
          <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
export default OrganicReactions;