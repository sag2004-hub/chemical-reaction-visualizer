import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ReactionVisualizer from '../components/ReactionVisualizer/ReactionVisualizer'
import ReactionDescription from '../components/ReactionVisualizer/ReactionDescription'
import organicReactionsData from '../assets/organicReactions.json'
import inorganicReactionsData from '../assets/inorganicReactions.json'
import { ArrowLeft, BookOpen, Zap, Download, Share2 } from 'lucide-react'

function ReactionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reaction, setReaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('animation')

  useEffect(() => {
    // Find reaction in both datasets
    const allReactions = [
      ...organicReactionsData.reactions,
      ...inorganicReactionsData.reactions
    ]
    
    const foundReaction = allReactions.find(r => r.id === id)
    setReaction(foundReaction)
    setLoading(false)
  }, [id])

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p>Loading reaction details...</p>
      </div>
    )
  }

  if (!reaction) {
    return (
      <div style={styles.notFound}>
        <h2>Reaction not found</h2>
        <button 
          onClick={() => navigate('/')}
          style={styles.backButton}
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="reaction-detail">
      <div className="detail-header" style={styles.detailHeader}>
        <button 
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          <ArrowLeft size={20} /> Back
        </button>
        
        <div style={styles.headerContent}>
          <h1 style={styles.reactionTitle}>{reaction.name}</h1>
          <div style={styles.reactionMeta}>
            <span style={styles.reactionType}>{reaction.type}</span>
            <span style={styles.reactionCategory}>
              {reaction.category === 'organic' ? 'Organic' : 'Inorganic'}
            </span>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.actionButton} onClick={handleShare}>
            <Share2 size={20} /> Share
          </button>
        </div>
      </div>

      <div className="tabs" style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'animation' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('animation')}
        >
          <Zap size={20} /> Animation
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'description' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('description')}
        >
          <BookOpen size={20} /> Description
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'mechanism' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('mechanism')}
        >
          <BookOpen size={20} /> Mechanism
        </button>
      </div>

      <div className="tab-content" style={styles.tabContent}>
        {activeTab === 'animation' && (
          <div className="animation-tab">
            <ReactionVisualizer 
              reaction={reaction} 
              type={reaction.category}
              showControls={true}
            />
          </div>
        )}

        {activeTab === 'description' && (
          <div className="description-tab">
            <ReactionDescription reaction={reaction} />
          </div>
        )}

        {activeTab === 'mechanism' && (
          <div className="mechanism-tab" style={styles.mechanismTab}>
            <h3 style={styles.sectionTitle}>Reaction Mechanism</h3>
            {reaction.mechanism ? (
              <div style={styles.mechanismContent}>
                <p style={styles.mechanismText}>{reaction.mechanism}</p>
                {reaction.steps && (
                  <div style={styles.stepsContainer}>
                    <h4 style={styles.stepsTitle}>Step-by-step Process:</h4>
                    <ol style={styles.stepsList}>
                      {reaction.steps.map((step, index) => (
                        <li key={index} style={styles.stepItem}>
                          <strong style={styles.stepNumber}>Step {index + 1}:</strong>
                          <span style={styles.stepText}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <p style={styles.noMechanism}>No mechanism details available for this reaction.</p>
            )}
          </div>
        )}
      </div>

      <div className="reaction-info" style={styles.reactionInfo}>
        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>Reaction Equation</h4>
          <div style={styles.equationDisplay}>
            <code style={styles.equationCode}>{reaction.equation}</code>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>Key Information</h4>
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
          </div>
        </div>

        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>Compounds Involved</h4>
          <div style={styles.compoundsList}>
            {reaction.reactants?.map((compound, index) => (
              <div key={index} style={styles.compoundItem}>
                <span style={styles.compoundName}>{compound.name}</span>
                <span style={styles.compoundFormula}>{compound.formula}</span>
              </div>
            ))}
            <div style={styles.arrow}>→</div>
            {reaction.products?.map((compound, index) => (
              <div key={index} style={styles.compoundItem}>
                <span style={styles.compoundName}>{compound.name}</span>
                <span style={styles.compoundFormula}>{compound.formula}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#6b7280'
  },
  notFound: {
    textAlign: 'center',
    padding: '50px 20px'
  },
  detailHeader: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem'
  },
  headerContent: {
    flex: '1'
  },
  reactionTitle: {
    fontSize: '1.8rem',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  reactionMeta: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  reactionType: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  reactionCategory: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '10px'
  },
  tab: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s'
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  tabContent: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  mechanismTab: {
    minHeight: '300px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '20px',
    fontWeight: '600'
  },
  mechanismContent: {
    lineHeight: '1.6'
  },
  mechanismText: {
    marginBottom: '20px',
    color: '#4b5563'
  },
  stepsContainer: {
    marginTop: '20px'
  },
  stepsTitle: {
    fontSize: '1.2rem',
    color: '#1f2937',
    marginBottom: '15px',
    fontWeight: '600'
  },
  stepsList: {
    paddingLeft: '20px'
  },
  stepItem: {
    marginBottom: '15px',
    color: '#4b5563',
    lineHeight: '1.5'
  },
  stepNumber: {
    color: '#1e40af',
    marginRight: '10px'
  },
  stepText: {
    color: '#4b5563'
  },
  noMechanism: {
    color: '#6b7280',
    fontStyle: 'italic'
  },
  reactionInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  infoTitle: {
    fontSize: '1.2rem',
    color: '#1f2937',
    marginBottom: '15px',
    fontWeight: '600'
  },
  equationDisplay: {
    backgroundColor: '#f9fafb',
    padding: '15px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '1.1rem',
    color: '#1e40af',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  equationCode: {
    display: 'block'
  },
  infoGrid: {
    display: 'grid',
    gap: '10px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '8px',
    borderBottom: '1px solid #e5e7eb'
  },
  infoLabel: {
    color: '#6b7280',
    fontWeight: '500'
  },
  infoValue: {
    color: '#1f2937',
    fontWeight: '600'
  },
  compoundsList: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px'
  },
  compoundItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '10px',
    borderRadius: '8px',
    minWidth: '100px'
  },
  compoundName: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '5px'
  },
  compoundFormula: {
    fontSize: '1.1rem',
    color: '#1e40af',
    fontWeight: 'bold'
  },
  arrow: {
    fontSize: '1.5rem',
    color: '#6b7280',
    margin: '0 5px'
  }
}

export default ReactionDetail