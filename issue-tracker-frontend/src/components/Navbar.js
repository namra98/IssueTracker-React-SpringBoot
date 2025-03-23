import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Issue Tracker</h2>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/add-issue" style={styles.link}>Add Issue</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white'
  },
  logo: {
    margin: 0
  },
  navLinks: {
    display: 'flex',
    gap: '15px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px'
  }
};

export default Navbar;
