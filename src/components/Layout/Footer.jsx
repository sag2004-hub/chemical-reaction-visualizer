import React from 'react';
function Footer() {
  return (
    <footer className="footer" style={styles.footer}>
      <div className="container" style={styles.container}>
        <p style={styles.text}>
          Chemical Reaction Visualizer &copy; {new Date().getFullYear()} - Educational Tool for Chemistry Learning
        </p>
        <p style={styles.subtext}>
          Visualize organic and inorganic reactions with interactive animations
        </p>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '30px 0',
    marginTop: 'auto'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center'
  },
  text: {
    fontSize: '1rem',
    marginBottom: '10px'
  },
  subtext: {
    fontSize: '0.875rem',
    color: '#9ca3af'
  }
}

export default Footer