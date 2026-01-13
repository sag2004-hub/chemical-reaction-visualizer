import React from 'react';
function ReactionDescription({ reaction }) {
  return (
    <div className="reaction-description" style={styles.container}>
      <h3 style={styles.title}>{reaction.name}</h3>
      
      <div style={styles.equationContainer}>
        <code style={styles.equation}>{reaction.equation}</code>
      </div>
      
      <div style={styles.description}>
        <p>{reaction.description}</p>
      </div>
      
      {reaction.details && (
        <div style={styles.details}>
          <h4 style={styles.sectionTitle}>Detailed Information</h4>
          <p>{reaction.details}</p>
        </div>
      )}
      
      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Type:</span>
          <span style={styles.infoValue}>{reaction.type}</span>
        </div>
        
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Category:</span>
          <span style={styles.infoValue}>{reaction.category}</span>
        </div>
        
        {reaction.conditions && (
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Conditions:</span>
            <span style={styles.infoValue}>{reaction.conditions}</span>
          </div>
        )}
        
        {reaction.catalyst && (
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Catalyst:</span>
            <span style={styles.infoValue}>{reaction.catalyst}</span>
          </div>
        )}
        
        {reaction.temperature && (
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Temperature:</span>
            <span style={styles.infoValue}>{reaction.temperature}</span>
          </div>
        )}
        
        {reaction.energy && (
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Energy Change:</span>
            <span style={styles.infoValue}>{reaction.energy}</span>
          </div>
        )}
      </div>
      
      {reaction.applications && (
        <div style={styles.applications}>
          <h4 style={styles.sectionTitle}>Applications</h4>
          <ul style={styles.applicationsList}>
            {reaction.applications.map((app, index) => (
              <li key={index} style={styles.applicationItem}>{app}</li>
            ))}
          </ul>
        </div>
      )}
      
      {reaction.safety && (
        <div style={styles.safety}>
          <h4 style={styles.sectionTitle}>Safety Notes</h4>
          <p style={styles.safetyText}>{reaction.safety}</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '1.8rem',
    color: '#1f2937',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  equationContainer: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px',
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  },
  equation: {
    color: '#1e40af',
    fontWeight: 'bold'
  },
  description: {
    marginBottom: '25px',
    lineHeight: '1.6',
    color: '#4b5563'
  },
  details: {
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#1f2937',
    marginBottom: '15px',
    fontWeight: '600'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 15px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  infoLabel: {
    color: '#6b7280',
    fontWeight: '500'
  },
  infoValue: {
    color: '#1f2937',
    fontWeight: '600'
  },
  applications: {
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981'
  },
  applicationsList: {
    paddingLeft: '20px'
  },
  applicationItem: {
    marginBottom: '8px',
    color: '#065f46',
    lineHeight: '1.5'
  },
  safety: {
    padding: '20px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    borderLeft: '4px solid #ef4444'
  },
  safetyText: {
    color: '#991b1b',
    lineHeight: '1.6'
  }
}

export default ReactionDescription