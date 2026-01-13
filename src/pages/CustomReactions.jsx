import React from 'react';
import { useState } from 'react'
import CustomReactionBuilder from '../components/CustomReaction/CustomReactionBuilder'
import CustomReactionList from '../components/CustomReaction/CustomReactionList'
import ReactionEditor from '../components/CustomReaction/ReactionEditor'
import { PlusCircle, FlaskConical, Save } from 'lucide-react'

function CustomReactions() {
  const [customReactions, setCustomReactions] = useState([])
  const [editingReaction, setEditingReaction] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const handleSaveReaction = (reaction) => {
    if (editingReaction) {
      // Update existing reaction
      setCustomReactions(prev => 
        prev.map(r => r.id === reaction.id ? reaction : r)
      )
      setEditingReaction(null)
    } else {
      // Add new reaction
      const newReaction = {
        ...reaction,
        id: Date.now().toString(),
        dateCreated: new Date().toISOString()
      }
      setCustomReactions(prev => [...prev, newReaction])
    }
    setShowEditor(false)
  }

  const handleEditReaction = (reaction) => {
    setEditingReaction(reaction)
    setShowEditor(true)
  }

  const handleDeleteReaction = (id) => {
    setCustomReactions(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="custom-reactions">
      <div className="page-header" style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Custom Reactions Builder</h1>
          <p style={styles.pageSubtitle}>
            Create, visualize, and save your own chemical reactions. Experiment with different compounds!
          </p>
        </div>
        <div style={styles.headerIcon}>
          <FlaskConical size={48} color="#8b5cf6" />
        </div>
      </div>

      {showEditor ? (
        <div className="editor-section" style={styles.editorSection}>
          <div style={styles.editorHeader}>
            <h2 style={styles.editorTitle}>
              {editingReaction ? 'Edit Reaction' : 'Create New Reaction'}
            </h2>
            <button
              onClick={() => {
                setShowEditor(false)
                setEditingReaction(null)
              }}
              style={styles.backButton}
            >
              ← Back to Reactions
            </button>
          </div>
          <ReactionEditor
            reaction={editingReaction}
            onSave={handleSaveReaction}
            onCancel={() => {
              setShowEditor(false)
              setEditingReaction(null)
            }}
          />
        </div>
      ) : (
        <>
          <div className="builder-section" style={styles.builderSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <PlusCircle size={24} /> Build Your Reaction
              </h2>
              <button
                onClick={() => setShowEditor(true)}
                style={styles.newButton}
              >
                <PlusCircle size={20} /> Create New Reaction
              </button>
            </div>
            <CustomReactionBuilder
              onSave={handleSaveReaction}
              initialReaction={editingReaction}
            />
          </div>

          {customReactions.length > 0 && (
            <div className="saved-section" style={styles.savedSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  <Save size={24} /> Your Saved Reactions ({customReactions.length})
                </h2>
              </div>
              <CustomReactionList
                reactions={customReactions}
                onEdit={handleEditReaction}
                onDelete={handleDeleteReaction}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  pageHeader: {
    backgroundColor: '#f3f4f6',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageTitle: {
    fontSize: '2rem',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#6b7280',
    maxWidth: '800px'
  },
  headerIcon: {
    opacity: '0.8'
  },
  builderSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  savedSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#1f2937',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  newButton: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s'
  },
  editorSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  editorTitle: {
    fontSize: '1.5rem',
    color: '#1f2937',
    fontWeight: '600'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '0.95rem'
  }
}

export default CustomReactions