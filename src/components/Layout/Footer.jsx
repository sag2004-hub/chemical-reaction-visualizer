import React, { useEffect, useRef, useCallback } from 'react';

function Footer() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const initCanvas = useCallback((canvas) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    return { ctx, width: rect.width, height: rect.height, dpr };
  }, []);

  const createNucleus = useCallback((centerX, centerY) => ({
    x: centerX,
    y: centerY,
    radius: 18,
    charge: 79,
    mass: 197
  }), []);

  const createParticle = useCallback((canvasWidth, canvasHeight, index) => {
    const impactParameter = Math.abs((Math.random() * canvasHeight) - canvasHeight / 2);
    const deflectionProbability = Math.max(0, 1 - (impactParameter / 80));
    const willDeflect = Math.random() < deflectionProbability * 0.15;
    
    return {
      id: Date.now() + index,
      x: -15 - (index * 30),
      y: Math.random() * canvasHeight,
      velocity: 2 + Math.random() * 1.5,
      radius: 2.5,
      charge: 2,
      mass: 4,
      trail: [],
      maxTrailLength: 8,
      opacity: 0.8 + Math.random() * 0.2,
      deflected: false,
      deflectionAngle: 0,
      willDeflect: willDeflect,
      impactParameter: impactParameter
    };
  }, []);

  const updateParticle = useCallback((particle, nucleus, canvasWidth, canvasHeight) => {
    // Add current position to trail
    particle.trail.push({ x: particle.x, y: particle.y });
    if (particle.trail.length > particle.maxTrailLength) {
      particle.trail.shift();
    }

    if (!particle.deflected && particle.willDeflect) {
      const dx = nucleus.x - particle.x;
      const dy = nucleus.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < nucleus.radius * 3) {
        particle.deflected = true;
        const baseAngle = Math.atan2(dy, dx);
        const scatteringAngle = (Math.PI / 2) * (1 / (distance / nucleus.radius));
        particle.deflectionAngle = baseAngle + (dy > 0 ? -scatteringAngle : scatteringAngle);
      }
    }

    if (particle.deflected) {
      particle.x += Math.cos(particle.deflectionAngle) * particle.velocity;
      particle.y += Math.sin(particle.deflectionAngle) * particle.velocity;
    } else {
      particle.x += particle.velocity;
    }

    // Reset particle if out of bounds
    if (particle.x > canvasWidth + 20 || particle.x < -20 || 
        particle.y > canvasHeight + 20 || particle.y < -20) {
      const newParticle = createParticle(canvasWidth, canvasHeight, Math.random() * 10);
      Object.keys(newParticle).forEach(key => {
        particle[key] = newParticle[key];
      });
      particle.x = -15;
    }
  }, [createParticle]);

  const drawNucleus = useCallback((ctx, nucleus) => {
    // Nucleus glow
    const gradient = ctx.createRadialGradient(
      nucleus.x, nucleus.y, 0,
      nucleus.x, nucleus.y, nucleus.radius * 2
    );
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
    gradient.addColorStop(0.3, 'rgba(245, 158, 11, 0.4)');
    gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
    
    ctx.beginPath();
    ctx.arc(nucleus.x, nucleus.y, nucleus.radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Nucleus core
    const coreGradient = ctx.createRadialGradient(
      nucleus.x, nucleus.y, 0,
      nucleus.x, nucleus.y, nucleus.radius
    );
    coreGradient.addColorStop(0, '#f59e0b');
    coreGradient.addColorStop(1, '#d97706');
    
    ctx.beginPath();
    ctx.arc(nucleus.x, nucleus.y, nucleus.radius, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();
    
    // Nucleus border
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, []);

  const drawParticle = useCallback((ctx, particle) => {
    // Draw trail
    particle.trail.forEach((point, i) => {
      const alpha = (i / particle.trail.length) * particle.opacity * 0.3;
      ctx.beginPath();
      ctx.arc(point.x, point.y, particle.radius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.fill();
    });

    // Draw particle
    const particleGradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius
    );
    particleGradient.addColorStop(0, particle.deflected ? '#10b981' : '#3b82f6');
    particleGradient.addColorStop(1, particle.deflected ? '#047857' : '#1d4ed8');
    
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = particleGradient;
    ctx.fill();

    // Particle glow
    if (particle.deflected) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity * 0.3})`;
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = initCanvas(canvas);
    if (!setup) return;
    
    const { ctx, width, height, dpr } = setup;
    const nucleus = createNucleus(width / 2, height / 2);
    
    // Initialize particles
    const particleCount = 20;
    particlesRef.current = Array.from({ length: particleCount }, (_, i) =>
      createParticle(width, height, i)
    );

    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, width * dpr, height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw gold foil representation
      ctx.fillStyle = 'rgba(250, 204, 21, 0.05)';
      ctx.fillRect(width * 0.4, 0, width * 0.2, height);

      drawNucleus(ctx, nucleus);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        updateParticle(particle, nucleus, width, height);
        drawParticle(ctx, particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      const newSetup = initCanvas(canvas);
      if (newSetup) {
        const { width: newWidth, height: newHeight } = newSetup;
        nucleus.x = newWidth / 2;
        nucleus.y = newHeight / 2;
        
        // Reposition particles
        particlesRef.current = particlesRef.current.map((particle, i) => ({
          ...particle,
          y: Math.random() * newHeight,
          x: -15 - (i * 30),
          deflected: false,
          deflectionAngle: 0,
          trail: []
        }));
      }
      
      animate();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initCanvas, createNucleus, createParticle, updateParticle, drawNucleus, drawParticle]);

  return (
    <footer className="footer" style={styles.footer}>
      <canvas 
        ref={canvasRef} 
        style={styles.canvas}
        aria-label="Rutherford gold foil experiment animation showing alpha particles scattering from a nucleus"
      />
      <div className="container" style={styles.container}>
        
        <p style={styles.text}>
          Chemical Reaction Visualizer &copy; {new Date().getFullYear()}
        </p>
        <p style={styles.subtext}>
          Simulating nuclear scattering and chemical bonding principles through interactive visualization
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    position: 'relative',
    backgroundColor: '#0f172a',
    color: 'white',
    padding: '50px 0 30px',
    marginTop: 'auto',
    overflow: 'hidden',
    borderTop: '1px solid rgba(59, 130, 246, 0.15)'
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.7,
    pointerEvents: 'none'
  },
  container: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '16px',
    background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  highlight: {
    display: 'inline-block',
    position: 'relative'
  },
  text: {
    fontSize: '1rem',
    marginBottom: '12px',
    color: '#e2e8f0',
    fontWeight: '500',
    letterSpacing: '0.3px'
  },
  subtext: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    maxWidth: '700px',
    margin: '0 auto 28px',
    lineHeight: '1.6'
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.85rem',
    color: '#cbd5e1',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    padding: '8px 16px',
    borderRadius: '20px',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(59, 130, 246, 0.1)'
  },
  legendDotPrimary: {
    width: '10px',
    height: '10px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 0 8px #3b82f6'
  },
  legendDotDeflected: {
    width: '10px',
    height: '10px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 0 8px #10b981'
  },
  legendDotNucleus: {
    width: '10px',
    height: '10px',
    backgroundColor: '#f59e0b',
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 0 8px #f59e0b'
  }
};

export default Footer;