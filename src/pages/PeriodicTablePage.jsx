import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Zap, Grid3x3, Box, Info, AlertCircle, Atom, Flame, Droplets, Thermometer, ChevronRight, Target, Hash } from 'lucide-react';
import PeriodicTable from '../components/Elements/PeriodicTable';
import ElementCard from '../components/Elements/ElementCard';
import elementsData from '../assets/elements.json';

function PeriodicTablePage() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('details'); // 'details' or 'highlights'
  const [isPaused, setIsPaused] = useState(false);
  const detailsContainerRef = useRef(null);
  const elementNameRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    const data = elementsData.elements;
    setElements(data);
    if (data?.length > 0) {
      setSelectedElement(data[0]); // Hydrogen by default
    }

    // Clean up interval on unmount
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // Auto-scroll effect when selected element changes
  useEffect(() => {
    if (selectedElement && detailsContainerRef.current) {
      // Reset scroll position to top
      detailsContainerRef.current.scrollTop = 0;
      setActiveSection('details');
      setIsPaused(true);
      
      // Start with 2-second pause at the element name
      setTimeout(() => {
        setIsPaused(false);
        startAutoScroll();
      }, 2000);
    }
  }, [selectedElement]);

  const startAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    let hasPausedAtElement = false;

    scrollIntervalRef.current = setInterval(() => {
      if (isPaused || !detailsContainerRef.current) return;

      const container = detailsContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      // If we can scroll further
      if (container.scrollTop < scrollHeight - clientHeight) {
        // Smooth scroll by 15px every 50ms (300px per second)
        container.scrollTop += 15;
        
        // Pause at element name section (first 100px) if not already paused there
        if (!hasPausedAtElement && container.scrollTop < 100) {
          container.scrollTop = 0;
          hasPausedAtElement = true;
          setIsPaused(true);
          
          setTimeout(() => {
            setIsPaused(false);
          }, 2000);
        }
        
        // Check if we reached the bottom
        if (container.scrollTop >= scrollHeight - clientHeight - 15) {
          // Pause for 2 seconds at the bottom
          clearInterval(scrollIntervalRef.current);
          setIsPaused(true);
          
          setTimeout(() => {
            // Scroll back to top
            container.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            hasPausedAtElement = false;
            setIsPaused(false);
            
            // Restart scrolling after 1 second
            setTimeout(startAutoScroll, 1000);
          }, 2000);
        }
      }
    }, 50);
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsPaused(true);
  };

  const resumeAutoScroll = () => {
    setIsPaused(false);
    startAutoScroll();
  };

  const handleScroll = (e) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    
    // Determine which section is currently visible
    if (scrollTop < 150) {
      setActiveSection('name');
    } else if (scrollTop < 300) {
      setActiveSection('metrics');
    } else if (scrollTop < 450) {
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
    // Scroll to element details with smooth animation
    setTimeout(() => {
      document.getElementById('element-details')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 50);
  };

  // Function to get interesting facts about the element
  const getElementHighlights = (element) => {
    const highlights = [];
    
    if (element) {
      // Atomic number highlights
      if (element.number === 1) highlights.push("First and lightest element in the universe");
      if (element.number === 2) highlights.push("Second most abundant element in the universe");
      if (element.number === 6) highlights.push("Basis of all organic chemistry");
      if (element.number === 8) highlights.push("Essential for respiration and combustion");
      if (element.number === 26) highlights.push("Most abundant element in Earth's core");
      if (element.number === 79) highlights.push("Highly inert and corrosion-resistant");
      if (element.number === 92) highlights.push("Heaviest naturally occurring element");
      
      // Category-based highlights
      if (element.category === 'noble gas') highlights.push("Inert and non-reactive under normal conditions");
      if (element.category === 'halogen') highlights.push("Highly reactive nonmetals");
      if (element.category === 'alkali metal') highlights.push("Extremely reactive with water");
      if (element.category === 'transition metal') highlights.push("Forms colorful compounds");
      
      // State-based highlights
      if (element.phase === 'Gas' && element.number !== 2) highlights.push("Exists as gas at room temperature");
      if (element.phase === 'Liquid') highlights.push("Liquid at room temperature (rare)");
      
      // Abundance highlights
      if (element.name === 'Oxygen') highlights.push("Most abundant element in Earth's crust");
      if (element.name === 'Silicon') highlights.push("Second most abundant element in Earth's crust");
      
      // Special properties
      if (element.molar_heat) highlights.push(`Molar heat capacity: ${element.molar_heat} J/(mol·K)`);
      if (element.boil) highlights.push(`Boiling point: ${element.boil} K`);
      if (element.melt) highlights.push(`Melting point: ${element.melt} K`);
    }
    
    return highlights.slice(0, 4); // Return top 4 highlights
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      flexShrink: 0
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '0.75rem',
      color: '#64748b',
      marginTop: '2px',
      fontWeight: '500'
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    searchContainer: {
      position: 'relative'
    },
    searchInput: {
      padding: '8px 12px 8px 36px',
      width: '240px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.85rem',
      backgroundColor: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      color: '#334155'
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      backgroundColor: 'white',
      transition: 'all 0.3s ease'
    },
    select: {
      border: 'none',
      background: 'transparent',
      fontSize: '0.85rem',
      outline: 'none',
      cursor: 'pointer',
      minWidth: '120px',
      fontWeight: '500',
      color: '#334155'
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 24px',
      gap: '16px',
      overflow: 'hidden'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: '0'
    },
    tableHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #f1f5f9'
    },
    tableTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    elementsCount: {
      fontSize: '0.75rem',
      color: '#64748b',
      fontWeight: '500',
      backgroundColor: '#f1f5f9',
      padding: '4px 10px',
      borderRadius: '16px'
    },
    tableWrapper: {
      flex: 1,
      overflow: 'auto',
      padding: '8px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      minHeight: '0'
    },
    detailsContainer: {
      backgroundColor: 'white',
      borderRadius: '10px',
      border: '2px solid #3b82f6',
      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      height: '40vh',
      minHeight: '300px',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden'
    },
    detailsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #f1f5f9'
    },
    detailsTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    currentElement: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    selectedBadge: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    cardWrapper: {
      flex: 1,
      overflow: 'hidden',
      position: 'relative'
    },
    cardContent: {
      height: '100%',
      overflowY: 'auto',
      paddingRight: '4px',
      scrollBehavior: 'smooth'
    },
    placeholder: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      textAlign: 'center',
      padding: '20px'
    },
    legend: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #f1f5f9',
      flexShrink: 0
    },
    legendTitle: {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '8px'
    },
    legendGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '6px'
    },
    legendItem: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '500',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'default',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    infoText: {
      fontSize: '0.7rem',
      color: '#94a3b8',
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: '8px'
    },
    // New styles for highlighted description panel
    highlightsPanel: {
      backgroundColor: '#f0f9ff',
      border: '2px solid #0ea5e9',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '12px',
      position: 'relative',
      overflow: 'hidden'
    },
    highlightsHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '10px'
    },
    highlightsTitle: {
      fontSize: '0.85rem',
      fontWeight: '700',
      color: '#0c4a6e',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    highlightsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    highlightItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      padding: '6px 8px',
      backgroundColor: 'white',
      borderRadius: '6px',
      borderLeft: '3px solid #0ea5e9',
      fontSize: '0.8rem',
      color: '#1e293b'
    },
    highlightIcon: {
      color: '#0ea5e9',
      flexShrink: 0,
      marginTop: '2px'
    },
    elementMetrics: {
      display: 'flex',
      gap: '12px',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #e2e8f0'
    },
    metricItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      flex: 1
    },
    metricValue: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#3b82f6'
    },
    metricLabel: {
      fontSize: '0.7rem',
      color: '#64748b',
      fontWeight: '500',
      textAlign: 'center'
    },
    metricIcon: {
      color: '#3b82f6',
      marginBottom: '4px'
    },
    // Element name display
    elementNameDisplay: {
      backgroundColor: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      border: '2px solid #0ea5e9',
      borderRadius: '10px',
      padding: '16px',
      textAlign: 'center',
      marginBottom: '16px',
      position: 'relative',
      overflow: 'hidden'
    },
    elementName: {
      fontSize: '2rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 4px 0'
    },
    elementSymbol: {
      fontSize: '3.5rem',
      fontWeight: '900',
      color: '#1e293b',
      margin: '8px 0',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
    },
    elementNumber: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#64748b',
      backgroundColor: '#f1f5f9',
      padding: '4px 12px',
      borderRadius: '20px',
      display: 'inline-block',
      marginTop: '8px'
    },
    // Auto-scroll indicator styles
    scrollIndicator: {
      position: 'absolute',
      top: '50%',
      right: '8px',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '12px',
      padding: '8px 4px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      zIndex: 10
    },
    indicatorDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    },
    // Navigation dots
    navigationDots: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '8px',
      display: 'flex',
      gap: '6px',
      zIndex: 10
    },
    navDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    // Pause indicator
    pauseIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(59, 130, 246, 0.9)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      animation: 'pulse 2s infinite'
    }
  };

  // Standard periodic table category colors (Wikipedia/Google style)
  const categoryColors = {
    'alkali metal': '#ff6666',           // Bright red
    'alkaline earth metal': '#ffde59',    // Yellow
    'transition metal': '#ffb347',        // Orange
    'post-transition metal': '#a1c6c7',   // Light blue-gray
    'metalloid': '#8cff98',               // Light green
    'nonmetal': '#a1c6ff',                // Light blue
    'halogen': '#ffb3e6',                 // Pink
    'noble gas': '#c79fef',               // Light purple
    'lanthanide': '#ff99cc',              // Light pink
    'actinide': '#ff9999'                 // Light coral
  };

  // Get highlights for current element
  const elementHighlights = getElementHighlights(selectedElement);

  // Scroll to specific section
  const scrollToSection = (section) => {
    if (!detailsContainerRef.current) return;
    
    const container = detailsContainerRef.current;
    let scrollTop = 0;
    
    if (section === 'name') {
      scrollTop = 0;
    } else if (section === 'metrics') {
      scrollTop = 200;
    } else if (section === 'highlights') {
      scrollTop = 320;
    } else if (section === 'details') {
      scrollTop = 480;
    }
    
    container.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
    setActiveSection(section);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        @keyframes highlightPulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      `}</style>
      
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Zap size={18} />
          </div>
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>Periodic Table Explorer</h1>
            <p style={styles.subtitle}>Interactive visualization of chemical elements</p>
          </div>
        </div>

        <div style={styles.controls}>
          <div style={styles.searchContainer}>
            <Search
              size={14}
              color="#94a3b8"
              style={{ 
                position: 'absolute', 
                left: 12, 
                top: '50%', 
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search elements..."
              style={{
                ...styles.searchInput,
                borderColor: searchTerm ? '#3b82f6' : '#e2e8f0',
                boxShadow: searchTerm ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none'
              }}
            />
          </div>

          <div style={{
            ...styles.filterContainer,
            borderColor: filter !== 'all' ? '#3b82f6' : '#e2e8f0'
          }}>
            <Filter size={14} color="#64748b" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Periodic Table Section */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <div style={styles.tableTitle}>
              <Grid3x3 size={16} color="#3b82f6" />
              Periodic Table
            </div>
            <div style={styles.elementsCount}>
              {filteredElements.length} of {elements.length} elements
            </div>
          </div>
          
          <div style={styles.tableWrapper}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <PeriodicTable
                elements={filteredElements}
                onElementSelect={handleElementSelect}
                selectedElement={selectedElement}
                categoryColors={categoryColors}
              />
            </div>
          </div>

          <div style={styles.legend}>
            <div style={styles.legendTitle}>Element Categories</div>
            <div style={styles.legendGrid}>
              {Object.entries(categoryColors).map(([category, color]) => (
                <div 
                  key={category}
                  style={{
                    ...styles.legendItem,
                    backgroundColor: color,
                    color: '#1e293b',
                    fontWeight: '600',
                    border: `1px solid ${color}80`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {category.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </div>
              ))}
            </div>
            <div style={styles.infoText}>
              Click on any element to view detailed information below
            </div>
          </div>
        </div>

        {/* Enhanced Element Details Section with Auto-Scroll */}
        <div id="element-details" style={styles.detailsContainer}>
          <div style={styles.detailsHeader}>
            <div style={styles.detailsTitle}>
              <Box size={16} color="#3b82f6" />
              Element Details
              <div style={{
                marginLeft: '8px',
                backgroundColor: isPaused ? '#f59e0b' : '#3b82f6',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {isPaused ? 'PAUSED' : 'AUTO-SCROLL'}
              </div>
            </div>
            
            <div style={styles.currentElement}>
              {selectedElement && (
                <div style={styles.selectedBadge}>
                  <span style={{ fontSize: '0.7rem' }}>Selected:</span>
                  <span style={{ fontWeight: '700' }}>
                    {selectedElement.name} ({selectedElement.symbol})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.cardWrapper}>
            {/* Scroll Indicator */}
            <div style={styles.scrollIndicator}>
              <div style={{
                ...styles.indicatorDot,
                backgroundColor: activeSection === 'name' ? '#3b82f6' : '#cbd5e1'
              }} />
              <div style={{
                ...styles.indicatorDot,
                backgroundColor: activeSection === 'metrics' ? '#3b82f6' : '#cbd5e1'
              }} />
              <div style={{
                ...styles.indicatorDot,
                backgroundColor: activeSection === 'highlights' ? '#3b82f6' : '#cbd5e1'
              }} />
              <div style={{
                ...styles.indicatorDot,
                backgroundColor: activeSection === 'details' ? '#3b82f6' : '#cbd5e1'
              }} />
              <ChevronRight size={12} color="#64748b" />
            </div>

            {/* Navigation Dots */}
            <div style={styles.navigationDots}>
              <div 
                style={{
                  ...styles.navDot,
                  backgroundColor: activeSection === 'name' ? '#3b82f6' : '#cbd5e1',
                  width: activeSection === 'name' ? '12px' : '6px'
                }}
                onClick={() => scrollToSection('name')}
              />
              <div 
                style={{
                  ...styles.navDot,
                  backgroundColor: activeSection === 'metrics' ? '#3b82f6' : '#cbd5e1',
                  width: activeSection === 'metrics' ? '12px' : '6px'
                }}
                onClick={() => scrollToSection('metrics')}
              />
              <div 
                style={{
                  ...styles.navDot,
                  backgroundColor: activeSection === 'highlights' ? '#3b82f6' : '#cbd5e1',
                  width: activeSection === 'highlights' ? '12px' : '6px'
                }}
                onClick={() => scrollToSection('highlights')}
              />
              <div 
                style={{
                  ...styles.navDot,
                  backgroundColor: activeSection === 'details' ? '#3b82f6' : '#cbd5e1',
                  width: activeSection === 'details' ? '12px' : '6px'
                }}
                onClick={() => scrollToSection('details')}
              />
            </div>

            {/* Pause Indicator */}
            {isPaused && activeSection === 'name' && selectedElement && (
              <div style={styles.pauseIndicator}>
                <Target size={14} />
                Viewing: {selectedElement.name}
              </div>
            )}

            {/* Scrollable Content */}
            <div 
              ref={detailsContainerRef}
              style={styles.cardContent}
              onScroll={handleScroll}
              onMouseEnter={stopAutoScroll}
              onMouseLeave={resumeAutoScroll}
            >
              {selectedElement ? (
                <>
                  {/* Element Name Display - First with 2-second pause */}
                  <div 
                    ref={elementNameRef}
                    style={{
                      ...styles.elementNameDisplay,
                      animation: isPaused && activeSection === 'name' ? 'highlightPulse 2s infinite' : 'none'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      color: '#3b82f6'
                    }}>
                      <Hash size={12} />
                      CURRENT ELEMENT
                    </div>
                    
                    <h2 style={styles.elementName}>
                      {selectedElement.name}
                    </h2>
                    
                    <div style={styles.elementSymbol}>
                      {selectedElement.symbol}
                    </div>
                    
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: '500',
                      margin: '8px 0'
                    }}>
                      Atomic Number: <span style={{ color: '#3b82f6', fontWeight: '700' }}>{selectedElement.number}</span>
                    </div>
                    
                    <div style={styles.elementNumber}>
                      {selectedElement.number}
                    </div>
                    
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      fontSize: '0.6rem',
                      color: '#94a3b8',
                      fontStyle: 'italic'
                    }}>
                      Paused for 2 seconds
                    </div>
                  </div>

                  {/* Key Metrics Row */}
                  <div style={styles.elementMetrics}>
                    <div style={styles.metricItem}>
                      <Atom size={18} style={styles.metricIcon} />
                      <div style={styles.metricValue}>{selectedElement.atomic_mass?.toFixed(2) || 'N/A'}</div>
                      <div style={styles.metricLabel}>Atomic Mass</div>
                    </div>
                    <div style={styles.metricItem}>
                      <Thermometer size={18} style={styles.metricIcon} />
                      <div style={styles.metricValue}>
                        {selectedElement.phase === 'Gas' ? 'Gas' : 
                         selectedElement.phase === 'Liquid' ? 'Liquid' : 'Solid'}
                      </div>
                      <div style={styles.metricLabel}>State</div>
                    </div>
                    <div style={styles.metricItem}>
                      <Flame size={18} style={styles.metricIcon} />
                      <div style={styles.metricValue}>
                        {selectedElement.category.split(' ')[0]}
                      </div>
                      <div style={styles.metricLabel}>Category</div>
                    </div>
                    <div style={styles.metricItem}>
                      <Droplets size={18} style={styles.metricIcon} />
                      <div style={styles.metricValue}>
                        {selectedElement.density ? selectedElement.density.toFixed(2) : 'N/A'}
                      </div>
                      <div style={styles.metricLabel}>Density (g/cm³)</div>
                    </div>
                  </div>

                  {/* Highlighted Description Panel */}
                  {elementHighlights.length > 0 && (
                    <div style={styles.highlightsPanel}>
                      <div style={styles.highlightsHeader}>
                        <AlertCircle size={14} color="#0c4a6e" />
                        <h4 style={styles.highlightsTitle}>Key Points & Interesting Facts</h4>
                      </div>
                      <div style={styles.highlightsList}>
                        {elementHighlights.map((highlight, index) => (
                          <div key={index} style={styles.highlightItem}>
                            <Info size={12} style={styles.highlightIcon} />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        right: '8px',
                        fontSize: '0.6rem',
                        fontWeight: '700',
                        color: '#0ea5e9',
                        backgroundColor: 'white',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        border: '1px solid #0ea5e9'
                      }}>
                        IMPORTANT
                      </div>
                    </div>
                  )}

                  {/* Original Element Card */}
                  <div style={{ marginTop: '16px' }}>
                    <ElementCard element={selectedElement} />
                  </div>
                </>
              ) : (
                <div style={styles.placeholder}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚛️</div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '6px' }}>
                    No Element Selected
                  </p>
                  <p style={{ fontSize: '0.8rem' }}>
                    Click on any element in the periodic table above to view its details here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PeriodicTablePage;