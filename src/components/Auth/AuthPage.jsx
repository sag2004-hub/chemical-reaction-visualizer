// src/components/Auth/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus,
  FlaskConical, ArrowRight, CheckCircle,
  AlertCircle, Github, Chrome, X, Loader,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  signUp, signIn, signInWithGoogle, signInWithGithub,
  resetPassword,
} from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';

/* ─── responsive hook ─── */
const useWindowSize = () => {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
};

/* ═══════════════════════════════════════════════
   ATOM SVG COMPONENT
═══════════════════════════════════════════════ */
const Atom = ({ cx, cy, r, color, orbits, speed = 1, baseDelay = 0 }) => {
  const frames = 61;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke={color} strokeWidth="1.2" opacity={0.3} />
      <circle cx={cx} cy={cy} r={r * 0.3} fill={color} opacity={0.85}
        style={{ filter: `drop-shadow(0 0 ${r * 0.35}px ${color})` }} />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="white" opacity={0.55} />

      {orbits.map((orbit, oi) => {
        const rx = r * orbit.rx;
        const ry = r * orbit.ry;
        const tilt = orbit.tilt ?? 0;
        const dur = (orbit.dur ?? 4) / speed;
        const eCount = orbit.electrons ?? 1;
        return (
          <g key={oi} transform={`rotate(${tilt}, ${cx}, ${cy})`}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
              fill="none" stroke={color} strokeWidth="0.7" opacity={0.2} strokeDasharray="3 5" />
            {Array.from({ length: eCount }).map((_, ei) => {
              const phaseOff = (ei / eCount) * 2 * Math.PI;
              const cxF = Array.from({ length: frames }, (_, k) => cx + rx * Math.cos((k / (frames - 1)) * 2 * Math.PI + phaseOff));
              const cyF = Array.from({ length: frames }, (_, k) => cy + ry * Math.sin((k / (frames - 1)) * 2 * Math.PI + phaseOff));
              return (
                <motion.circle key={ei} r={r * 0.1} fill={color} opacity={0.92}
                  style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                  animate={{ cx: cxF, cy: cyF }}
                  transition={{ duration: dur, delay: baseDelay + oi * 0.35, repeat: Infinity, ease: 'linear' }}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/* ═══════════════════════════════════════════════
   LEFT PANEL — atom animation
═══════════════════════════════════════════════ */
const AtomPanel = () => {
  const ATOMS = [
    {
      cx: 200, cy: 210, r: 62, color: '#a78bfa', speed: 1, baseDelay: 0,
      orbits: [
        { rx: 1.6, ry: 0.52, tilt: 0,   dur: 3.4, electrons: 1 },
        { rx: 1.6, ry: 0.52, tilt: 60,  dur: 4.6, electrons: 1 },
        { rx: 1.6, ry: 0.52, tilt: 120, dur: 5.8, electrons: 2 },
      ],
    },
    {
      cx: 490, cy: 140, r: 40, color: '#c4b5fd', speed: 1.25, baseDelay: 0.6,
      orbits: [
        { rx: 1.65, ry: 0.48, tilt: 25,  dur: 3.0, electrons: 1 },
        { rx: 1.65, ry: 0.48, tilt: 115, dur: 4.2, electrons: 1 },
      ],
    },
    {
      cx: 105, cy: 405, r: 34, color: '#8b5cf6', speed: 0.9, baseDelay: 1.1,
      orbits: [
        { rx: 1.7, ry: 0.5, tilt: -15, dur: 3.8, electrons: 1 },
        { rx: 1.7, ry: 0.5, tilt: 75,  dur: 5.0, electrons: 1 },
      ],
    },
    {
      cx: 460, cy: 375, r: 48, color: '#7c3aed', speed: 1.1, baseDelay: 0.9,
      orbits: [
        { rx: 1.55, ry: 0.5,  tilt: 10,  dur: 3.2, electrons: 1 },
        { rx: 1.55, ry: 0.5,  tilt: 85,  dur: 4.5, electrons: 2 },
        { rx: 1.55, ry: 0.5,  tilt: 160, dur: 6.0, electrons: 1 },
      ],
    },
    {
      cx: 315, cy: 455, r: 28, color: '#ddd6fe', speed: 1.5, baseDelay: 1.4,
      orbits: [{ rx: 1.65, ry: 0.5, tilt: 45, dur: 2.6, electrons: 1 }],
    },
  ];
  const bonds = [[0,1],[0,2],[0,3],[1,3],[3,4]];
  const sparks = Array.from({ length: 26 }, (_, i) => ({
    id: i, x: Math.random() * 580, y: Math.random() * 520,
    r: 1 + Math.random() * 2.5, dur: 5 + Math.random() * 9, delay: Math.random() * 10,
  }));

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 38% 35%, #1e0a4a 0%, #0d0320 55%, #080118 100%)',
    }}>
      {/* Grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055 }}>
        <defs>
          <pattern id="atomgrid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0L0 0 0 44" fill="none" stroke="#a78bfa" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#atomgrid)" />
      </svg>

      {/* Scene */}
      <svg viewBox="0 0 580 520" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="ag1" cx="34%" cy="40%" r="48%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ag2" cx="78%" cy="72%" r="42%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.14" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="580" height="520" fill="url(#ag1)" />
        <rect width="580" height="520" fill="url(#ag2)" />

        {bonds.map(([a, b], i) => (
          <motion.line key={i}
            x1={ATOMS[a].cx} y1={ATOMS[a].cy} x2={ATOMS[b].cx} y2={ATOMS[b].cy}
            stroke="#a78bfa" strokeWidth="1" strokeDasharray="5 7"
            animate={{ opacity: [0.06, 0.2, 0.06] }}
            transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        {sparks.map(p => (
          <motion.circle key={p.id} cx={p.x} cy={p.y} r={p.r} fill="#c4b5fd"
            animate={{ cy: [p.y, p.y - 45, p.y + 15, p.y], opacity: [0, 0.55, 0.3, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {ATOMS.map((a, i) => <Atom key={i} {...a} />)}
      </svg>

      {/* Bottom label */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem',
        background: 'linear-gradient(to top, rgba(8,1,24,0.97) 0%, transparent 100%)',
      }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FlaskConical size={16} color="#a78bfa" />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7c3aed', fontFamily: 'Georgia, serif' }}>
              Chemical Reactions Odyssey
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', fontWeight: 800, lineHeight: 1.2,
            background: 'linear-gradient(135deg, #f5f3ff, #c4b5fd, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontFamily: 'Georgia, serif', marginBottom: '0.4rem',
          }}>
            Explore the World<br />of Reactions
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#5a3a8a', lineHeight: 1.5, maxWidth: '280px' }}>
            Simulate, visualize and understand chemical reactions with atomic-level precision.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   INPUT FIELD
═══════════════════════════════════════════════ */
const ChemInput = ({ icon: Icon, type, placeholder, value, onChange, error, rightEl }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: error ? '1.9rem' : '1.1rem' }}>
      <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
        <motion.div animate={{ color: focused ? '#a78bfa' : '#4a3a6a' }} transition={{ duration: 0.2 }}>
          <Icon size={15} />
        </motion.div>
      </div>
      <motion.div animate={{ opacity: focused ? 1 : 0 }}
        style={{ position: 'absolute', inset: -1, borderRadius: '12px', zIndex: 0, pointerEvents: 'none',
          boxShadow: '0 0 0 1.5px #a78bfa, 0 0 16px rgba(167,139,250,0.2)' }} />
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '0.8rem 0.9rem 0.8rem 2.5rem',
          background: 'rgba(15,5,35,0.65)',
          border: `1px solid ${error ? '#ef4444' : focused ? '#a78bfa' : 'rgba(139,92,246,0.25)'}`,
          borderRadius: '12px', color: '#e2d9ff', fontSize: '0.9rem', outline: 'none',
          position: 'relative', zIndex: 1, transition: 'border-color 0.2s', boxSizing: 'border-box',
        }}
      />
      {rightEl && (
        <div style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
          {rightEl}
        </div>
      )}
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', bottom: '-1.25rem', left: 0, fontSize: '0.7rem', color: '#ef4444' }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SUBMIT BUTTON
═══════════════════════════════════════════════ */
const SubmitBtn = ({ loading, label, icon: BtnIcon }) => (
  <motion.button type="submit"
    whileHover={{ scale: 1.015, boxShadow: '0 8px 28px rgba(139,92,246,0.4)' }}
    whileTap={{ scale: 0.975 }}
    disabled={loading}
    style={{
      width: '100%', padding: '0.85rem',
      background: loading ? 'rgba(139,92,246,0.1)' : 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
      border: 'none', borderRadius: '12px', color: 'white',
      fontSize: '0.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
      boxShadow: '0 4px 20px rgba(139,92,246,0.28)',
      transition: 'background 0.3s', marginTop: '0.2rem',
    }}>
    {loading ? (
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Loader size={18} />
      </motion.div>
    ) : (
      <>{BtnIcon && <BtnIcon size={16} />}<span>{label}</span><ArrowRight size={15} /></>
    )}
  </motion.button>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
const AuthPage = () => {
  const { w } = useWindowSize();
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!isLogin && !formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email is invalid';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Min. 6 characters';
    if (!isLogin && formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true); setErrorMessage('');
    const result = isLogin
      ? await signIn(formData.email, formData.password)
      : await signUp(formData.email, formData.password, formData.name);
    setIsLoading(false);
    if (result.error) { setErrorMessage(result.error); }
    else {
      setSuccessMessage(isLogin ? 'Login successful! Redirecting...' : 'Account created! Redirecting...');
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 1600);
    }
  };

  const handleSocial = async (provider) => {
    setIsLoading(true); setErrorMessage('');
    const result = provider === 'Google' ? await signInWithGoogle() : await signInWithGithub();
    setIsLoading(false);
    if (result.error) { setErrorMessage(result.error); }
    else {
      setSuccessMessage(`Signed in with ${provider}! Redirecting...`);
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 1600);
    }
  };

  const handleReset = async (ev) => {
    ev.preventDefault();
    if (!resetEmail.trim()) { setErrorMessage('Please enter your email'); return; }
    setIsLoading(true);
    const result = await resetPassword(resetEmail);
    setIsLoading(false);
    if (result.error) { setErrorMessage(result.error); }
    else {
      setSuccessMessage('Reset email sent! Check your inbox.');
      setShowSuccess(true);
      setTimeout(() => { setShowResetPassword(false); setResetEmail(''); setShowSuccess(false); }, 3000);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin); setErrors({}); setErrorMessage('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  /* ── layout values ── */
  const cardPad = isMobile ? '1.75rem 1.25rem' : isTablet ? '2rem 1.75rem' : '2.5rem';
  const cardMaxW = isMobile ? '420px' : '960px';

  return (
    <>
      {/* Global style — hide all scrollbars */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; overflow: hidden; height: 100%; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 30% 20%, #0f172a 0%, #020617 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '1rem' : '1.5rem',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            maxWidth: cardMaxW,
            /* Height: on desktop fit viewport, on mobile auto */
            maxHeight: isMobile ? 'none' : 'calc(100vh - 3rem)',
            borderRadius: isMobile ? '24px' : '32px',
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.22)',
          }}
        >
          {/* ── LEFT: Atom animation panel — hidden on mobile ── */}
          {!isMobile && (
            <div style={{
              flex: isTablet ? '0 0 42%' : '0 0 50%',
              position: 'relative',
              minHeight: isTablet ? '460px' : '520px',
            }}>
              <AtomPanel />
            </div>
          )}

          {/* ── RIGHT: Auth form ── */}
          <div style={{
            flex: 1,
            background: 'rgba(12,6,30,0.97)',
            borderLeft: isMobile ? 'none' : '1px solid rgba(139,92,246,0.18)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: cardPad,
            position: 'relative',
            /* Allow internal scroll ONLY if needed, but hidden */
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
            {/* Ambient glows */}
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Mobile atom background (subtle) */}
            {isMobile && (
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 20%, rgba(124,58,237,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
            )}

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: isMobile ? '1.5rem' : '1.75rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: isMobile ? '40px' : '46px',
                      height: isMobile ? '40px' : '46px',
                      background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                      borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 22px rgba(139,92,246,0.45)',
                    }}
                  >
                    <FlaskConical size={isMobile ? 20 : 22} color="white" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '14px',
                      border: '1.5px solid rgba(167,139,250,0.6)', pointerEvents: 'none',
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 800, color: '#e2d9ff', lineHeight: 1.1, fontFamily: 'Georgia, serif' }}>
                    Chemical Odyssey
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#5a3a8a', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    Reaction Studio
                  </div>
                </div>
              </div>

              {/* Title */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={showResetPassword ? 'r' : isLogin ? 'l' : 's'}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  style={{ marginBottom: isMobile ? '1.25rem' : '1.5rem' }}
                >
                  <h1 style={{
                    fontSize: isMobile ? '1.45rem' : 'clamp(1.45rem, 2.5vw, 1.7rem)',
                    fontWeight: 800, lineHeight: 1.2, fontFamily: 'Georgia, serif',
                    background: 'linear-gradient(90deg, #c4b5fd, #a78bfa, #8b5cf6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    marginBottom: '0.3rem',
                  }}>
                    {showResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p style={{ fontSize: '0.8rem', color: '#4a3070' }}>
                    {showResetPassword
                      ? 'Enter your email to receive a reset link'
                      : isLogin ? 'Sign in to continue your chemical journey' : 'Join us and start exploring reactions'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Alerts */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: '10px', padding: '0.6rem 0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.8rem' }}>
                    <CheckCircle size={15} /><span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.6rem 0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.8rem' }}>
                    <AlertCircle size={15} />
                    <span style={{ flex: 1 }}>{errorMessage}</span>
                    <button onClick={() => setErrorMessage('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}><X size={13} /></button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {showResetPassword ? (
                  <motion.form key="reset"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.28 }} onSubmit={handleReset}>
                    <ChemInput icon={Mail} type="email" placeholder="Email Address"
                      value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
                    <SubmitBtn loading={isLoading} label="Send Reset Link" icon={Mail} />
                    <button type="button" onClick={() => { setShowResetPassword(false); setErrorMessage(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.9rem auto 0', background: 'none', border: 'none', color: '#4a3070', cursor: 'pointer', fontSize: '0.78rem' }}>
                      ← Back to Sign In
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key={isLogin ? 'login' : 'signup'}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                  >
                    {!isLogin && (
                      <ChemInput icon={User} type="text" placeholder="Full Name"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
                    )}
                    <ChemInput icon={Mail} type="email" placeholder="Email Address"
                      value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} error={errors.email} />
                    <ChemInput icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Password"
                      value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} error={errors.password}
                      rightEl={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          style={{ background: 'none', border: 'none', color: '#4a3a6a', cursor: 'pointer', padding: 0, display: 'flex' }}>
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                    />
                    {!isLogin && (
                      <ChemInput icon={Lock} type="password" placeholder="Confirm Password"
                        value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} error={errors.confirmPassword} />
                    )}

                    {isLogin && (
                      <div style={{ textAlign: 'right', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                        <button type="button" onClick={() => setShowResetPassword(true)}
                          style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '0.78rem' }}>
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <SubmitBtn loading={isLoading} label={isLogin ? 'Sign In' : 'Create Account'} icon={isLogin ? LogIn : UserPlus} />
                  </motion.form>
                )}
              </AnimatePresence>

              {!showResetPassword && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', margin: '1rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(139,92,246,0.2)' }} />
                    <span style={{ fontSize: '0.68rem', color: '#3a2560', whiteSpace: 'nowrap' }}>Or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(139,92,246,0.2)' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    {[{ icon: Chrome, label: 'Google', key: 'Google' }, { icon: Github, label: 'GitHub', key: 'GitHub' }].map(({ icon: Icon, label, key }) => (
                      <motion.button key={key} type="button"
                        whileHover={{ scale: 1.02, borderColor: 'rgba(167,139,250,0.5)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSocial(key)} disabled={isLoading}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                          padding: '0.65rem', background: 'rgba(15,5,35,0.7)',
                          border: '1px solid rgba(139,92,246,0.22)', borderRadius: '11px',
                          color: '#7a6aaa', cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
                        }}>
                        <Icon size={15} />{label}
                      </motion.button>
                    ))}
                  </div>

                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#3a2560', marginTop: '1rem', marginBottom: 0 }}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={switchMode}
                      style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontWeight: 700, marginLeft: '0.35rem', fontSize: '0.8rem' }}>
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </>
              )}

              <a href="/" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                marginTop: '1rem', paddingTop: '1rem',
                borderTop: '1px solid rgba(139,92,246,0.1)',
                color: '#2e1f4a', textDecoration: 'none', fontSize: '0.72rem',
              }}>
                <ArrowRight size={11} style={{ transform: 'rotate(180deg)' }} />
                Back to Home
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AuthPage;