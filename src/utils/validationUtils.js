// Validation utilities for chemical reactions and formulas

export const validateChemicalFormula = (formula) => {
  if (!formula || formula.trim() === '') {
    return { isValid: false, error: 'Formula cannot be empty' };
  }

  // Basic pattern validation
  const formulaPattern = /^[A-Z][a-z]?\d*([A-Z][a-z]?\d*)*$/;
  if (!formulaPattern.test(formula)) {
    return { 
      isValid: false, 
      error: 'Invalid formula format. Use element symbols followed by numbers (e.g., H2O, CH4)' 
    };
  }

  // Parse formula to check individual elements
  const elements = parseFormulaElements(formula);
  
  // Check for valid element symbols (basic set)
  const validElements = [
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
    'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
    'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
    'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
    'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds',
    'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
  ];

  for (const element of elements) {
    if (!validElements.includes(element.symbol)) {
      return { 
        isValid: false, 
        error: `Invalid element symbol: ${element.symbol}` 
      };
    }
    
    if (element.count <= 0 || element.count > 100) {
      return { 
        isValid: false, 
        error: `Invalid count for ${element.symbol}: ${element.count}` 
      };
    }
  }

  return { isValid: true, elements };
};

export const parseFormulaElements = (formula) => {
  const elements = [];
  let currentElement = '';
  let currentCount = '';
  
  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];
    
    // Check if character is uppercase (new element)
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      // Save previous element if exists
      if (currentElement) {
        elements.push({
          symbol: currentElement,
          count: currentCount ? parseInt(currentCount) : 1
        });
      }
      
      // Start new element
      currentElement = char;
      currentCount = '';
    } 
    // Check if character is lowercase (continuation of element symbol)
    else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
      currentElement += char;
    }
    // Check if character is digit
    else if (!isNaN(parseInt(char))) {
      currentCount += char;
    }
  }
  
  // Add the last element
  if (currentElement) {
    elements.push({
      symbol: currentElement,
      count: currentCount ? parseInt(currentCount) : 1
    });
  }
  
  return elements;
};

export const validateReactionEquation = (equation) => {
  if (!equation || equation.trim() === '') {
    return { isValid: false, error: 'Equation cannot be empty' };
  }

  // Basic equation format validation
  const hasArrow = equation.includes('→') || equation.includes('->') || equation.includes('=');
  if (!hasArrow) {
    return { isValid: false, error: 'Equation must contain an arrow (→, ->, or =)' };
  }

  // Split into reactants and products
  const arrowPattern = /(→|->|=)/;
  const parts = equation.split(arrowPattern);
  
  if (parts.length < 3) {
    return { isValid: false, error: 'Invalid equation format' };
  }

  const reactants = parts[0].trim();
  const products = parts[2].trim();

  if (!reactants || !products) {
    return { isValid: false, error: 'Both reactants and products are required' };
  }

  // Validate individual formulas
  const reactantFormulas = reactants.split('+').map(f => f.trim());
  const productFormulas = products.split('+').map(f => f.trim());

  for (const formula of [...reactantFormulas, ...productFormulas]) {
    const validation = validateChemicalFormula(formula);
    if (!validation.isValid) {
      return validation;
    }
  }

  // Check for mass conservation (simplified)
  const reactantAtoms = countAtoms(reactantFormulas);
  const productAtoms = countAtoms(productFormulas);
  
  const imbalances = [];
  const allElements = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);
  
  for (const element of allElements) {
    const reactantCount = reactantAtoms[element] || 0;
    const productCount = productAtoms[element] || 0;
    
    if (reactantCount !== productCount) {
      imbalances.push(`${element}: ${reactantCount} → ${productCount}`);
    }
  }

  if (imbalances.length > 0) {
    return { 
      isValid: false, 
      error: `Equation is unbalanced: ${imbalances.join(', ')}` 
    };
  }

  return { 
    isValid: true, 
    reactants: reactantFormulas,
    products: productFormulas,
    arrow: parts[1]
  };
};

export const countAtoms = (formulas) => {
  const atomCount = {};
  
  for (const formula of formulas) {
    const elements = parseFormulaElements(formula);
    
    for (const element of elements) {
      if (!atomCount[element.symbol]) {
        atomCount[element.symbol] = 0;
      }
      atomCount[element.symbol] += element.count;
    }
  }
  
  return atomCount;
};

export const validateReactionData = (reactionData) => {
  const errors = {};
  
  // Validate name
  if (!reactionData.name || reactionData.name.trim() === '') {
    errors.name = 'Reaction name is required';
  } else if (reactionData.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }
  
  // Validate equation
  const equationValidation = validateReactionEquation(reactionData.equation);
  if (!equationValidation.isValid) {
    errors.equation = equationValidation.error;
  }
  
  // Validate description
  if (!reactionData.description || reactionData.description.trim() === '') {
    errors.description = 'Description is required';
  } else if (reactionData.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }
  
  // Validate type
  if (!reactionData.type || reactionData.type.trim() === '') {
    errors.type = 'Reaction type is required';
  }
  
  // Validate category
  if (!reactionData.category || !['organic', 'inorganic'].includes(reactionData.category)) {
    errors.category = 'Category must be either organic or inorganic';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const calculateMolarMass = (formula) => {
  const elements = parseFormulaElements(formula);
  const atomicMasses = {
    H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81,
    C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
    Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974,
    S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078,
    // Add more elements as needed
  };
  
  let totalMass = 0;
  for (const element of elements) {
    const mass = atomicMasses[element.symbol] || 0;
    if (mass === 0) {
      console.warn(`Unknown atomic mass for element: ${element.symbol}`);
    }
    totalMass += mass * element.count;
  }
  
  return totalMass;
};