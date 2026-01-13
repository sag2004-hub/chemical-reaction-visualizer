// Animation utility functions

export const createAtomAnimation = (element, x, y) => {
  return {
    element,
    position: { x, y },
    electrons: Array(element.electrons || 2).fill(0).map((_, i) => ({
      angle: (i / (element.electrons || 2)) * 2 * Math.PI,
      radius: 30
    }))
  }
}

export const animateBondFormation = (atom1, atom2, duration = 1000) => {
  const distance = Math.sqrt(
    Math.pow(atom2.position.x - atom1.position.x, 2) +
    Math.pow(atom2.position.y - atom1.position.y, 2)
  )
  
  return {
    type: 'bond',
    atoms: [atom1, atom2],
    distance,
    duration,
    progress: 0
  }
}

export const animateReactionStep = (stepIndex, totalSteps) => {
  const progress = stepIndex / totalSteps
  const animations = []
  
  // Create animations based on step
  if (progress < 0.3) {
    // Reactants moving together
    animations.push({
      type: 'approach',
      speed: 1 - progress
    })
  } else if (progress < 0.7) {
    // Bond breaking/forming
    animations.push({
      type: 'bond_change',
      intensity: Math.sin(progress * Math.PI)
    })
  } else {
    // Products forming
    animations.push({
      type: 'separation',
      speed: progress
    })
  }
  
  return animations
}