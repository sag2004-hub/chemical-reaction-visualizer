import React from 'react'

function ElementCard({ element }) {
  if (!element) return null

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

  const formatNumber = (value, suffix = '') =>
    typeof value === 'number' ? `${value}${suffix}` : 'N/A'

  return (
    <div className="element-card" style={styles.container}>
      <div
        className="element-header"
        style={{
          ...styles.header,
          backgroundColor: categoryColors[element.category] || '#e5e7eb'
        }}
      >
        <div style={styles.symbolContainer}>
          <div style={styles.atomicNumber}>{element.number}</div>
          <div style={styles.symbol}>{element.symbol}</div>
        </div>
        <div style={styles.nameContainer}>
          <h3 style={styles.name}>{element.name}</h3>
          <div style={styles.category}>{element.category || 'Unknown'}</div>
        </div>
      </div>

      <div className="element-body" style={styles.body}>
        <div style={styles.properties}>
          <div style={styles.property}>
            <span style={styles.propertyLabel}>Atomic Mass:</span>
            <span style={styles.propertyValue}>
              {typeof element.atomic_mass === 'number'
                ? `${element.atomic_mass.toFixed(4)} u`
                : 'N/A'}
            </span>
          </div>

          <div style={styles.property}>
            <span style={styles.propertyLabel}>Phase:</span>
            <span style={styles.propertyValue}>
              {element.phase || 'N/A'}
            </span>
          </div>

          <div style={styles.property}>
            <span style={styles.propertyLabel}>Density:</span>
            <span style={styles.propertyValue}>
              {formatNumber(element.density, ' g/cm³')}
            </span>
          </div>

          <div style={styles.property}>
            <span style={styles.propertyLabel}>Melting Point:</span>
            <span style={styles.propertyValue}>
              {formatNumber(element.melt, ' K')}
            </span>
          </div>

          <div style={styles.property}>
            <span style={styles.propertyLabel}>Boiling Point:</span>
            <span style={styles.propertyValue}>
              {formatNumber(element.boil, ' K')}
            </span>
          </div>

          <div style={styles.property}>
            <span style={styles.propertyLabel}>Electronegativity:</span>
            <span style={styles.propertyValue}>
              {formatNumber(element.electronegativity_pauling)}
            </span>
          </div>

          <div style={styles.property}>
            <span style={styles.propertyLabel}>Electron Configuration:</span>
            <span style={styles.propertyValue}>
              {element.electron_configuration || 'N/A'}
            </span>
          </div>
        </div>

        <div style={styles.summary}>
          <h4 style={styles.summaryTitle}>Summary</h4>
          <p style={styles.summaryText}>
            {element.summary || 'No summary available.'}
          </p>
        </div>

        {element.discovered_by && (
          <div style={styles.discovery}>
            <span style={styles.discoveryLabel}>Discovered by:</span>
            <span style={styles.discoveryValue}>
              {element.discovered_by}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}


const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  header: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  symbolContainer: {
    textAlign: 'center',
    minWidth: '80px'
  },
  atomicNumber: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1f2937',
    opacity: '0.8'
  },
  symbol: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  nameContainer: {
    flex: '1'
  },
  name: {
    fontSize: '1.8rem',
    color: '#1f2937',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  category: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: '#1f2937',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  body: {
    padding: '25px'
  },
  properties: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  property: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  propertyLabel: {
    color: '#6b7280',
    fontWeight: '500'
  },
  propertyValue: {
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '60%',
    wordBreak: 'break-word'
  },
  summary: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6'
  },
  summaryTitle: {
    fontSize: '1.2rem',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: '600'
  },
  summaryText: {
    color: '#4b5563',
    lineHeight: '1.6'
  },
  discovery: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    borderLeft: '4px solid #f59e0b'
  },
  discoveryLabel: {
    color: '#92400e',
    fontWeight: '500'
  },
  discoveryValue: {
    color: '#92400e',
    fontWeight: '600'
  }
}

export default ElementCard