import React from 'react';
import { Link, useLocation } from 'react-router-dom'
import { Home, Flame, Atom, PlusCircle, BookOpen } from 'lucide-react'

function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/organic', label: 'Organic Reactions', icon: <Flame size={20} /> },
    { path: '/inorganic', label: 'Inorganic Reactions', icon: <Atom size={20} /> },
    { path: '/custom', label: 'Custom Reactions', icon: <PlusCircle size={20} /> },
    { path: '/periodic-table', label: 'Learn Elements', icon: <BookOpen size={20} /> }
  ]

  return (
    <aside className="sidebar" style={styles.sidebar}>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === item.path ? styles.activeItem : {})
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    padding: '20px 0',
    boxShadow: '2px 0 5px rgba(0,0,0,0.05)'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '0 10px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    color: '#4b5563',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  activeItem: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  icon: {
    display: 'flex',
    alignItems: 'center'
  }
}

export default Sidebar