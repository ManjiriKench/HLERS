import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="live-pulse"></span>
            Real-Time Medical Decision Support Engine
          </div>
          <h1 className="hero-title">
            The <span className="highlight-teal">right</span> hospital.<br />
            Not just the <span className="highlight-red">nearest</span> one.
          </h1>
          <p className="hero-description">
            In a critical medical emergency, taking 5 extra minutes to reach a hospital with an open ICU bed and an on-duty specialist saves lives. HLERS calculates real-time driving ETA, specialist availability, and ICU bed counts to recommend the optimal emergency facility instantly.
          </p>
          <div className="hero-cta-group">
            <button
              className="primary-emergency-btn"
              onClick={() => navigate('/emergency')}
            >
              <span className="btn-icon">🚨</span> Report Emergency Now
            </button>
            <button
              className="secondary-info-btn"
              onClick={() => scrollToSection('how-it-works')}
            >
              Learn How It Works ↓
            </button>
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-val">30s</span>
              <span className="metric-lbl">Emergency Triage</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-val">Live</span>
              <span className="metric-lbl">ICU Bed Tracking</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-val">100%</span>
              <span className="metric-lbl">Traffic-Aware Routes</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="info-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle">Intelligent System</span>
            <h2 className="section-title">How HLERS Works in 3 Simple Steps</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">📋</div>
              <h3>Select Emergency</h3>
              <p>Choose the medical condition (Cardiac, Trauma, Stroke, Burns) and confirm your location via GPS.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">🧠</div>
              <h3>ML Algorithmic Scoring</h3>
              <p>HLERS ranks facilities based on live Google Maps traffic ETA, ICU capacity, specialist readiness, and ER load.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">🔔</div>
              <h3>Navigate & Alert ER</h3>
              <p>Get real-time map guidance and dispatch a pre-arrival notification directly to the hospital triage desk.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle">Why HLERS?</span>
            <h2 className="section-title">Standard Navigation vs. HLERS Emergency Routing</h2>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card legacy">
              <div className="comp-tag">Standard Map Apps</div>
              <h3>Nearest Location Only</h3>
              <ul>
                <li>❌ May direct you to a hospital with zero available ICU beds</li>
                <li>❌ Doesn't verify if required specialist (e.g. Cardiologist) is on duty</li>
                <li>❌ Ignores emergency room overload & wait times</li>
                <li>❌ No pre-arrival notification to emergency department</li>
              </ul>
            </div>
            <div className="comparison-card hlers-highlight">
              <div className="comp-tag hlers">HLERS Emergency Engine</div>
              <h3>Capable Location Recommendation</h3>
              <ul>
                <li>✓ Verifies live available ICU critical care beds</li>
                <li>✓ Confirms specialist availability for your exact condition</li>
                <li>✓ Factored live Google Maps traffic & driving duration</li>
                <li>✓ Direct pre-arrival dispatch alert to the hospital desk</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">HLERS</span>
            <p>HyperLocal Emergency Routing System</p>
          </div>
          <div className="footer-right">
            <p className="disclaimer-text">
              HLERS is an emergency decision support system. For life-threatening emergencies requiring immediate ambulance transport, call <strong>108</strong> (India) immediately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home