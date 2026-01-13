import React from 'react';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactionVisualizer from '../components/ReactionVisualizer/ReactionVisualizer'
import organicReactionsData from '../assets/organicReactions.json'
import { Search, Filter, BookOpen } from 'lucide-react'

function OrganicReactions() {
  const [reactions, setReactions] = useState([])
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Load reactions data
    setReactions(organicReactionsData.reactions)
    if (organicReactionsData.reactions.length > 0) {
      setSelectedReaction(organicReactionsData.reactions[0])
    }
  }, [])

  const filteredReactions = reactions.filter(reaction => {
    const matchesSearch = reaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || reaction.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="organic-reactions">
      <div className="page-header" style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Organic Reactions</h1>
          <p style={styles.pageSubtitle}>
            Explore organic chemical reactions with interactive animations showing bond formation and breaking
          </p>
        </div>
        <div style={styles.headerIcon}>
          <BookOpen size={48} color="#10b981" />
        </div>
      </div>

      <div className="controls-section" style={styles.controlsSection}>
        <div style={styles.searchBox}>
          <Search size={20} color="#6b7280" />
          <input
            type="text"
            placeholder="Search reactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.filterGroup}>
          <Filter size={20} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="substitution">Substitution</option>
            <option value="addition">Addition</option>
            <option value="elimination">Elimination</option>
            <option value="oxidation">Oxidation</option>
            <option value="reduction">Reduction</option>
          </select>
        </div>
      </div>

      <div className="reactions-layout" style={styles.reactionsLayout}>
        <div className="reactions-list" style={styles.reactionsList}>
          <h3 style={styles.sectionTitle}>Available Reactions ({filteredReactions.length})</h3>
          <div className="reactions-grid">
            {filteredReactions.map((reaction) => (
              <div
                key={reaction.id}
                style={{
                  ...styles.reactionCard,
                  ...(selectedReaction?.id === reaction.id ? styles.selectedCard : {})
                }}
                onClick={() => setSelectedReaction(reaction)}
              >
                <h4 style={styles.reactionName}>{reaction.name}</h4>
                <p style={styles.reactionType}>{reaction.type}</p>
                <p style={styles.reactionDescription}>{reaction.description}</p>
                <div style={styles.reactionEquation}>
                  <span style={styles.equation}>{reaction.equation}</span>
                </div>
                <Link 
                  to={`/reaction/${reaction.id}`} 
                  style={styles.detailLink}
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="reaction-visualizer" style={styles.reactionVisualizer}>
          <h3 style={styles.sectionTitle}>Reaction Visualization</h3>
          {selectedReaction ? (
            <ReactionVisualizer reaction={selectedReaction} />
          ) : (
            <div style={styles.noSelection}>
              <p>Select a reaction to visualize</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: '#d1fae5',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageTitle: {
    fontSize: '2rem',
    color: '#065f46',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#047857',
    maxWidth: '800px'
  },
  headerIcon: {
    opacity: '0.8'
  },
  controlsSection: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: '1',
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'white',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    minWidth: '250px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    width: '100%'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'white',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #d1d5db'
  },
  filterSelect: {
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: 'transparent'
  },
  reactionsLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '30px'
  },
  reactionsList: {
    maxHeight: '600px',
    overflowY: 'auto'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '20px',
    fontWeight: '600'
  },
  reactionCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  selectedCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4'
  },
  reactionName: {
    fontSize: '1.2rem',
    color: '#1f2937',
    marginBottom: '8px',
    fontWeight: '600'
  },
  reactionType: {
    display: 'inline-block',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    marginBottom: '12px',
    fontWeight: '500'
  },
  reactionDescription: {
    color: '#6b7280',
    fontSize: '0.95rem',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  reactionEquation: {
    fontFamily: 'monospace',
    fontSize: '1.1rem',
    backgroundColor: '#f9fafb',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center'
  },
  equation: {
    color: '#1e40af',
    fontWeight: 'bold'
  },
  detailLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'inline-block'
  },
  reactionVisualizer: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  noSelection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#6b7280',
    fontSize: '1.1rem'
  }
}

export default OrganicReactions