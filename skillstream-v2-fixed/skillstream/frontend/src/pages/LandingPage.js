import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, TrendingUp, Users } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>AI-Powered Adaptive Learning</span>
          </div>
          
          <h1 className="hero-title">
            <span className="text-primary">SKILL</span>STREAM
          </h1>
          
          <p className="hero-subtitle">
            Transform Corporate Training with Intelligent, 
            Personalized Learning Paths That Adapt to Every Employee
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
              Start Learning <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">3x</div>
              <div className="stat-label">Faster Learning</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">87%</div>
              <div className="stat-label">Skill Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <h2 className="section-title">The Training Problem</h2>
          <p className="section-description">
            Traditional corporate training fails because it treats everyone the same. 
            SkillStream understands that every employee learns differently.
          </p>

          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">⏱️</div>
              <h3>Wasted Time</h3>
              <p>Employees sit through irrelevant modules they already know</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">😓</div>
              <h3>Low Engagement</h3>
              <p>One-size-fits-all content doesn't match learning styles</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📉</div>
              <h3>Poor Retention</h3>
              <p>Without personalization, knowledge doesn't stick</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Adaptive Learning Intelligence</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Smart Profiling</h3>
              <p>
                We analyze skill backgrounds, learning preferences, and performance 
                to create a unique profile for each employee.
              </p>
              <ul className="feature-list">
                <li>Visual, text, or hands-on learning styles</li>
                <li>Skill level assessment (Beginner to Advanced)</li>
                <li>Knowledge gap identification</li>
              </ul>
            </div>

            <div className="feature-card feature-highlight">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Real-Time Adaptation</h3>
              <p>
                Our adaptive engine continuously monitors performance and 
                automatically adjusts the learning path.
              </p>
              <ul className="feature-list">
                <li>Struggling? Get easier content & prerequisites</li>
                <li>Excelling? Skip ahead to advanced modules</li>
                <li>Dynamic reordering based on progress</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Performance Analytics</h3>
              <p>
                Track progress, identify strengths and weaknesses, and 
                get actionable insights for continuous improvement.
              </p>
              <ul className="feature-list">
                <li>Detailed completion metrics</li>
                <li>Score trending and predictions</li>
                <li>Skill gap recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Profile Creation</h3>
              <p>Tell us about your background, skills, and learning preferences</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">02</div>
              <h3>Path Generation</h3>
              <p>AI creates a personalized certification path tailored to you</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">03</div>
              <h3>Adaptive Learning</h3>
              <p>System adapts in real-time based on your performance</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">04</div>
              <h3>Certification</h3>
              <p>Complete your optimized path and earn your certification</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Learning?</h2>
            <p>Join thousands of employees who are learning smarter, not harder.</p>
            <button className="btn btn-primary btn-xl" onClick={() => navigate('/signup')}>
              Get Started Free <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>SKILLSTREAM</h3>
              <p>Adaptive Learning for the Modern Workforce</p>
            </div>
            <div className="footer-links">
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SkillStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
