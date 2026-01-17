import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Zap, Grid3x3, Box, Info, AlertCircle, Atom, Flame, Droplets, Thermometer, ChevronRight, Target, Hash, Play, Pause, Sparkles, Globe, Layers, Brain, Target as TargetIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PeriodicTable from '../components/Elements/PeriodicTable';
import ElementCard from '../components/Elements/ElementCard';
import elementsData from '../assets/elements.json';

function PeriodicTablePage() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('name');
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [showFloatingInfo, setShowFloatingInfo] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const detailsContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    const data = elementsData.elements;
    setElements(data);
    if (data?.length > 0) {
      setSelectedElement(data[0]);
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedElement && detailsContainerRef.current && isAutoScroll) {
      detailsContainerRef.current.scrollTop = 0;
      setActiveSection('name');
      setIsPaused(true);
      
      setTimeout(() => {
        setIsPaused(false);
        startAutoScroll();
      }, 2000);
    }
  }, [selectedElement, isAutoScroll]);

  const startAutoScroll = () => {
    if (!isAutoScroll || scrollIntervalRef.current) return;

    let hasPausedAtElement = false;

    scrollIntervalRef.current = setInterval(() => {
      if (isPaused || !detailsContainerRef.current) return;

      const container = detailsContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      if (container.scrollTop < scrollHeight - clientHeight) {
        container.scrollTop += 10;
        
        if (!hasPausedAtElement && container.scrollTop < 100) {
          container.scrollTop = 0;
          hasPausedAtElement = true;
          setIsPaused(true);
          
          setTimeout(() => {
            setIsPaused(false);
          }, 2000);
        }
        
        if (container.scrollTop >= scrollHeight - clientHeight - 10) {
          clearInterval(scrollIntervalRef.current);
          setIsPaused(true);
          
          setTimeout(() => {
            container.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            hasPausedAtElement = false;
            setIsPaused(false);
            
            setTimeout(() => {
              if (isAutoScroll) startAutoScroll();
            }, 1000);
          }, 2000);
        }
      }
    }, 50);
  };

  const toggleAutoScroll = () => {
    setIsAutoScroll(!isAutoScroll);
    if (!isAutoScroll) {
      startAutoScroll();
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }
  };

  const handleScroll = (e) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    
    if (scrollTop < 200) {
      setActiveSection('name');
    } else if (scrollTop < 400) {
      setActiveSection('metrics');
    } else if (scrollTop < 600) {
      setActiveSection('highlights');
    } else {
      setActiveSection('details');
    }
  };

  const filteredElements = elements.filter((el) => {
    const matchesSearch =
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || el.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = [
    'alkali metal', 'alkaline earth metal', 'transition metal',
    'post-transition metal', 'metalloid', 'nonmetal', 'halogen',
    'noble gas', 'lanthanide', 'actinide'
  ];

  const handleElementSelect = (element) => {
    setSelectedElement(element);
    setShowFloatingInfo(true);
    setTimeout(() => {
      setShowFloatingInfo(false);
    }, 2000);
    
    setTimeout(() => {
      document.getElementById('element-details')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 50);
  };

  const getElementHighlights = (element) => {
    const highlights = [];
    
    if (element) {
      if (element.number === 1) highlights.push("First and lightest element in the universe");
      if (element.number === 2) highlights.push("Second most abundant element in the universe");
      if (element.number === 6) highlights.push("Basis of all organic chemistry - life as we know it");
      if (element.number === 8) highlights.push("Essential for respiration and combustion processes");
      if (element.number === 26) highlights.push("Most abundant element in Earth's core");
      if (element.number === 79) highlights.push("Highly inert and corrosion-resistant precious metal");
      if (element.number === 92) highlights.push("Heaviest naturally occurring element");
      
      if (element.category === 'noble gas') highlights.push("Inert and non-reactive under normal conditions");
      if (element.category === 'halogen') highlights.push("Highly reactive nonmetals forming salts");
      if (element.category === 'alkali metal') highlights.push("Extremely reactive with water");
      if (element.category === 'transition metal') highlights.push("Forms colorful compounds and catalysts");
      
      if (element.phase === 'Gas' && element.number !== 2) highlights.push("Exists as gas at room temperature");
      if (element.phase === 'Liquid') highlights.push("Liquid at room temperature - rare property");
      
      if (element.name === 'Oxygen') highlights.push("Most abundant element in Earth's crust");
      if (element.name === 'Silicon') highlights.push("Second most abundant element in Earth's crust");
      
      if (element.molar_heat) highlights.push(`Specific heat capacity: ${element.molar_heat} J/(mol·K)`);
      if (element.boil) highlights.push(`Boils at ${element.boil} K (${(element.boil - 273.15).toFixed(1)}°C)`);
      if (element.melt) highlights.push(`Melts at ${element.melt} K (${(element.melt - 273.15).toFixed(1)}°C)`);
    }
    
    return highlights.slice(0, 3);
  };

  const categoryColors = {
    'alkali metal': '#FF6B6B',
    'alkaline earth metal': '#FFD166',
    'transition metal': '#06D6A0',
    'post-transition metal': '#118AB2',
    'metalloid': '#83C5BE',
    'nonmetal': '#4CC9F0',
    'halogen': '#FF6B6B',
    'noble gas': '#9D4EDD',
    'lanthanide': '#FF9E6D',
    'actinide': '#FF9E6D'
  };

  const elementHighlights = getElementHighlights(selectedElement);

  const scrollToSection = (section) => {
    if (!detailsContainerRef.current) return;
    
    const container = detailsContainerRef.current;
    let scrollTop = 0;
    
    if (section === 'name') {
      scrollTop = 0;
    } else if (section === 'metrics') {
      scrollTop = 200;
    } else if (section === 'highlights') {
      scrollTop = 400;
    } else if (section === 'details') {
      scrollTop = 600;
    }
    
    container.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
    setActiveSection(section);
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const searchVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const elementSelectVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      scale: 0.95, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const metricItemVariants = {
    hover: {
      scale: 1.05,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  const highlightItemVariants = {
    hover: {
      x: 8,
      backgroundColor: "rgba(102, 126, 234, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const floatingIndicatorVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      scale: 0,
      rotate: 180,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const logoVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.5
      }
    }
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const filterDropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const backgroundParticleVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: Math.random() * 5 + 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      style={{
        minHeight: '216vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: 'hidden',
        position: 'relative'
      }}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Background Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            background: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 255, ${Math.random() * 0.3 + 0.1})`,
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0
          }}
          variants={backgroundParticleVariants}
          animate="animate"
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8); }
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
      
      <motion.header 
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10
        }}
        variants={headerVariants}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <motion.div 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            }}
            variants={logoVariants}
            animate="animate"
            whileHover="hover"
          >
            <Zap size={24} />
          </motion.div>
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <motion.h1 
              style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                letterSpacing: '-0.5px'
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Periodic Table Explorer
            </motion.h1>
            <motion.p 
              style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                marginTop: '4px',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Interactive visualization of chemical elements • Real-time data
            </motion.p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <motion.div 
            style={{
              position: 'relative'
            }}
            variants={searchVariants}
            whileHover="hover"
          >
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
              placeholder="Search elements..."
              style={{
                padding: '12px 20px 12px 44px',
                width: '280px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '0.95rem',
                background: 'rgba(15, 23, 42, 0.8)',
                outline: 'none',
                fontWeight: '500',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
              animate={{
                borderColor: searchTerm ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: searchTerm ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none'
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <motion.div 
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              zIndex: 100
            }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            animate={{
              borderColor: filter !== 'all' ? '#667eea' : 'rgba(255, 255, 255, 0.1)',
              boxShadow: filter !== 'all' ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none'
            }}
          >
            <Filter size={18} color="#667eea" />
            <span style={{
              fontSize: '0.95rem',
              fontWeight: '500',
              color: 'white',
              minWidth: '140px'
            }}>
              {filter === 'all' ? 'All Categories' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </span>
            <ChevronRight 
              size={16} 
              color="#667eea" 
              style={{ 
                transition: 'transform 0.3s',
                transform: isFilterOpen ? 'rotate(90deg)' : 'rotate(0deg)'
              }}
            />
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                  }}
                  variants={filterDropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div 
                    style={{
                      padding: '8px 0',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    <motion.button
                      onClick={() => { setFilter('all'); setIsFilterOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: filter === 'all' ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      All Categories
                    </motion.button>
                    {categories.map((cat, index) => (
                      <motion.button
                        key={cat}
                        onClick={() => { setFilter(cat); setIsFilterOpen(false); }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: filter === cat ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                          border: 'none',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderBottom: index < categories.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                        }}
                        whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 32px',
        gap: '24px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Periodic Table Section */}
        <motion.div 
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: '0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
          variants={cardVariants}
          whileHover="hover"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'white',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Grid3x3 size={20} color="#667eea" />
              <span>Interactive Periodic Table</span>
            </div>
            <motion.div 
              style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                fontWeight: '600',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 16px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              variants={badgeVariants}
            >
              <Sparkles size={14} />
              {filteredElements.length} of {elements.length} elements
            </motion.div>
          </div>
          
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '8px',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: '0'
          }}>
            <PeriodicTable
              elements={filteredElements}
              onElementSelect={handleElementSelect}
              selectedElement={selectedElement}
              categoryColors={categoryColors}
            />
          </div>

          <motion.div 
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Element Categories
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px'
            }}>
              {Object.entries(categoryColors).map(([category, color], index) => (
                <motion.div 
                  key={category}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    cursor: 'default',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    backgroundColor: color + '20',
                    color: 'white',
                    border: `2px solid ${color}`
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: color + '40' }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.6 }}
                >
                  {category.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </motion.div>
              ))}
            </div>
            <motion.div 
              style={{
                fontSize: '0.7rem',
                color: '#94a3b8',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: '12px'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Click on any element to view detailed information below
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Element Details Section */}
        <div id="element-details" style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          border: '2px solid rgba(102, 126, 234, 0.3)',
          backdropFilter: 'blur(20px)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          height: '50vh',
          minHeight: '400px',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Animated Progress Bar */}
          <motion.div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              zIndex: 10
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(activeSection === 'name' ? 25 : activeSection === 'metrics' ? 50 : activeSection === 'highlights' ? 75 : 100)}%` }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Floating Selection Indicator */}
          <AnimatePresence>
            {showFloatingInfo && selectedElement && (
              <motion.div 
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                  zIndex: 20
                }}
                variants={floatingIndicatorVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
              >
                <TargetIcon size={24} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 5
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'white',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Box size={20} color="#667eea" />
              <span>Element Details</span>
              <motion.div 
                style={{
                  marginLeft: '12px',
                  background: isAutoScroll ? 
                    'linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)' : 
                    'linear-gradient(135deg, #FF6B6B 0%, #9D4EDD 100%)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                animate={{
                  scale: isPaused ? [1, 1.1, 1] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {isAutoScroll ? (
                  <>
                    <Play size={12} />
                    AUTO-SCROLL
                  </>
                ) : (
                  <>
                    <Pause size={12} />
                    MANUAL
                  </>
                )}
              </motion.div>
            </div>
            
            <AnimatePresence mode="wait">
              {selectedElement && (
                <motion.div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  key={selectedElement.number}
                  variants={elementSelectVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.div 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                    }}
                    variants={badgeVariants}
                    whileHover="hover"
                  >
                    <Globe size={16} />
                    <span>Selected:</span>
                    <span style={{ fontWeight: '800' }}>
                      {selectedElement.name} ({selectedElement.symbol})
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.4)'
          }}>
            {/* Animated Scroll Indicator */}
            <motion.div 
              style={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '12px',
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.3)'
              }}
              variants={scrollIndicatorVariants}
            >
              {['name', 'metrics', 'highlights', 'details'].map((section, index) => (
                <motion.div 
                  key={section}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: activeSection === section ? '#667eea' : '#cbd5e1'
                  }}
                  animate={{
                    scale: activeSection === section ? 1.5 : 1
                  }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              ))}
              <ChevronRight size={12} color="#667eea" />
            </motion.div>

            {/* Navigation Dots */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: '16px',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {['name', 'metrics', 'highlights', 'details'].map((section) => (
                <motion.div 
                  key={section}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    backgroundColor: activeSection === section ? '#667eea' : '#cbd5e1'
                  }}
                  animate={{
                    width: activeSection === section ? '16px' : '8px'
                  }}
                  whileHover={{ scale: 1.5 }}
                  onClick={() => scrollToSection(section)}
                />
              ))}
            </div>

            {/* Auto-Scroll Controls */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10
            }}>
              <motion.button
                onClick={toggleAutoScroll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  color: 'white',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isAutoScroll ? <Pause size={16} /> : <Play size={16} />}
                {isAutoScroll ? 'Pause' : 'Play'}
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedElement ? selectedElement.number : 'placeholder'}
                ref={detailsContainerRef}
                style={{
                  height: '100%',
                  overflowY: 'auto',
                  paddingRight: '8px',
                  scrollBehavior: 'smooth'
                }}
                onScroll={handleScroll}
                onMouseEnter={() => {
                  if (isAutoScroll && scrollIntervalRef.current) {
                    clearInterval(scrollIntervalRef.current);
                    scrollIntervalRef.current = null;
                  }
                }}
                onMouseLeave={() => {
                  if (isAutoScroll && !scrollIntervalRef.current) {
                    startAutoScroll();
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {selectedElement ? (
                  <>
                    {/* Element Name Display */}
                    <motion.div 
                      style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '20px',
                        padding: '32px 24px',
                        textAlign: 'center',
                        marginBottom: '24px',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)'
                      }}
                      animate={isPaused && activeSection === 'name' ? {
                        boxShadow: [
                          '0 0 20px rgba(102, 126, 234, 0.5)',
                          '0 0 40px rgba(102, 126, 234, 0.8)',
                          '0 0 20px rgba(102, 126, 234, 0.5)'
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#667eea',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        <Hash size={12} />
                        CURRENT ELEMENT
                      </div>
                      
                      <motion.h2 
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: '900',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          margin: '0 0 8px 0',
                          letterSpacing: '-1px'
                        }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        {selectedElement.name}
                      </motion.h2>
                      
                      <motion.div 
                        style={{
                          fontSize: '4rem',
                          fontWeight: '900',
                          color: 'white',
                          margin: '16px 0',
                          textShadow: '0 4px 20px rgba(102, 126, 234, 0.5)',
                          letterSpacing: '-2px'
                        }}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 200, 
                          damping: 15,
                          delay: 0.1 
                        }}
                      >
                        {selectedElement.symbol}
                      </motion.div>
                      
                      <div style={{
                        fontSize: '1rem',
                        color: '#94a3b8',
                        fontWeight: '500',
                        margin: '8px 0'
                      }}>
                        Atomic Number: <span style={{ color: '#667eea', fontWeight: '800' }}>{selectedElement.number}</span>
                      </div>
                      
                      <motion.div 
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#667eea',
                          background: 'rgba(102, 126, 234, 0.1)',
                          padding: '8px 24px',
                          borderRadius: '30px',
                          display: 'inline-block',
                          marginTop: '16px',
                          border: '2px solid rgba(102, 126, 234, 0.3)'
                        }}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(102, 126, 234, 0.2)' }}
                      >
                        {selectedElement.number}
                      </motion.div>
                      
                      <motion.div 
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '16px',
                          fontSize: '0.7rem',
                          color: '#667eea',
                          fontWeight: '600',
                          background: 'rgba(102, 126, 234, 0.1)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          border: '1px solid rgba(102, 126, 234, 0.3)'
                        }}
                        animate={{ 
                          scale: isPaused ? [1, 1.1, 1] : 1 
                        }}
                        transition={{ 
                          duration: 0.5,
                          repeat: Infinity 
                        }}
                      >
                        {isPaused ? 'PAUSED' : 'SCROLLING'}
                      </motion.div>
                    </motion.div>

                    {/* Key Metrics Row */}
                    <motion.div 
                      style={{
                        display: 'flex',
                        gap: '16px',
                        margin: '24px 0',
                        padding: '24px',
                        background: 'rgba(15, 23, 42, 0.4)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[
                        {
                          icon: Atom,
                          value: selectedElement.atomic_mass?.toFixed(2) || 'N/A',
                          label: 'Atomic Mass',
                          key: 'mass'
                        },
                        {
                          icon: Thermometer,
                          value: selectedElement.phase === 'Gas' ? 'Gas' : 
                                 selectedElement.phase === 'Liquid' ? 'Liquid' : 'Solid',
                          label: 'State',
                          key: 'state'
                        },
                        {
                          icon: Flame,
                          value: selectedElement.category.split(' ')[0],
                          label: 'Category',
                          key: 'category'
                        },
                        {
                          icon: Droplets,
                          value: selectedElement.density ? selectedElement.density.toFixed(2) : 'N/A',
                          label: 'Density (g/cm³)',
                          key: 'density'
                        }
                      ].map((metric, index) => (
                        <motion.div 
                          key={metric.key}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            flex: 1,
                            padding: '16px',
                            background: 'rgba(30, 41, 59, 0.6)',
                            borderRadius: '12px'
                          }}
                          variants={metricItemVariants}
                          whileHover="hover"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <metric.icon size={24} color="#667eea" style={{ marginBottom: '8px' }} />
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            color: '#667eea',
                            textShadow: '0 2px 10px rgba(102, 126, 234, 0.3)'
                          }}>
                            {metric.value}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textAlign: 'center'
                          }}>
                            {metric.label}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Highlighted Description Panel */}
                    {elementHighlights.length > 0 && (
                      <motion.div 
                        style={{
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          border: '2px solid rgba(102, 126, 234, 0.3)',
                          borderRadius: '16px',
                          padding: '24px',
                          margin: '24px 0',
                          position: 'relative',
                          overflow: 'hidden',
                          backdropFilter: 'blur(10px)'
                        }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '16px'
                        }}>
                          <Brain size={20} color="#667eea" />
                          <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '800',
                            color: 'white',
                            margin: 0,
                            letterSpacing: '0.5px'
                          }}>
                            Key Points & Interesting Facts
                          </h4>
                          <motion.div 
                            style={{
                              marginLeft: 'auto',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              color: '#667eea',
                              background: 'rgba(102, 126, 234, 0.1)',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              border: '1px solid rgba(102, 126, 234, 0.3)'
                            }}
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1
                            }}
                          >
                            IMPORTANT
                          </motion.div>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          {elementHighlights.map((highlight, index) => (
                            <motion.div 
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '12px 16px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #667eea',
                                fontSize: '0.9rem',
                                color: 'white'
                              }}
                              variants={highlightItemVariants}
                              whileHover="hover"
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.5 }}
                            >
                              <AlertCircle size={16} color="#667eea" style={{ marginTop: '2px' }} />
                              <span>{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Original Element Card */}
                    <motion.div 
                      style={{ 
                        marginTop: '24px'
                      }}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <ElementCard element={selectedElement} />
                    </motion.div>
                  </>
                ) : (
                  <motion.div 
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                      textAlign: 'center',
                      padding: '40px'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  >
                    <motion.div 
                      style={{ 
                        fontSize: '4rem', 
                        marginBottom: '20px'
                      }}
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      ⚛️
                    </motion.div>
                    <motion.p 
                      style={{ 
                        fontWeight: '800', 
                        fontSize: '1.5rem', 
                        marginBottom: '12px',
                        color: 'white'
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      No Element Selected
                    </motion.p>
                    <motion.p 
                      style={{ 
                        fontSize: '0.9rem',
                        color: '#94a3b8',
                        maxWidth: '300px',
                        lineHeight: '1.6'
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Click on any element in the periodic table above to view its details here
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default PeriodicTablePage;