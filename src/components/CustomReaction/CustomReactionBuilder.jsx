import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Save, Play, Eye, Check, X, 
  FlaskConical, Beaker, Zap, AlertCircle 
} from 'lucide-react';
import ReactionAnimation from '../ReactionVisualizer/ReactionAnimation';
import { validateReactionEquation, validateReactionData } from '../../utils/validationUtils';

function CustomReactionBuilder({ onSave, initialReaction }) {
  const [reaction, setReaction] = useState({
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

  const [newReactant, setNewReactant] = useState({ name: '', formula: '', color: '#3b82f6' });
  const [newProduct, setNewProduct] = useState({ name: '', formula: '', color: '#10b981' });
  const [validationErrors, setValidationErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [isValidEquation, setIsValidEquation] = useState(false);

  useEffect(() => {
    if (initialReaction) {
      setReaction(initialReaction);
    }
  }, [initialReaction]);

  const handleInputChange = (field, value) => {
    setReaction(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Validate equation in real-time
    if (field === 'equation') {
      const validation = validateReactionEquation(value);
      setIsValidEquation(validation.isValid);
    }
  };

  const handleAddReactant = () => {
    if (!newReactant.name || !newReactant.formula) {
      setValidationErrors(prev => ({
        ...prev,
        reactant: 'Name and formula are required'
      }));
      return;
    }

    const formulaValidation = validateReactionEquation(newReactant.formula + '→' + newReactant.formula);
    if (!formulaValidation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        reactant: `Invalid formula: ${formulaValidation.error}`
      }));
      return;
    }

    setReaction(prev => ({
      ...prev,
      reactants: [...prev.reactants, { ...newReactant, id: Date.now() }]
    }));
    
    setNewReactant({ name: '', formula: '', color: '#3b82f6' });
    setValidationErrors(prev => ({ ...prev, reactant: undefined }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.formula) {
      setValidationErrors(prev => ({
        ...prev,
        product: 'Name and formula are required'
      }));
      return;
    }

    const formulaValidation = validateReactionEquation(newProduct.formula + '→' + newProduct.formula);
    if (!formulaValidation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        product: `Invalid formula: ${formulaValidation.error}`
      }));
      return;
    }

    setReaction(prev => ({
      ...prev,
      products: [...prev.products, { ...newProduct, id: Date.now() }]
    }));
    
    setNewProduct({ name: '', formula: '', color: '#10b981' });
    setValidationErrors(prev => ({ ...prev, product: undefined }));
  };

  const handleRemoveCompound = (type, id) => {
    if (type === 'reactant') {
      setReaction(prev => ({
        ...prev,
        reactants: prev.reactants.filter(r => r.id !== id)
      }));
    } else {
      setReaction(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== id)
      }));
    }
  };

  const handleSubmit = () => {
    const validation = validateReactionData(reaction);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Create full reaction data
    const fullReaction = {
      ...reaction,
      id: initialReaction?.id || `custom-${Date.now()}`,
      compounds: {
        reactants: reaction.reactants,
        products: reaction.products
      },
      steps: generateSteps(reaction),
      dateCreated: new Date().toISOString()
    };

    onSave(fullReaction);
    
    // Reset form if not editing
    if (!initialReaction) {
      setReaction({
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
      setPreviewMode(false);
    }
  };

  const generateSteps = (reactionData) => {
    const steps = [
      'Reactants preparation',
      'Initial contact between reactants',
      'Bond breaking and electron transfer',
      'Intermediate formation',
      'Product formation',
      'Reaction completion'
    ];
    
    return steps;
  };

  const renderPreview = () => {
    const previewReaction = {
      ...reaction,
      id: 'preview',
      compounds: {
        reactants: reaction.reactants,
        products: reaction.products
      },
      steps: generateSteps(reaction)
    };

    return (
      <div style={styles.previewContainer}>
        <div style={styles.previewHeader}>
          <h3 style={styles.previewTitle}>Reaction Preview</h3>
          <button
            onClick={() => setPreviewMode(false)}
            style={styles.backButton}
          >
            <X size={20} /> Back to Edit
          </button>
        </div>
        <ReactionAnimation reaction={previewReaction} type={reaction.category} />
      </div>
    );
  };

  if (previewMode) {
    return renderPreview();
  }

  return (
    <div className="custom-reaction-builder" style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <FlaskConical size={24} />
          {initialReaction ? 'Edit Custom Reaction' : 'Build Custom Reaction'}
        </h2>
        <div style={styles.headerActions}>
          <button
            onClick={() => setPreviewMode(true)}
            style={styles.previewButton}
            disabled={!reaction.name || !reaction.equation}
          >
            <Eye size={20} /> Preview
          </button>
          <button
            onClick={handleSubmit}
            style={styles.saveButton}
          >
            <Save size={20} /> Save Reaction
          </button>
        </div>
      </div>

      <div style={styles.formGrid}>
        {/* Basic Information */}
        <div style={styles.formSection}>
          <h3 style={styles.sectionTitle}>Basic Information</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Reaction Name *</label>
            <input
              type="text"
              value={reaction.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Methane Combustion"
              style={styles.input}
            />
            {validationErrors.name && (
              <div style={styles.error}>{validationErrors.name}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Reaction Equation *</label>
            <div style={styles.equationInputContainer}>
              <input
                type="text"
                value={reaction.equation}
                onChange={(e) => handleInputChange('equation', e.target.value)}
                placeholder="e.g., CH₄ + 2O₂ → CO₂ + 2H₂O"
                style={{
                  ...styles.input,
                  ...(reaction.equation && !isValidEquation ? styles.errorInput : {}),
                  ...(reaction.equation && isValidEquation ? styles.successInput : {})
                }}
              />
              {reaction.equation && (
                <div style={styles.validationIcon}>
                  {isValidEquation ? (
                    <Check size={20} color="#10b981" />
                  ) : (
                    <AlertCircle size={20} color="#ef4444" />
                  )}
                </div>
              )}
            </div>
            {validationErrors.equation && (
              <div style={styles.error}>{validationErrors.equation}</div>
            )}
            <div style={styles.equationHint}>
              Use {'\u2192'} or {'->'} or = as arrow. Example: 2H₂ + O₂ = 2H₂O
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              value={reaction.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the reaction process..."
              rows={4}
              style={styles.textarea}
            />
            {validationErrors.description && (
              <div style={styles.error}>{validationErrors.description}</div>
            )}
          </div>
        </div>

        {/* Reaction Properties */}
        <div style={styles.formSection}>
          <h3 style={styles.sectionTitle}>Reaction Properties</h3>
          
          <div style={styles.propertiesGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type *</label>
              <select
                value={reaction.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                style={styles.select}
              >
                <option value="combination">Combination</option>
                <option value="decomposition">Decomposition</option>
                <option value="displacement">Displacement</option>
                <option value="double displacement">Double Displacement</option>
                <option value="combustion">Combustion</option>
                <option value="redox">Redox</option>
                <option value="acid-base">Acid-Base</option>
                <option value="substitution">Substitution (Organic)</option>
                <option value="addition">Addition (Organic)</option>
                <option value="elimination">Elimination (Organic)</option>
              </select>
              {validationErrors.type && (
                <div style={styles.error}>{validationErrors.type}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="organic"
                    checked={reaction.category === 'organic'}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    style={styles.radioInput}
                  />
                  <span style={styles.radioText}>Organic</span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    value="inorganic"
                    checked={reaction.category === 'inorganic'}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    style={styles.radioInput}
                  />
                  <span style={styles.radioText}>Inorganic</span>
                </label>
              </div>
              {validationErrors.category && (
                <div style={styles.error}>{validationErrors.category}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Conditions</label>
              <input
                type="text"
                value={reaction.conditions}
                onChange={(e) => handleInputChange('conditions', e.target.value)}
                placeholder="e.g., High pressure, UV light"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Catalyst</label>
              <input
                type="text"
                value={reaction.catalyst}
                onChange={(e) => handleInputChange('catalyst', e.target.value)}
                placeholder="e.g., Platinum, Nickel"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Temperature</label>
              <input
                type="text"
                value={reaction.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="e.g., 25°C, 150-200°C"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Energy Change</label>
              <input
                type="text"
                value={reaction.energy}
                onChange={(e) => handleInputChange('energy', e.target.value)}
                placeholder="e.g., Exothermic, ΔH = -890 kJ/mol"
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compounds Section */}
      <div style={styles.compoundsSection}>
        <div style={styles.compoundsColumn}>
          <h3 style={styles.sectionTitle}>
            <Beaker size={20} /> Reactants ({reaction.reactants.length})
          </h3>
          
          <div style={styles.addCompoundForm}>
            <div style={styles.compoundInputs}>
              <input
                type="text"
                value={newReactant.name}
                onChange={(e) => setNewReactant(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Compound name"
                style={styles.smallInput}
              />
              <input
                type="text"
                value={newReactant.formula}
                onChange={(e) => setNewReactant(prev => ({ ...prev, formula: e.target.value }))}
                placeholder="Formula (e.g., H₂O)"
                style={styles.smallInput}
              />
              <input
                type="color"
                value={newReactant.color}
                onChange={(e) => setNewReactant(prev => ({ ...prev, color: e.target.value }))}
                style={styles.colorInput}
                title="Choose color"
              />
            </div>
            <button
              onClick={handleAddReactant}
              style={styles.addButton}
            >
              <Plus size={20} /> Add Reactant
            </button>
            {validationErrors.reactant && (
              <div style={styles.error}>{validationErrors.reactant}</div>
            )}
          </div>

          <div style={styles.compoundsList}>
            {reaction.reactants.map((compound) => (
              <motion.div
                key={compound.id}
                style={styles.compoundItem}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div style={styles.compoundInfo}>
                  <div style={styles.compoundHeader}>
                    <div 
                      style={{ 
                        ...styles.colorIndicator,
                        backgroundColor: compound.color 
                      }} 
                    />
                    <span style={styles.compoundName}>{compound.name}</span>
                  </div>
                  <code style={styles.compoundFormula}>{compound.formula}</code>
                </div>
                <button
                  onClick={() => handleRemoveCompound('reactant', compound.id)}
                  style={styles.removeButton}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={styles.reactionArrow}>
          <Zap size={24} />
          <div style={styles.arrowText}>→</div>
        </div>

        <div style={styles.compoundsColumn}>
          <h3 style={styles.sectionTitle}>
            <Beaker size={20} /> Products ({reaction.products.length})
          </h3>
          
          <div style={styles.addCompoundForm}>
            <div style={styles.compoundInputs}>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Compound name"
                style={styles.smallInput}
              />
              <input
                type="text"
                value={newProduct.formula}
                onChange={(e) => setNewProduct(prev => ({ ...prev, formula: e.target.value }))}
                placeholder="Formula (e.g., CO₂)"
                style={styles.smallInput}
              />
              <input
                type="color"
                value={newProduct.color}
                onChange={(e) => setNewProduct(prev => ({ ...prev, color: e.target.value }))}
                style={styles.colorInput}
                title="Choose color"
              />
            </div>
            <button
              onClick={handleAddProduct}
              style={styles.addButton}
            >
              <Plus size={20} /> Add Product
            </button>
            {validationErrors.product && (
              <div style={styles.error}>{validationErrors.product}</div>
            )}
          </div>

          <div style={styles.compoundsList}>
            {reaction.products.map((compound) => (
              <motion.div
                key={compound.id}
                style={styles.compoundItem}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div style={styles.compoundInfo}>
                  <div style={styles.compoundHeader}>
                    <div 
                      style={{ 
                        ...styles.colorIndicator,
                        backgroundColor: compound.color 
                      }} 
                    />
                    <span style={styles.compoundName}>{compound.name}</span>
                  </div>
                  <code style={styles.compoundFormula}>{compound.formula}</code>
                </div>
                <button
                  onClick={() => handleRemoveCompound('product', compound.id)}
                  style={styles.removeButton}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Notes */}
      <div style={styles.safetySection}>
        <h3 style={styles.sectionTitle}>Safety Notes</h3>
        <textarea
          value={reaction.safety}
          onChange={(e) => handleInputChange('safety', e.target.value)}
          placeholder="Important safety precautions and handling instructions..."
          rows={3}
          style={styles.textarea}
        />
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          onClick={() => setPreviewMode(true)}
          style={styles.secondaryButton}
          disabled={!reaction.name || !reaction.equation}
        >
          <Play size={20} /> Preview Reaction
        </button>
        <button
          onClick={handleSubmit}
          style={styles.primaryButton}
        >
          <Save size={20} /> {initialReaction ? 'Update Reaction' : 'Save Reaction'}
        </button>
      </div>
    </div>
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
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    fontSize: '1.8rem',
    color: '#1f2937',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  previewButton: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: '1px solid #d1d5db',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
    fontSize: '0.95rem'
  },
  saveButton: {
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
    transition: 'all 0.3s',
    fontSize: '0.95rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  },
  formSection: {
    backgroundColor: '#f9fafb',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#1f2937',
    marginBottom: '20px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#4b5563',
    fontWeight: '500',
    fontSize: '0.95rem'
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
  errorInput: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2'
  },
  successInput: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4'
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
  equationInputContainer: {
    position: 'relative'
  },
  validationIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  equationHint: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '8px',
    fontStyle: 'italic'
  },
  error: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '5px'
  },
  propertiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px'
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '8px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#4b5563'
  },
  radioInput: {
    margin: '0'
  },
  radioText: {
    fontSize: '0.95rem'
  },
  compoundsSection: {
    display: 'flex',
    gap: '30px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  compoundsColumn: {
    flex: '1',
    minWidth: '300px',
    backgroundColor: '#f9fafb',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb'
  },
  addCompoundForm: {
    marginBottom: '20px'
  },
  compoundInputs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    flexWrap: 'wrap'
  },
  smallInput: {
    flex: '1',
    minWidth: '120px',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    outline: 'none'
  },
  colorInput: {
    width: '50px',
    height: '40px',
    padding: '2px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    backgroundColor: 'white'
  },
  addButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    transition: 'all 0.3s'
  },
  compoundsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  compoundItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s'
  },
  compoundInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  compoundHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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
  removeButton: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: 'none',
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reactionArrow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '60px',
    color: '#6b7280'
  },
  arrowText: {
    fontSize: '2rem',
    marginTop: '5px'
  },
  safetySection: {
    backgroundColor: '#fef2f2',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #fecaca',
    marginBottom: '30px'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s'
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: '1px solid #d1d5db',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s'
  },
  previewContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px'
  },
  previewTitle: {
    fontSize: '1.5rem',
    color: '#1f2937',
    fontWeight: 'bold'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
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
  }
};

export default CustomReactionBuilder;