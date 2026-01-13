import React from 'react';
import { Link } from 'react-router-dom'
import { Beaker, Flame, Atom, PlusCircle, Zap } from 'lucide-react'

function Home() {
  return (
    <div className="home">
      <div className="hero" style={styles.hero}>
        <h1 style={styles.heroTitle}>Interactive Chemical Reaction Visualizer</h1>
        <p style={styles.heroSubtitle}>
          Explore organic and inorganic reactions through interactive animations. 
          Understand how compounds break and form during chemical reactions.
        </p>
      </div>

      <div className="features" style={styles.features}>
        <div className="feature-card" style={styles.featureCard}>
          <div style={styles.featureIcon}>
            <Flame size={40} color="#10b981" />
          </div>
          <h3 style={styles.featureTitle}>Organic Reactions</h3>
          <p style={styles.featureText}>
            Visualize complex organic reactions with step-by-step animations showing bond formation and breaking.
          </p>
          <Link to="/organic" style={styles.featureLink}>Explore Organic →</Link>
        </div>

        <div className="feature-card" style={styles.featureCard}>
          <div style={styles.featureIcon}>
            <Atom size={40} color="#3b82f6" />
          </div>
          <h3 style={styles.featureTitle}>Inorganic Reactions</h3>
          <p style={styles.featureText}>
            Study inorganic reactions with detailed animations showing ionic interactions and compound formation.
          </p>
          <Link to="/inorganic" style={styles.featureLink}>Explore Inorganic →</Link>
        </div>

        <div className="feature-card" style={styles.featureCard}>
          <div style={styles.featureIcon}>
            <PlusCircle size={40} color="#8b5cf6" />
          </div>
          <h3 style={styles.featureTitle}>Custom Reactions</h3>
          <p style={styles.featureText}>
            Create your own reactions and visualize them. Experiment with different compounds and conditions.
          </p>
          <Link to="/custom" style={styles.featureLink}>Create Reaction →</Link>
        </div>
      </div>

      <div className="cta" style={styles.cta}>
        <h2 style={styles.ctaTitle}>Start Your Chemistry Journey</h2>
        <p style={styles.ctaText}>
          Learn chemical reactions through interactive visualization. Perfect for students and educators.
        </p>
        <div style={styles.ctaButtons}>
          <Link to="/periodic-table" style={styles.ctaButtonPrimary}>
            <Beaker size={20} /> Learn Elements
          </Link>
          <Link to="/organic" style={styles.ctaButtonSecondary}>
            <Zap size={20} /> View Reactions
          </Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    backgroundColor: '#f0f9ff',
    padding: '60px 20px',
    borderRadius: '15px',
    marginBottom: '40px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '2.5rem',
    color: '#1e40af',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#4b5563',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '40px'
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    textAlign: 'center'
  },
  featureIcon: {
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '15px',
    fontWeight: '600'
  },
  featureText: {
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  featureLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  cta: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '50px 30px',
    borderRadius: '15px',
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  ctaText: {
    fontSize: '1.1rem',
    marginBottom: '30px',
    opacity: '0.9',
    maxWidth: '600px',
    margin: '0 auto 30px'
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaButtonPrimary: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'background-color 0.3s'
  },
  ctaButtonSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    border: '2px solid white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s'
  }
}

export default Home