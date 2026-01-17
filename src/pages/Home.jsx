import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Beaker, Flame, Atom, PlusCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const benzeneRings = [];
    const numRings = 28;

    class BenzeneRing {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 65 + 40;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.012;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.28 + 0.15;
        this.life = 1;
        this.fadePhase = false;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -this.size * 1.5 || this.x > canvas.width + this.size * 1.5 ||
            this.y < -this.size * 1.5 || this.y > canvas.height + this.size * 1.5) {
          this.fadePhase = true;
        }

        if (this.fadePhase) {
          this.life -= 0.008;
          this.opacity = Math.max(0, this.opacity * 0.98);
          if (this.life <= 0) this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Outer hexagon
        ctx.strokeStyle = `rgba(100, 180, 255, ${this.opacity * 1.2})`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + Math.PI / 6;
          const x = Math.cos(angle) * this.size;
          const y = Math.sin(angle) * this.size;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner circle
        ctx.strokeStyle = `rgba(180, 140, 255, ${this.opacity * 0.9})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.68, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }
    }

    for (let i = 0; i < numRings; i++) {
      benzeneRings.push(new BenzeneRing());
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 15, 35, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      benzeneRings.forEach(ring => {
        ring.update();
        ring.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const ctaButtonHoverVariants = {
    hover: {
      scale: 1.06,
      y: -6,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    },
  };

  const iconVariants = {
    hidden: { rotate: 0, scale: 0.8 },
    visible: {
      rotate: 360,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div 
      className="home"
      style={{
        position: 'relative',
        minHeight: '216vh',
        background: 'radial-gradient(circle at 30% 20%, #0f172a 0%, #020617 70%)',
        color: '#f1f5f9',
        overflow: 'hidden'
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '2rem 1.5rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Hero */}
        <motion.div 
          style={{
            textAlign: 'center',
            padding: '8rem 1rem 6rem',
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            border: '1px solid rgba(100,180,255,0.15)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            marginBottom: '5rem'
          }}
          variants={heroVariants}
        >
          <motion.h1 
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5.2rem)',
              fontWeight: 800,
              marginBottom: '1.2rem',
              background: 'linear-gradient(90deg, #a5b4fc, #60a5fa, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px',
              textShadow: '0 4px 30px rgba(0,0,0,0.7)'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Chemical Odyssey
          </motion.h1>

          <motion.p 
            style={{
              fontSize: '1.35rem',
              maxWidth: '780px',
              margin: '0 auto 2.5rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              opacity: 0.92
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Interactive visualizations of molecular transformations •  
            Understand reaction mechanisms through beautiful animations
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            marginBottom: '6rem'
          }}
          variants={containerVariants}
        >
          {[
            {
              icon: Flame,
              color: "#f87171",
              title: "Organic Chemistry",
              desc: "Bond breaking & formation • Mechanisms • Stereochemistry",
              link: "/organic",
              label: "Explore Reactions",
              delay: 0
            },
            {
              icon: Atom,
              color: "#60a5fa",
              title: "Inorganic World",
              desc: "Coordination compounds • Solid state • Organometallics",
              link: "/inorganic",
              label: "Discover Elements",
              delay: 0.1
            },
            {
              icon: PlusCircle,
              color: "#c084fc",
              title: "Build Your Own",
              desc: "Create custom reactions • Test conditions • Visualize outcomes",
              link: "/custom",
              label: "Create Now",
              delay: 0.2
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(100,180,255,0.12)',
                borderRadius: '16px',
                padding: '3rem 2.2rem',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              }}
              variants={{
                ...itemVariants,
                hover: cardHoverVariants.hover
              }}
              custom={item.delay}
              whileHover="hover"
              transition={{ delay: item.delay }}
            >
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: item.delay + 0.3 }}
              >
                <item.icon size={56} color={item.color} style={{ marginBottom: '1.6rem' }} />
              </motion.div>
              
              <motion.h3 
                style={{ fontSize: '1.85rem', marginBottom: '1.2rem', color: '#e2e8f0' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: item.delay + 0.5 }}
              >
                {item.title}
              </motion.h3>
              
              <motion.p 
                style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1.05rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: item.delay + 0.6 }}
              >
                {item.desc}
              </motion.p>
              
              <motion.div
                whileHover="hover"
                variants={buttonHoverVariants}
              >
                <Link
                  to={item.link}
                  style={{
                    color: item.color,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    display: 'inline-block',
                    padding: '0.9rem 2rem',
                    background: `linear-gradient(135deg, ${item.color}30, ${item.color}15)`,
                    border: `2px solid ${item.color}70`,
                    borderRadius: '12px',
                    transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: `0 4px 18px ${item.color}30`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <motion.span
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: item.delay + 0.8 }}
                  >
                    {item.label} →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'linear-gradient(135deg, rgba(30,64,175,0.35), rgba(59,130,246,0.25))',
            borderRadius: '24px',
            border: '1px solid rgba(100,180,255,0.18)',
            backdropFilter: 'blur(14px)'
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.h2 
            style={{
              fontSize: '2.6rem',
              marginBottom: '1.5rem',
              color: '#e0f2fe'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Ready to see chemistry come alive?
          </motion.h2>
          
          <motion.div 
            style={{
              display: 'flex',
              gap: '1.8rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2.5rem'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              whileHover="hover"
              variants={ctaButtonHoverVariants}
            >
              <Link 
                to="/periodic-table" 
                style={{
                  ...ctaButtonStyle('#1e40af', true),
                }}
              >
                <Beaker size={22} /> 
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Periodic Table
                </motion.span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover="hover"
              variants={ctaButtonHoverVariants}
            >
              <Link 
                to="/organic" 
                style={{
                  ...ctaButtonStyle('#7c3aed', false),
                }}
              >
                <Zap size={22} /> 
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Start Exploring Reactions
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles animation */}
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 6 + 1,
              height: Math.random() * 6 + 1,
              background: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 255, ${Math.random() * 0.3 + 0.1})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

const ctaButtonStyle = (color, primary) => ({
  background: primary 
    ? `linear-gradient(135deg, ${color}, ${color}dd)` 
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(59, 130, 246, 0.25))',
  color: 'white',
  padding: '1.4rem 3.2rem',
  borderRadius: '16px',
  textDecoration: 'none',
  fontSize: '1.3rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  border: primary ? 'none' : '3px solid rgba(255,255,255,0.45)',
  backdropFilter: 'blur(12px)',
  boxShadow: primary 
    ? `0 8px 32px ${color}60, 0 0 60px ${color}30` 
    : '0 8px 32px rgba(0,0,0,0.45)',
  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
});

export default Home;