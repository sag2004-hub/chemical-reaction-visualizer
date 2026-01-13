import { useState, useEffect, useRef, useCallback } from 'react';

export const useAnimation = (initialProgress = 0) => {
  const [progress, setProgress] = useState(initialProgress);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);

  const play = useCallback(() => {
    setIsPlaying(true);
    lastTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const setTo = useCallback((value) => {
    setProgress(Math.max(0, Math.min(100, value)));
  }, []);

  const stepForward = useCallback((amount = 10) => {
    setProgress(prev => Math.min(100, prev + amount));
  }, []);

  const stepBackward = useCallback((amount = 10) => {
    setProgress(prev => Math.max(0, prev - amount));
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Calculate progress increment based on speed and time
      const increment = (deltaTime / 1000) * speed * 10; // 10% per second at speed 1
      
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return newProgress;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  return {
    progress,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    reset,
    setTo,
    stepForward,
    stepBackward,
    togglePlay,
    setIsPlaying
  };
};

export const useStepAnimation = (steps, initialStep = 0) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepProgress, setStepProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  const totalSteps = steps.length;

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setStepProgress(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setStepProgress(0);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setStepProgress(0);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
      setStepProgress(0);
    }
  }, [totalSteps]);

  useEffect(() => {
    if (!isPlaying || stepProgress >= 100) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = () => {
      setStepProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          if (currentStep < totalSteps - 1) {
            setCurrentStep(prevStep => prevStep + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return newProgress;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, stepProgress, currentStep, totalSteps]);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    currentStepData,
    stepProgress,
    isPlaying,
    totalSteps,
    isFirstStep,
    isLastStep,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    goToStep,
    setIsPlaying
  };
};

export const useBondAnimation = () => {
  const [bondStates, setBondStates] = useState({});
  const [activeBonds, setActiveBonds] = useState([]);

  const createBond = useCallback((id, from, to, type = 'single') => {
    setBondStates(prev => ({
      ...prev,
      [id]: {
        id,
        from,
        to,
        type,
        state: 'forming',
        progress: 0
      }
    }));
  }, []);

  const breakBond = useCallback((id) => {
    setBondStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        state: 'breaking',
        progress: 0
      }
    }));
  }, []);

  const updateBondProgress = useCallback((id, progress) => {
    setBondStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        progress: Math.max(0, Math.min(100, progress))
      }
    }));
  }, []);

  const animateBond = useCallback((id, action) => {
    if (action === 'form') {
      createBond(id, { x: 0, y: 0 }, { x: 100, y: 0 });
      setActiveBonds(prev => [...prev, id]);
    } else if (action === 'break') {
      breakBond(id);
    }
  }, [createBond, breakBond]);

  return {
    bondStates,
    activeBonds,
    createBond,
    breakBond,
    updateBondProgress,
    animateBond
  };
};

export const useElementAnimation = (elementSymbol) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const moveTo = useCallback((x, y, duration = 500) => {
    setIsAnimating(true);
    const startX = position.x;
    const startY = position.y;
    const startTime = Date.now();

    const animateMove = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setPosition({
        x: startX + (x - startX) * ease,
        y: startY + (y - startY) * ease
      });

      if (progress < 1) {
        requestAnimationFrame(animateMove);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animateMove);
  }, [position]);

  const rotate = useCallback((degrees, duration = 1000) => {
    setIsAnimating(true);
    const startRotation = rotation;
    const startTime = Date.now();

    const animateRotation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setRotation(startRotation + degrees * ease);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animateRotation);
  }, [rotation]);

  const pulse = useCallback((times = 1) => {
    setIsAnimating(true);
    let pulseCount = 0;
    const maxPulses = times * 2; // Each pulse has scale up and down

    const animatePulse = () => {
      setScale(prev => {
        const progress = pulseCount / maxPulses;
        const angle = progress * Math.PI;
        const scaleValue = 1 + 0.2 * Math.sin(angle);
        
        pulseCount++;
        
        if (pulseCount <= maxPulses) {
          requestAnimationFrame(animatePulse);
        } else {
          setIsAnimating(false);
          return 1;
        }
        
        return scaleValue;
      });
    };

    requestAnimationFrame(animatePulse);
  }, []);

  return {
    position,
    rotation,
    scale,
    isAnimating,
    moveTo,
    rotate,
    pulse,
    setPosition,
    setRotation,
    setScale
  };
};