import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Flame, Atom, PlusCircle, BookOpen } from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/organic', label: 'Organic Reactions', icon: Flame },
    { path: '/inorganic', label: 'Inorganic Reactions', icon: Atom },
    { path: '/custom', label: 'Custom Reactions', icon: PlusCircle },
    { path: '/periodic-table', label: 'Learn Elements', icon: BookOpen },
  ];

  return (
    <aside className="modern-sidebar">
      <div className="bg-layer deep-space" />
      <div className="bg-layer reaction-glow" />

      {/* 🔥 Heating Setup */}
      <div className="lab-heating-setup">

        {/* 🧪 BEAKER ABOVE */}
        <div className="beaker-container">
          <div className="beaker">
            <div className="liquid evaporating" />
            <div className="bubbles">
              <div className="bubble" style={{ left: '30%', animationDelay: '0.8s' }} />
              <div className="bubble" style={{ left: '55%', animationDelay: '1.6s' }} />
              <div className="bubble" style={{ left: '70%', animationDelay: '2.4s' }} />
            </div>
            <div className="highlight" />
          </div>
        </div>

        {/* 🔥 BUNSEN BURNER BELOW */}
        <div className="bunsen-burner">
          <div className="burner-base" />
          <div className="burner-tube" />
          <div className="flame">
            <div className="heat-shimmer" />
            <div className="flame-inner" />
            <div className="flame-core" />
            <div className="flame-glow" />
          </div>
        </div>

      </div>

      {/* Navigation */}
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                <span className="nav-label">{item.label}</span>
                <div className="item-glow" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ================== STYLES ================== */}
      <style jsx>{`
        .modern-sidebar {
          position: relative;
          width: 260px;
          height: 216vh;
          background: #0f172a;
          overflow: hidden;
          border-right: 1px solid rgba(165,180,252,0.1);
          box-shadow: 2px 0 20px rgba(0,0,0,0.5);
        }

        .bg-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .deep-space {
          background: radial-gradient(circle at 75% 15%, #0f172a 0%, #02040a 100%);
        }

        .reaction-glow {
          background:
            radial-gradient(circle at 65% 75%, rgba(59,130,246,0.08), transparent 55%),
            radial-gradient(circle at 25% 35%, rgba(139,92,246,0.06), transparent 50%);
        }

        /* Heating setup */
        .lab-heating-setup {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.5;
          pointer-events: none;
        }

        /* Beaker */
        .beaker-container {
          width: 80px;
          height: 130px;
          margin-bottom: 25px;
        }

        .beaker {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(100,150,255,0.07), rgba(140,100,255,0.04));
          border: 2.5px solid rgba(165,180,252,0.3);
          border-radius: 10px 10px 26px 26px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(255,255,255,0.06);
        }

        .liquid {
          position: absolute;
          bottom: 0;
          height: 65%;
          width: 100%;
          background: linear-gradient(to top, #60a5fa, #3b82f6);
          animation: liquidPulse 20s infinite;
        }

        .bubble {
          position: absolute;
          bottom: 10%;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: bubbleFloat 8s infinite;
        }

        .highlight {
          position: absolute;
          top: 10px;
          left: 16px;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, white 10%, transparent 70%);
          opacity: 0.4;
        }

        /* Burner */
        .bunsen-burner {
          position: relative;
          width: 60px;
          height: 90px;
        }

        .burner-base {
          width: 52px;
          height: 18px;
          background: linear-gradient(#334155, #1e293b);
          border-radius: 8px;
          margin: auto;
        }

        .burner-tube {
          width: 18px;
          height: 50px;
          background: #475569;
          margin: auto;
        }

        .flame {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 60px;
          filter: blur(1px);
        }

        .heat-shimmer {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 100px;
          background: linear-gradient(to top, 
            rgba(251,191,36,0.1) 0%,
            rgba(251,191,36,0.05) 40%,
            transparent 100%
          );
          filter: blur(8px);
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .flame-inner {
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(ellipse at 50% 90%, #60a5fa 0%, transparent 30%),
            radial-gradient(ellipse at 50% 70%, #fbbf24 0%, #f97316 50%, transparent 80%),
            radial-gradient(ellipse at 50% 50%, #fef3c7 0%, transparent 40%);
          border-radius: 50% 50% 60% 60% / 40% 40% 60% 60%;
          animation: flameFlicker 0.15s infinite, flameSway 2.5s ease-in-out infinite;
          transform-origin: 50% 100%;
        }

        .flame-core {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 35px;
          background: radial-gradient(ellipse at 50% 80%, #60a5fa 0%, #3b82f6 40%, transparent 70%);
          border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
          animation: coreFlicker 0.2s infinite alternate;
        }

        .flame-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(251,191,36,0.6), rgba(249,115,22,0.3) 40%, transparent 70%);
          animation: glowPulse 2s ease-in-out infinite;
        }

        /* Nav */
        .sidebar-content {
          position: relative;
          z-index: 10;
          padding: 24px 14px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          margin-bottom: 8px;
          border-radius: 14px;
          color: #cbd5e1;
          background: rgba(30,41,59,0.38);
          text-decoration: none;
          transition: 0.3s;
        }

        .nav-item:hover,
        .nav-item.active {
          background: rgba(59,130,246,0.34);
          color: white;
          transform: translateX(5px);
        }

        /* Animations */
        @keyframes bubbleFloat {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-80px); opacity: 0; }
        }

        @keyframes liquidPulse {
          0%,100% { height: 65%; }
          50% { height: 72%; }
        }

        @keyframes flameFlicker {
          0% { transform: scale(1, 1) skewX(0deg); }
          25% { transform: scale(1.05, 0.95) skewX(2deg); }
          50% { transform: scale(0.98, 1.08) skewX(-1deg); }
          75% { transform: scale(1.03, 0.97) skewX(-2deg); }
          100% { transform: scale(1, 1) skewX(0deg); }
        }

        @keyframes flameSway {
          0%, 100% { transform: rotate(-2deg); }
          25% { transform: rotate(3deg); }
          50% { transform: rotate(-3deg); }
          75% { transform: rotate(2deg); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        @keyframes shimmer {
          0%, 100% { transform: translateX(-50%) scaleY(1); opacity: 0.3; }
          50% { transform: translateX(-50%) scaleY(1.2); opacity: 0.5; }
        }

        @keyframes coreFlicker {
          0% { opacity: 0.9; transform: translateX(-50%) scaleY(1); }
          100% { opacity: 1; transform: translateX(-50%) scaleY(1.05); }
        }

        @media (max-width: 1024px) {
          .modern-sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;