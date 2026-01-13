import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, X, AlertCircle, CheckCircle, 
  FlaskConical, Beaker, Zap 
} from 'lucide-react';
import { validateReactionData } from '../../utils/validationUtils';

function ReactionEditor({ reaction, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    equation: '',
    description: '',
    type: 'combination',
    category: 'organic',
    conditions: '',
    catalyst: '',
    temperature: '',
    energy: '',
    safety: '',
    reactants: [],
    products: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (reaction) {
      setFormData({
        name: reaction.name || '',
        equation: reaction.equation || '',
        description: reaction.description || '',
        type: reaction.type || 'combination',
        category: reaction.category || 'organic',
        conditions: reaction.conditions || '',
        catalyst: reaction.catalyst || '',
        temperature: reaction.temperature || '',
        energy: reaction.energy || '',
        safety: reaction.safety || '',
        reactants: reaction.reactants || [],
        products: reaction.products || []
      });
    }
  }, [reaction]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    // Validate form data
    const validation = validateReactionData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Add reactants and products from equation if not manually specified
    const fullReaction = {
      ...formData,
      id: reaction?.id || `custom-${Date.now()}`,
      dateCreated: reaction?.dateCreated || new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    try {
      await onSave(fullReaction);
      setShowSuccess(true);
      
      // Reset form if not editing existing reaction
      if (!reaction) {
        setTimeout(() => {
          setFormData({
            name: '',
            equation: '',
            description: '',
            type: 'combination',
            category: 'organic',
            conditions: '',
            catalyst: '',
            temperature: '',
            energy: '',
            safety: '',
            reactants: [],
            products: []
          });
          setShowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReactant = () => {
    // In a real implementation, this would open a compound editor
    const newReactant = {
      id: Date.now(),
      name: 'New Reactant',
      formula: 'R',
      color: '#3b82f6'
    };
    
    setFormData(prev => ({
      ...prev,
      reactants: [...prev.reactants, newReactant]
    }));
  };

  const handleAddProduct = () => {
    // In a real implementation, this would open a compound editor
    const newProduct = {
      id: Date.now(),
      name: 'New Product',
      formula: 'P',
      color: '#10b981'
    };
    
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const renderFormField = (field, label, type = 'text', options = []) => {
    const isError = !!errors[field];
    
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>
          {label}
          {['name', 'equation', 'description', 'type', 'category'].includes(field) && (
            <span style={styles.required}> *</span>
          )}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            style={{
              ...styles.textarea,
              ...(isError ? styles.errorField : {})
            }}
            rows={4}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : type === 'select' ? (
          <select
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            style={{
              ...styles.select,
              ...(isError ? styles.errorField : {})
            }}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            style={{
              ...styles.input,
              ...(isError ? styles.errorField : {})
            }}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
        
        {isError && (
          <div style={styles.errorMessage}>
            <AlertCircle size={14} />
            {errors[field]}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <FlaskConical size={24} />
          {reaction ? 'Edit Reaction' : 'Create New Reaction'}
        </h2>
        
        <div style={styles.headerActions}>
          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelButton}
            disabled={isSubmitting}
          >
            <X size={20} /> Cancel
          </button>
          <button
            type="submit"
            style={styles.submitButton}
            disabled={isSubmitting}
          >
            <Save size={20} />
            {isSubmitting ? 'Saving...' : reaction ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {showSuccess && (
        <motion.div
          style={styles.successMessage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle size={20} />
          <span>Reaction {reaction ? 'updated' : 'saved'} successfully!</span>
        </motion.div>
      )}

      {errors.submit && (
        <div style={styles.submitError}>
          <AlertCircle size={20} />
          <span>{errors.submit}</span>
        </div>
      )}

      <div style={styles.formGrid}>
        {/* Basic Information Column */}
        <div style={styles.formColumn}>
          <h3 style={styles.sectionTitle}>Basic Information</h3>
          
          {renderFormField('name', 'Reaction Name')}
          {renderFormField('equation', 'Reaction Equation')}
          {renderFormField('description', 'Description', 'textarea')}
          
          <div style={styles.inlineFields}>
            {renderFormField('type', 'Type', 'select', [
              { value: 'combination', label: 'Combination' },
              { value: 'decomposition', label: 'Decomposition' },
              { value: 'displacement', label: 'Displacement' },
              { value: 'double displacement', label: 'Double Displacement' },
              { value: 'combustion', label: 'Combustion' },
              { value: 'redox', label: 'Redox' },
              { value: 'acid-base', label: 'Acid-Base' },
              { value: 'substitution', label: 'Substitution (Organic)' },
              { value: 'addition', label: 'Addition (Organic)' },
              { value: 'elimination', label: 'Elimination (Organic)' }
            ])}
            
            {renderFormField('category', 'Category', 'select', [
              { value: 'organic', label: 'Organic' },
              { value: 'inorganic', label: 'Inorganic' }
            ])}
          </div>
        </div>

        {/* Reaction Conditions Column */}
        <div style={styles.formColumn}>
          <h3 style={styles.sectionTitle}>Reaction Conditions</h3>
          
          {renderFormField('conditions', 'Conditions')}
          {renderFormField('catalyst', 'Catalyst')}
          {renderFormField('temperature', 'Temperature')}
          {renderFormField('energy', 'Energy Change')}
          
          <div style={styles.safetySection}>
            <h4 style={styles.safetyTitle}>
              <AlertCircle size={18} /> Safety Notes
            </h4>
            <textarea
              value={formData.safety}
              onChange={(e) => handleInputChange('safety', e.target.value)}
              style={styles.safetyTextarea}
              placeholder="Important safety precautions..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Compounds Section */}
      <div style={styles.compoundsSection}>
        <h3 style={styles.sectionTitle}>
          <Beaker size={20} /> Compounds
        </h3>
        
        <div style={styles.compoundsGrid}>
          {/* Reactants */}
          <div style={styles.compoundsColumn}>
            <div style={styles.compoundsHeader}>
              <h4 style={styles.compoundsTitle}>Reactants</h4>
              <button
                type="button"
                onClick={handleAddReactant}
                style={styles.addCompoundButton}
              >
                + Add Reactant
              </button>
            </div>
            
            <div style={styles.compoundsList}>
              {formData.reactants.map((compound, index) => (
                <div key={compound.id || index} style={styles.compoundItem}>
                  <div style={styles.compoundInfo}>
                    <div style={styles.compoundHeader}>
                      <div 
                        style={{ 
                          ...styles.colorIndicator,
                          backgroundColor: compound.color || '#3b82f6'
                        }} 
                      />
                      <span style={styles.compoundName}>{compound.name}</span>
                    </div>
                    <code style={styles.compoundFormula}>{compound.formula}</code>
                  </div>
                  <div style={styles.compoundActions}>
                    <button
                      type="button"
                      style={styles.editCompoundButton}
                      onClick={() => {
                        // In real app, this would open compound editor
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={styles.removeCompoundButton}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          reactants: prev.reactants.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              {formData.reactants.length === 0 && (
                <div style={styles.emptyCompounds}>
                  No reactants added. Click "Add Reactant" to add compounds.
                </div>
              )}
            </div>
          </div>

          {/* Reaction Arrow */}
          <div style={styles.reactionArrow}>
            <Zap size={24} />
            <div style={styles.arrowText}>→</div>
            <div style={styles.arrowHint}>Reaction</div>
          </div>

          {/* Products */}
          <div style={styles.compoundsColumn}>
            <div style={styles.compoundsHeader}>
              <h4 style={styles.compoundsTitle}>Products</h4>
              <button
                type="button"
                onClick={handleAddProduct}
                style={styles.addCompoundButton}
              >
                + Add Product
              </button>
            </div>
            
            <div style={styles.compoundsList}>
              {formData.products.map((compound, index) => (
                <div key={compound.id || index} style={styles.compoundItem}>
                  <div style={styles.compoundInfo}>
                    <div style={styles.compoundHeader}>
                      <div 
                        style={{ 
                          ...styles.colorIndicator,
                          backgroundColor: compound.color || '#10b981'
                        }} 
                      />
                      <span style={styles.compoundName}>{compound.name}</span>
                    </div>
                    <code style={styles.compoundFormula}>{compound.formula}</code>
                  </div>
                  <div style={styles.compoundActions}>
                    <button
                      type="button"
                      style={styles.editCompoundButton}
                      onClick={() => {
                        // In real app, this would open compound editor
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={styles.removeCompoundButton}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          products: prev.products.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              {formData.products.length === 0 && (
                <div style={styles.emptyCompounds}>
                  No products added. Click "Add Product" to add compounds.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Equation Preview */}
      <div style={styles.previewSection}>
        <h3 style={styles.sectionTitle}>Equation Preview</h3>
        <div style={styles.equationPreview}>
          {formData.equation ? (
            <code style={styles.equationCode}>{formData.equation}</code>
          ) : (
            <div style={styles.noEquation}>
              Enter an equation above to see preview
            </div>
          )}
        </div>
        
        <div style={styles.previewHint}>
          <Zap size={16} />
          <span>
            Use {'\u2192'} or -{'>'} or = as arrow. Example: 2H₂ + O₂ = 2H₂O
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.secondaryButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={styles.primaryButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div style={styles.spinner} />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              {reaction ? 'Update Reaction' : 'Save Reaction'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '1.8rem',
    color: '#1f2937',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '0'
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s'
  },
  submitButton: {
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
    fontSize: '0.95rem',
    transition: 'all 0.3s',
    minWidth: '120px'
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '500'
  },
  submitError: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '500'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#4b5563',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  required: {
    color: '#ef4444'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none'
  },
  errorField: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2'
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  inlineFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  safetySection: {
    backgroundColor: '#fef2f2',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    marginTop: '10px'
  },
  safetyTitle: {
    fontSize: '1.1rem',
    color: '#991b1b',
    marginBottom: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  safetyTextarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #fca5a5',
    fontSize: '0.95rem',
    backgroundColor: 'white',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  compoundsSection: {
    marginBottom: '30px'
  },
  compoundsGrid: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap'
  },
  compoundsColumn: {
    flex: '1',
    minWidth: '300px',
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb'
  },
  compoundsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  compoundsTitle: {
    fontSize: '1.1rem',
    color: '#1f2937',
    margin: '0',
    fontWeight: '600'
  },
  addCompoundButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.875rem'
  },
  compoundsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '250px',
    overflowY: 'auto'
  },
  compoundItem: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px'
  },
  compoundInfo: {
    flex: '1'
  },
  compoundHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '5px'
  },
  colorIndicator: {
    width: '15px',
    height: '15px',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
  },
  compoundName: {
    fontWeight: '500',
    color: '#1f2937',
    fontSize: '0.95rem'
  },
  compoundFormula: {
    fontFamily: 'monospace',
    color: '#1e40af',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  compoundActions: {
    display: 'flex',
    gap: '8px'
  },
  editCompoundButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  removeCompoundButton: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #fecaca',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  emptyCompounds: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '30px 20px',
    fontStyle: 'italic',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    border: '1px dashed #d1d5db'
  },
  reactionArrow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '80px',
    color: '#6b7280'
  },
  arrowText: {
    fontSize: '2.5rem',
    margin: '10px 0'
  },
  arrowHint: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  previewSection: {
    backgroundColor: '#f0f9ff',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #dbeafe',
    marginBottom: '30px'
  },
  equationPreview: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'center',
    border: '1px solid #d1d5db',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  equationCode: {
    fontFamily: 'monospace',
    fontSize: '1.3rem',
    color: '#1e40af',
    fontWeight: 'bold'
  },
  noEquation: {
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  previewHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '180px',
    justifyContent: 'center'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    padding: '12px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1rem'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'rotate 1s linear infinite'
  }
};

export default ReactionEditor;