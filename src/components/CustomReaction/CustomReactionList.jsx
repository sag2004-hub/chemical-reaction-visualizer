import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Edit, Trash2, Eye, Calendar, Zap, 
  Flame, Atom, Clock, AlertCircle 
} from 'lucide-react';
import ReactionAnimation from '../ReactionVisualizer/ReactionAnimation';
import Modal from '../common/Modal';

function CustomReactionList({ reactions, onEdit, onDelete }) {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [previewReaction, setPreviewReaction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReactions = reactions.filter(reaction => {
    const matchesSearch = reaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || reaction.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handlePreview = (reaction) => {
    setPreviewReaction(reaction);
  };

  const handleDelete = (reactionId) => {
    if (deleteConfirm === reactionId) {
      onDelete(reactionId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(reactionId);
    }
  };

  const getCategoryIcon = (category) => {
    return category === 'organic' ? <Flame size={16} /> : <Atom size={16} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (reactions.length === 0) {
    return (
      <div style={styles.emptyState}>
        <Flame size={48} color="#d1d5db" />
        <h3 style={styles.emptyTitle}>No Custom Reactions</h3>
        <p style={styles.emptyText}>
          Create your first custom reaction to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="custom-reaction-list" style={styles.container}>
      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search reactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'all' ? styles.activeFilterButton : {})
            }}
            onClick={() => setFilter('all')}
          >
            All ({reactions.length})
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'organic' ? styles.activeFilterButton : {})
            }}
            onClick={() => setFilter('organic')}
          >
            <Flame size={16} /> Organic
          </button>
          <button
            style={{
              ...styles.filterButton,
              ...(filter === 'inorganic' ? styles.activeFilterButton : {})
            }}
            onClick={() => setFilter('inorganic')}
          >
            <Atom size={16} /> Inorganic
          </button>
        </div>
      </div>

      {/* Reactions Grid */}
      <div style={styles.reactionsGrid}>
        <AnimatePresence>
          {filteredReactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                ...styles.reactionCard,
                ...(selectedReaction?.id === reaction.id ? styles.selectedCard : {})
              }}
              onClick={() => setSelectedReaction(
                selectedReaction?.id === reaction.id ? null : reaction
              )}
            >
              <div style={styles.cardHeader}>
                <div style={styles.reactionTitle}>
                  {getCategoryIcon(reaction.category)}
                  <h4 style={styles.reactionName}>{reaction.name}</h4>
                </div>
                <div style={styles.reactionType}>
                  <span style={styles.typeBadge}>{reaction.type}</span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.equationPreview}>
                  <code style={styles.equationCode}>{reaction.equation}</code>
                </div>
                
                <p style={styles.reactionDescription}>
                  {reaction.description.length > 120
                    ? `${reaction.description.substring(0, 120)}...`
                    : reaction.description}
                </p>

                <div style={styles.compoundsPreview}>
                  <div style={styles.compoundsSection}>
                    <span style={styles.compoundsLabel}>Reactants:</span>
                    <div style={styles.compoundsList}>
                      {reaction.reactants?.slice(0, 3).map((compound, idx) => (
                        <span key={idx} style={styles.compoundTag}>
                          {compound.formula}
                        </span>
                      ))}
                      {reaction.reactants?.length > 3 && (
                        <span style={styles.moreTag}>+{reaction.reactants.length - 3}</span>
                      )}
                    </div>
                  </div>
                  
                  <div style={styles.reactionArrow}>→</div>
                  
                  <div style={styles.compoundsSection}>
                    <span style={styles.compoundsLabel}>Products:</span>
                    <div style={styles.compoundsList}>
                      {reaction.products?.slice(0, 3).map((compound, idx) => (
                        <span key={idx} style={styles.compoundTag}>
                          {compound.formula}
                        </span>
                      ))}
                      {reaction.products?.length > 3 && (
                        <span style={styles.moreTag}>+{reaction.products.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={styles.metadata}>
                  <div style={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{formatDate(reaction.dateCreated)}</span>
                  </div>
                  {reaction.conditions && (
                    <div style={styles.metaItem}>
                      <Zap size={14} />
                      <span>{reaction.conditions}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.actionButtons}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(reaction);
                    }}
                    style={styles.actionButton}
                    title="Preview"
                  >
                    <Eye size={18} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(reaction);
                    }}
                    style={styles.actionButton}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(reaction.id);
                    }}
                    style={{
                      ...styles.actionButton,
                      ...(deleteConfirm === reaction.id ? styles.deleteConfirmButton : {})
                    }}
                    title={deleteConfirm === reaction.id ? "Confirm Delete" : "Delete"}
                  >
                    {deleteConfirm === reaction.id ? (
                      <AlertCircle size={18} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
                
                {deleteConfirm === reaction.id && (
                  <div style={styles.confirmDelete}>
                    <span style={styles.confirmText}>Delete this reaction?</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(null);
                      }}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div style={styles.statsSection}>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{reactions.length}</span>
          <span style={styles.statLabel}>Total Reactions</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>
            {reactions.filter(r => r.category === 'organic').length}
          </span>
          <span style={styles.statLabel}>Organic</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>
            {reactions.filter(r => r.category === 'inorganic').length}
          </span>
          <span style={styles.statLabel}>Inorganic</span>
        </div>
      </div>

      {/* Preview Modal */}
      {previewReaction && (
        <Modal
          isOpen={!!previewReaction}
          onClose={() => setPreviewReaction(null)}
          title={`Preview: ${previewReaction.name}`}
          size="large"
        >
          <ReactionAnimation reaction={previewReaction} type={previewReaction.category} />
          <div style={styles.modalActions}>
            <button
              onClick={() => {
                onEdit(previewReaction);
                setPreviewReaction(null);
              }}
              style={styles.modalEditButton}
            >
              <Edit size={18} /> Edit Reaction
            </button>
            <button
              onClick={() => setPreviewReaction(null)}
              style={styles.modalCloseButton}
            >
              Close Preview
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    color: '#6b7280'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    margin: '20px 0 10px',
    color: '#4b5563'
  },
  emptyText: {
    fontSize: '1rem',
    maxWidth: '400px',
    lineHeight: '1.6'
  },
  filterSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  searchBox: {
    flex: '1',
    maxWidth: '400px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none'
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: '1px solid #d1d5db',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s'
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },
  reactionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  reactionCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },
  selectedCard: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    backgroundColor: '#eff6ff'
  },
  cardHeader: {
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  reactionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1'
  },
  reactionName: {
    fontSize: '1.2rem',
    color: '#1f2937',
    margin: '0',
    fontWeight: '600'
  },
  reactionType: {
    marginLeft: '10px'
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  cardBody: {
    padding: '20px'
  },
  equationPreview: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  },
  equationCode: {
    fontFamily: 'monospace',
    fontSize: '1.1rem',
    color: '#1e40af',
    fontWeight: 'bold'
  },
  reactionDescription: {
    color: '#6b7280',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '20px'
  },
  compoundsPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  compoundsSection: {
    flex: '1',
    minWidth: '120px'
  },
  compoundsLabel: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: '500'
  },
  compoundsList: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  compoundTag: {
    backgroundColor: 'white',
    color: '#1e40af',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    border: '1px solid #dbeafe',
    fontFamily: 'monospace'
  },
  moreTag: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontStyle: 'italic'
  },
  reactionArrow: {
    color: '#9ca3af',
    fontSize: '1.5rem',
    minWidth: '30px',
    textAlign: 'center'
  },
  metadata: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  cardFooter: {
    padding: '15px 20px',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px'
  },
  actionButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    flex: '1'
  },
  deleteConfirmButton: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    borderColor: '#fecaca'
  },
  confirmDelete: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  },
  confirmText: {
    color: '#991b1b',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    padding: '4px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  statsSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    flexWrap: 'wrap'
  },
  statItem: {
    textAlign: 'center',
    minWidth: '100px'
  },
  statValue: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  modalEditButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem'
  },
  modalCloseButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem'
  }
};

export default CustomReactionList;