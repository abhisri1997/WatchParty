import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaUsers, FaVideo } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-brand">
          <FaVideo className="brand-icon" />
          <span>WatchParty</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/login')} className="btn-secondary">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="btn-primary">
            Sign Up
          </button>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Watch Together, <br />
            <span className="gradient-text">Anywhere</span>
          </h1>
          <p className="hero-description">
            Create virtual watch parties with friends and family. 
            Synchronized playback across all devices in real-time.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')} className="btn-large btn-primary">
              Get Started Free
            </button>
            <button onClick={() => navigate('/login')} className="btn-large btn-outline">
              Sign In
            </button>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <FaPlay />
            </div>
            <h3>Synchronized Playback</h3>
            <p>Everyone watches at the same time with automatic synchronization</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Watch Together</h3>
            <p>Invite up to 10 friends to watch your favorite shows and movies</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaVideo />
            </div>
            <h3>Multiple Platforms</h3>
            <p>Support for Netflix, Hulu, Disney+, Prime Video, and more</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2026 WatchParty. Watch together with loved ones.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
