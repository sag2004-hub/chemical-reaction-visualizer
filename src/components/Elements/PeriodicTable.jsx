import React from 'react'

function PeriodicTable({ elements, onElementSelect, selectedElement }) {
  const getElementStyle = (element) => {
    const categoryColors = {
      'alkali metal': '#fca5a5',
      'alkaline earth metal': '#fdba74',
      'transition metal': '#fde047',
      'post-transition metal': '#86efac',
      'metalloid': '#5eead4',
      'nonmetal': '#7dd3fc',
      'halogen': '#a5b4fc',
      'noble gas': '#d8b4fe',
      'lanthanide': '#f0abfc',
      'actinide': '#fda4af'
    }

    const isSelected = selectedElement?.number === element.number;
    
    return {
      backgroundColor: categoryColors[element.category] || '#e5e7eb',
      color: '#1f2937',
      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
      boxShadow: isSelected 
        ? '0 0 0 2px #3b82f6, 0 2px 8px rgba(0, 0, 0, 0.15)' 
        : '0 1px 3px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      zIndex: isSelected ? '2' : '1'
    }
  }

  const handleClick = (element) => {
    onElementSelect(element);
  };

  // Calculate optimal cell size based on container
  const cellSize = 'minmax(50px, 1fr)'; // Fixed minimum size for full visibility

  return (
    <div style={styles.wrapper}>
      <div className="periodic-table" style={{
        ...styles.container,
        gridTemplateColumns: `repeat(18, ${cellSize})`
      }}>
        {elements.map((element) => (
          <div
            key={element.number}
            className={`element-cell ${selectedElement?.number === element.number ? 'selected' : ''}`}
            style={{
              ...styles.elementCell,
              ...getElementStyle(element),
              gridColumn: element.xpos || 1,
              gridRow: element.ypos || 1
            }}
            onClick={() => handleClick(element)}
            title={`${element.name} (${element.symbol})`}
            onMouseEnter={(e) => {
              if (selectedElement?.number !== element.number) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.12)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedElement?.number !== element.number) {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }
            }}
          >
            <div style={styles.atomicNumber}>{element.number}</div>
            <div style={styles.symbol}>{element.symbol}</div>
            <div style={styles.name}>{element.name}</div>
            <div style={styles.atomicMass}>
              {typeof element.atomic_mass === 'number'
                ? element.atomic_mass.toFixed(1)
                : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '5px'
  },
  container: {
    display: 'grid',
    gap: '2px',
    backgroundColor: 'white',
    borderRadius: '6px',
    padding: '8px',
    width: 'fit-content',
    minWidth: '100%',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  elementCell: {
    padding: '6px 2px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    position: 'relative',
    minHeight: '60px',
    minWidth: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    fontSize: 'clamp(0.5rem, 0.8vw, 0.7rem)',
    aspectRatio: '1'
  },
  atomicNumber: {
    position: 'absolute',
    top: '3px',
    left: '4px',
    fontSize: '0.55rem',
    fontWeight: '700',
    opacity: '0.8',
    color: '#374151'
  },
  symbol: {
    fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
    fontWeight: '800',
    marginBottom: '2px',
    color: '#1f2937',
    lineHeight: '1'
  },
  name: {
    fontSize: 'clamp(0.5rem, 0.7vw, 0.65rem)',
    fontWeight: '600',
    color: '#4b5563',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    padding: '0 1px',
    lineHeight: '1.1'
  },
  atomicMass: {
    fontSize: 'clamp(0.45rem, 0.6vw, 0.55rem)',
    opacity: '0.9',
    color: '#6b7280',
    fontWeight: '500',
    marginTop: '1px'
  }
}

export default PeriodicTable