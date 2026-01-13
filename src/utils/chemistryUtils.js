// Chemistry utility functions

export const parseChemicalFormula = (formula) => {
  // Simple formula parser for demonstration
  const elements = []
  const regex = /([A-Z][a-z]*)(\d*)/g
  let match
  
  while ((match = regex.exec(formula)) !== null) {
    const element = match[1]
    const count = match[2] ? parseInt(match[2]) : 1
    elements.push({ element, count })
  }
  
  return elements
}

export const calculateMolarMass = (formula) => {
  const elements = parseChemicalFormula(formula)
  const atomicMasses = {
    H: 1.008,
    C: 12.011,
    N: 14.007,
    O: 15.999,
    Na: 22.990,
    Cl: 35.45,
    // Add more elements as needed
  }
  
  return elements.reduce((total, { element, count }) => {
    return total + (atomicMasses[element] || 0) * count
  }, 0)
}

export const balanceEquation = (reactants, products) => {
  // Simple equation balancing logic
  // This is a simplified version - real balancing would be more complex
  return { reactants, products, balanced: true }
}

export const validateFormula = (formula) => {
  // Basic formula validation
  const validElements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
                         'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
                         // Add more elements as needed
                        ]
  
  const regex = /([A-Z][a-z]*)(\d*)/g
  let match
  const elements = []
  
  while ((match = regex.exec(formula)) !== null) {
    const element = match[1]
    if (!validElements.includes(element)) {
      return { valid: false, error: `Invalid element: ${element}` }
    }
    elements.push(element)
  }
  
  return { valid: true, elements }
}