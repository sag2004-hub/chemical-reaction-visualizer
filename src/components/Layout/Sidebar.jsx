import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Flame, Atom, PlusCircle, BookOpen, Menu, X, 
  LogOut, User, Settings, ChevronRight, Sparkles,
  FlaskConical, Beaker, Zap, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate('/auth');
  };

  // Get user's display name with fallbacks
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get user's avatar URL with proper handling
  const getAvatarUrl = () => {
    if (avatarError) return null;
    if (user?.photoURL) return user.photoURL;
    return null;
  };

  // Get user's initials for fallback avatar
  const getUserInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home, color: '#60a5fa' },
    { path: '/organic', label: 'Organic Reactions', icon: Flame, color: '#f97316' },
    { path: '/inorganic', label: 'Inorganic Reactions', icon: Atom, color: '#34d399' },
    { path: '/custom', label: 'Custom Reactions', icon: PlusCircle, color: '#a78bfa' },
    { path: '/periodic-table', label: 'Learn Elements', icon: BookOpen, color: '#fbbf24' },
  ];

  const SidebarContent = () => (
    <>
      <div className="bg-layer deep-space" />
      <div className="bg-layer reaction-glow" />
      <div className="bg-layer gradient-overlay" />

      {/* User Profile Section */}
      {user && (
        <motion.div 
          className="user-profile"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="avatar-container">
            <div className="avatar-glow"></div>
            {getAvatarUrl() ? (
              <img 
                src={getAvatarUrl()} 
                alt={getDisplayName()} 
                className="avatar"
                onError={() => setAvatarError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="avatar-placeholder" style={{
                background: `linear-gradient(135deg, ${getRandomGradient()})`
              }}>
                <span className="avatar-initials">{getUserInitials()}</span>
              </div>
            )}
            {/* Online status indicator */}
            <div className="online-indicator"></div>
          </div>
          <div className="user-info">
            <h4 className="user-name">
              {getDisplayName()}
            </h4>
            <p className="user-email">{user.email}</p>
          </div>
          <div className="user-badge">
            <Sparkles size={12} />
            <span>Active</span>
          </div>
          {/* Provider badge */}
          {user.providerData && user.providerData[0]?.providerId && (
            <div className="provider-badge">
              {user.providerData[0].providerId === 'google.com' && 'Google'}
              {user.providerData[0].providerId === 'github.com' && 'GitHub'}
              {user.providerData[0].providerId === 'password' && 'Email'}
            </div>
          )}
        </motion.div>
      )}

      {/* Decorative Elements */}
      <div className="decorative-elements">
        <div className="floating-particle particle-1"></div>
        <div className="floating-particle particle-2"></div>
        <div className="floating-particle particle-3"></div>
      </div>

      {/* 🔥 Heating Setup */}
      <div className="lab-heating-setup">
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
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                >
                  <div className="nav-icon-wrapper" style={{ color: isActive ? item.color : '#94a3b8' }}>
                    <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      className="active-indicator"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="item-glow" />
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Section with Settings and Logout */}
        <div className="bottom-section">
          <div className="divider" />
          
          <Link to="/profile" className="nav-item settings-item" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
            <div className="nav-icon-wrapper">
              <Settings size={18} />
            </div>
            <span className="nav-label">Settings</span>
          </Link>
          
          <motion.button
            className={`logout-button ${isLoggingOut ? 'logging-out' : ''}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoggingOut ? (
              <>
                <div className="spinner" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={18} />
                <span>Logout</span>
                <ChevronRight size={14} className="logout-arrow" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .modern-sidebar {
          position: relative;
          width: 280px;
          min-height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
          overflow: hidden;
          border-right: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 2px 0 25px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease-in-out;
          z-index: 1000;
        }

        /* Background Layers */
        .bg-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .deep-space {
          background: radial-gradient(circle at 75% 15%, #0f172a 0%, #02040a 100%);
        }

        .reaction-glow {
          background: radial-gradient(circle at 65% 75%, rgba(139, 92, 246, 0.08), transparent 55%);
        }

        .gradient-overlay {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
        }

        /* User Profile Section */
        .user-profile {
          position: relative;
          margin: 24px 20px 20px;
          padding: 20px 16px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(96, 165, 250, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          text-align: center;
          z-index: 10;
        }

        .avatar-container {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 12px;
        }

        .avatar-glow {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          opacity: 0.6;
          filter: blur(8px);
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(139, 92, 246, 0.5);
          position: relative;
          z-index: 1;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          z-index: 1;
        }

        .avatar-initials {
          font-size: 2rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .online-indicator {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          background: #34d399;
          border: 2px solid #1e293b;
          border-radius: 50%;
          z-index: 2;
          animation: pulse 2s ease-in-out infinite;
        }

        .user-info {
          margin-bottom: 8px;
        }

        .user-name {
          font-size: 1rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.7rem;
          color: #94a3b8;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(52, 211, 153, 0.15);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 20px;
          font-size: 0.65rem;
          color: #34d399;
        }

        .provider-badge {
          margin-top: 8px;
          font-size: 0.6rem;
          color: #94a3b8;
          background: rgba(139, 92, 246, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
        }

        /* Decorative Particles */
        .decorative-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(139, 92, 246, 0.5);
          border-radius: 50%;
          animation: floatParticle 8s linear infinite;
        }

        .particle-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        .particle-2 {
          top: 60%;
          left: 85%;
          animation-delay: 2s;
          width: 3px;
          height: 3px;
        }
        .particle-3 {
          top: 80%;
          left: 15%;
          animation-delay: 4s;
        }

        /* Heating Setup */
        .lab-heating-setup {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.4;
          pointer-events: none;
          z-index: 5;
        }

        .beaker-container {
          width: 70px;
          height: 110px;
          margin-bottom: 20px;
        }

        .beaker {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(100,150,255,0.07), rgba(140,100,255,0.04));
          border: 2px solid rgba(165,180,252,0.3);
          border-radius: 8px 8px 22px 22px;
          position: relative;
          overflow: hidden;
        }

        .liquid {
          position: absolute;
          bottom: 0;
          height: 60%;
          width: 100%;
          background: linear-gradient(to top, #60a5fa, #3b82f6);
          animation: liquidPulse 20s infinite;
        }

        .bubble {
          position: absolute;
          bottom: 10%;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: bubbleFloat 8s infinite;
        }

        .highlight {
          position: absolute;
          top: 8px;
          left: 12px;
          width: 15px;
          height: 15px;
          background: radial-gradient(circle, white 10%, transparent 70%);
          opacity: 0.4;
        }

        .bunsen-burner {
          position: relative;
          width: 50px;
          height: 70px;
        }

        .burner-base {
          width: 44px;
          height: 14px;
          background: linear-gradient(#334155, #1e293b);
          border-radius: 6px;
          margin: auto;
        }

        .burner-tube {
          width: 14px;
          height: 40px;
          background: #475569;
          margin: auto;
        }

        .flame {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 50px;
          filter: blur(1px);
        }

        .heat-shimmer {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 80px;
          background: linear-gradient(to top, rgba(251,191,36,0.1) 0%, transparent 100%);
          filter: blur(8px);
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .flame-inner {
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at 50% 90%, #60a5fa 0%, transparent 30%),
                      radial-gradient(ellipse at 50% 70%, #fbbf24 0%, #f97316 50%, transparent 80%);
          border-radius: 50% 50% 60% 60% / 40% 40% 60% 60%;
          animation: flameFlicker 0.15s infinite, flameSway 2.5s ease-in-out infinite;
        }

        .flame-core {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 28px;
          background: radial-gradient(ellipse at 50% 80%, #60a5fa 0%, #3b82f6 40%, transparent 70%);
          border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
          animation: coreFlicker 0.2s infinite alternate;
        }

        .flame-glow {
          position: absolute;
          inset: -15px;
          background: radial-gradient(circle, rgba(251,191,36,0.5), transparent 70%);
          animation: glowPulse 2s ease-in-out infinite;
        }

        /* Sidebar Content */
        .sidebar-content {
          position: relative;
          z-index: 10;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 20px);
        }

        .sidebar-nav {
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          margin-bottom: 6px;
          border-radius: 14px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          transition: transform 0.3s ease;
        }

        .nav-item:hover {
          background: rgba(139, 92, 246, 0.15);
          color: white;
          transform: translateX(5px);
        }

        .nav-item:hover .nav-icon-wrapper {
          transform: scale(1.1);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(96, 165, 250, 0.15));
          color: white;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .nav-label {
          font-size: 0.9rem;
          font-weight: 500;
          flex: 1;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: linear-gradient(to bottom, #a78bfa, #60a5fa);
          border-radius: 0 3px 3px 0;
        }

        .item-glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .nav-item.active .item-glow {
          opacity: 0.1;
          background: radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4), transparent 70%);
        }

        /* Bottom Section */
        .bottom-section {
          margin-top: auto;
          padding-top: 16px;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
          margin: 16px 0;
        }

        .settings-item {
          background: rgba(30, 41, 59, 0.5);
          margin-bottom: 12px;
        }

        .logout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 14px;
          color: #f87171;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .logout-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-2px);
        }

        .logout-button.logging-out {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .logout-arrow {
          transition: transform 0.3s ease;
        }

        .logout-button:hover .logout-arrow {
          transform: translateX(3px);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-top-color: #f87171;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Mobile Styles */
        .modern-sidebar.mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          transform: translateX(-100%);
          height: 100vh;
          overflow-y: auto;
          z-index: 1001;
        }

        .modern-sidebar.mobile-sidebar.mobile-open {
          transform: translateX(0);
        }

        .mobile-menu-button {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1002;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 0.75rem;
          cursor: pointer;
          color: #e2e8f0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .mobile-menu-button:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: #a78bfa;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        /* Animations */
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        @keyframes floatParticle {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes bubbleFloat {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-60px); opacity: 0; }
        }

        @keyframes liquidPulse {
          0%,100% { height: 60%; }
          50% { height: 68%; }
        }

        @keyframes flameFlicker {
          0% { transform: scale(1, 1) skewX(0deg); }
          25% { transform: scale(1.04, 0.96) skewX(1.5deg); }
          50% { transform: scale(0.98, 1.06) skewX(-1deg); }
          75% { transform: scale(1.02, 0.98) skewX(-1.5deg); }
          100% { transform: scale(1, 1) skewX(0deg); }
        }

        @keyframes flameSway {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) scaleY(1); }
          50% { opacity: 0.4; transform: translateX(-50%) scaleY(1.2); }
        }

        @keyframes coreFlicker {
          0% { opacity: 0.8; transform: translateX(-50%) scaleY(1); }
          100% { opacity: 1; transform: translateX(-50%) scaleY(1.08); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          .modern-sidebar:not(.mobile-sidebar) {
            width: 240px;
          }
          
          .nav-label {
            font-size: 0.85rem;
          }
          
          .nav-item {
            padding: 10px 14px;
          }
          
          .user-name {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          .modern-sidebar.mobile-sidebar {
            width: 280px;
          }
          
          .sidebar-content {
            padding: 16px 12px;
          }
          
          .nav-item {
            padding: 10px 14px;
          }
          
          .lab-heating-setup {
            transform: translateX(-50%) scale(0.85);
            bottom: 80px;
          }
        }

        @media (max-width: 480px) {
          .modern-sidebar.mobile-sidebar {
            width: 100%;
            max-width: 320px;
          }
          
          .sidebar-content {
            padding: 12px 10px;
          }
          
          .lab-heating-setup {
            transform: translateX(-50%) scale(0.75);
            bottom: 60px;
          }
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside className={`modern-sidebar ${isMobile ? 'mobile-sidebar' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
}

// Helper function for random gradient colors for avatar placeholder
const getRandomGradient = () => {
  const gradients = [
    '#a78bfa, #8b5cf6',
    '#60a5fa, #3b82f6',
    '#34d399, #10b981',
    '#f97316, #f59e0b',
    '#f87171, #ef4444',
    '#c084fc, #a855f7'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export default Sidebar;