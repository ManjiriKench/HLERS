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
        <div className="hero-grid-layout">
          <div className="hero-text-column">
            <div className="hero-badge">
              <span className="live-pulse"></span>
              Real-Time Emergency Decision Engine
            </div>
            <h1 className="hero-title">
              The <span className="highlight-teal">right</span> hospital.<br />
              Not just the <span className="highlight-red">nearest</span> one.
            </h1>
            <p className="hero-description">
              In critical conditions, saving 5 minutes at a facility without an available ICU bed or on-duty specialist is fatal. HLERS factors live traffic, specialist readiness, and bed capacity for instant routing.
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
                Explore Technology ↓
              </button>
            </div>

            <div className="hero-metrics">
              <div className="metric-item">
                <span className="metric-val">&lt; 30s</span>
                <span className="metric-lbl">Triage Time</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-val">Live</span>
                <span className="metric-lbl">ICU Sync</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">Traffic-Aware</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-column">
            <div className="simulation-card">
              <div className="sim-header">
                <div className="sim-header-left">
                  <span className="sim-radar-dot"></span>
                  <span className="sim-header-title">LIVE ROUTING SIMULATION</span>
                </div>
                <span className="sim-tag">ML OPTIMIZED</span>
              </div>

              <div className="sim-canvas">
                <div className="sim-grid-dots"></div>

                <div className="sim-node origin-node">
                  <div className="node-pulse"></div>
                  <div className="node-icon">📍</div>
                  <div className="node-label">Emergency Call (GPS)</div>
                </div>

                <svg className="sim-route-svg" viewBox="0 0 400 220" preserveAspectRatio="none">
                  <path
                    className="route-path-background"
                    d="M 60,60 C 140,60 160,160 250,160 C 300,160 320,80 340,80"
                  />
                  <path
                    className="route-path-animated"
                    d="M 60,60 C 140,60 160,160 250,160 C 300,160 320,80 340,80"
                  />
                </svg>

                <div className="ambulance-tracker">
                  <div className="ambulance-beacon"></div>
                  <div className="ambulance-icon-box">🚑</div>
                </div>

                <div className="sim-node destination-node">
                  <div className="dest-glow"></div>
                  <div className="node-icon">🏥</div>
                  <div className="node-label">Scored ER Hospital</div>
                </div>
              </div>

              <div className="sim-telemetry">
                <div className="telem-item">
                  <span className="telem-lbl">ETA ROUTE</span>
                  <span className="telem-val">6.4 Mins</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">ICU BEDS</span>
                  <span className="telem-val green">4 Available</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">CARDIAC SPEC.</span>
                  <span className="telem-val green">On Duty ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="live-ticker-bar">
        <div className="ticker-track">
          <span className="ticker-badge">LIVE NETWORK STATUS</span>
          <span className="ticker-item">🟢 Poona Hospital · ICU: 3 Beds Open</span>
          <span className="ticker-item">🟢 Ruby Hall Clinic · Trauma Specialist: On Duty</span>
          <span className="ticker-item">🟢 Jehangir Hospital · Stroke Team: Active</span>
          <span className="ticker-item">🟢 Sahyadri Hospital · ICU: 5 Beds Open</span>
          <span className="ticker-item">🟢 KEM Hospital · Cardiac Cath Lab: Ready</span>
          <span className="ticker-item">🟢 Poona Hospital · ICU: 3 Beds Open</span>
        </div>
      </div>

      <section id="how-it-works" className="info-section">
        <div className="section-container">
          <div className="section-header">
            <div className="pulse-ecg-badge">
              <svg className="ecg-svg" viewBox="0 0 100 24">
                <polyline points="0,12 30,12 36,4 42,20 48,12 54,12 60,6 66,18 72,12 100,12" />
              </svg>
              <span>REAL-TIME SCORING PIPELINE</span>
            </div>
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
                <li>❌ Doesn't verify if required specialist is on duty</li>
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