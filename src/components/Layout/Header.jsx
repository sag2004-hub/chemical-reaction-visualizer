import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Beaker, Home, FlaskConical, Atom, BookOpen, Settings } from 'lucide-react';

function Header() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { path: '/',          label: 'Home',       icon: Home         },
    { path: '/organic',   label: 'Organic',    icon: FlaskConical },
    { path: '/inorganic', label: 'Inorganic',  icon: Atom         },
    { path: '/periodic-table', label: 'Elements', icon: BookOpen },
    { path: '/custom',    label: 'Custom',     icon: Settings     },
  ];

  return (
    <header className="modern-header">
      {/* Background layers */}
      <div className="bg-layer deep-space" />
      <div className="bg-layer nebula" />
      
      {/* Orbiting system */}
      <div className="orbital-system">
        <div className="nucleus" />
        <div className="orbit orbit-fast">
          <div className="electron electron-blue" />
        </div>
        <div className="orbit orbit-medium">
          <div className="electron electron-purple" />
        </div>
        <div className="orbit orbit-slow" style={{ animationDirection: 'reverse' }}>
          <div className="electron electron-cyan" />
        </div>
      </div>

      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo-wrapper">
          <div className="logo-beaker">
            <Beaker size={34} strokeWidth={1.8} />
          </div>
          <div className="logo-text">
            <div className="title-gradient">
              Chemical<span className="title-highlight">Reaction</span>
            </div>
            <div className="subtitle-gradient">
              Interactive Chemistry Experience
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="primary-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredItem === item.label;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`nav-pill ${isHovered ? 'active' : ''}`}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon size={18} strokeWidth={isHovered ? 2.2 : 1.8} />
                <span className="nav-text">{item.label}</span>
                
                <div className="pill-glow" />
                <div className="pill-border-gradient" />
              </Link>
            );
          })}
        </nav>
      </div>

      <style jsx>{`
        .modern-header {
          position: relative;
          height: 96px;
          background: #0f172a;
          overflow: hidden;
          isolation: isolate;
          z-index: 1000;
          box-shadow: 0 12px 40px rgba(0,0,0,0.65);
        }

        .bg-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .deep-space {
          background: radial-gradient(circle at 20% 80%, #0f172a 0%, #02040a 100%);
        }

        .nebula {
          background: 
            radial-gradient(circle at 70% 30%, rgba(139,92,246,0.08) 0%, transparent 40%),
            radial-gradient(circle at 15% 25%, rgba(59,130,246,0.07) 0%, transparent 45%);
          opacity: 0.9;
        }

        .orbital-system {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
        }

        .nucleus {
          width: 64px;
          height: 64px;
          background: radial-gradient(circle at 35% 35%, #60a5fa90, #3b82f660 60%, transparent 80%);
          border-radius: 50%;
          filter: blur(16px);
          animation: nucleus-pulse 10s ease-in-out infinite;
        }

        .orbit {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(165,180,252,0.12);
        }

        .orbit-fast   { width: 180px; height: 180px; animation: orbit 9s linear infinite; }
        .orbit-medium { width: 280px; height: 280px; animation: orbit 14s linear infinite; }
        .orbit-slow   { width: 380px; height: 380px; animation: orbit 22s linear infinite; }

        .electron {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 16px 6px currentColor;
          animation: electron-trail 1.8s ease-in-out infinite;
        }

        .electron-blue  { background: #60a5fa; box-shadow: 0 0 20px 8px #60a5fa70; }
        .electron-purple{ background: #c084fc; box-shadow: 0 0 20px 8px #c084fc70; }
        .electron-cyan  { background: #67e8f9; box-shadow: 0 0 20px 8px #67e8f970; }

        .header-container {
          position: relative;
          z-index: 10;
          height: 100%;
          max-width: 1480px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 18px;
          text-decoration: none;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .logo-wrapper:hover {
          transform: scale(1.04) translateY(-1px);
        }

        .logo-beaker {
          width: 62px;
          height: 62px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border-radius: 18px;
          display: grid;
          place-items: center;
          box-shadow: 
            0 10px 30px rgba(59,130,246,0.55),
            inset 0 2px 0 rgba(255,255,255,0.25);
          transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }

        .logo-wrapper:hover .logo-beaker {
          transform: rotate(12deg) scale(1.12);
        }

        .logo-text .title-gradient {
          font-size: 2.1rem;
          font-weight: 800;
          background: linear-gradient(90deg, #f8fafc 0%, #e0f2fe 45%, #c7d2fe 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: -0.025em;
          margin: 0;
          line-height: 1;
        }

        .title-highlight {
          background: linear-gradient(90deg, #a5b4fc, #c084fc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .subtitle-gradient {
          margin-top: 3px;
          font-size: 0.84rem;
          font-weight: 500;
          background: linear-gradient(90deg, #94a3b8, #cbd5e1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: 0.4px;
        }

        .primary-nav {
          display: flex;
          gap: 10px;
        }

        .nav-pill {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 22px;
          border-radius: 999px;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 0.96rem;
          text-decoration: none;
          background: rgba(30,41,59,0.45);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(165,180,252,0.12);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }

        .nav-pill:hover,
        .nav-pill.active {
          color: white;
          transform: translateY(-2px);
          background: rgba(59,130,246,0.28);
          border-color: rgba(165,180,252,0.35);
          box-shadow: 
            0 10px 30px rgba(59,130,246,0.35),
            0 0 0 1px rgba(165,180,252,0.25) inset;
        }

        .pill-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(165,180,252,0.25), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .nav-pill:hover .pill-glow,
        .nav-pill.active .pill-glow {
          opacity: 1;
        }

        .pill-border-gradient {
          position: absolute;
          inset: -2px;
          border-radius: 999px;
          padding: 2px;
          background: linear-gradient(45deg, #60a5fa, #c084fc, #60a5fa);
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 0.4s ease;
          mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
        }

        .nav-pill:hover .pill-border-gradient,
        .nav-pill.active .pill-border-gradient {
          opacity: 0.6;
          animation: borderFlow 3s linear infinite;
        }

        /* Animations */
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes nucleus-pulse {
          0%, 100%   { transform: scale(1);   opacity: 0.55; }
          50%        { transform: scale(1.15); opacity: 0.85; }
        }

        @keyframes electron-trail {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50%      { transform: translateX(-50%) scale(1.35); }
        }

        @keyframes borderFlow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @media (max-width: 1024px) {
          .primary-nav { display: none; }
          .header-container { justify-content: center; }
        }
      `}</style>
    </header>
  );
}

export default Header;