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
                Report Emergency Now
              </button>
              <button
                className="secondary-info-btn"
                onClick={() => scrollToSection('capabilities')}
              >
                Explore Technology
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
            <div className="simulation-card dark-theme">
              <div className="sim-header">
                <div className="sim-header-left">
                  <span className="sim-radar-dot"></span>
                  <span className="sim-header-title">LIVE ROUTING SIMULATION</span>
                </div>
                <span className="sim-tag">ML OPTIMIZED</span>
              </div>

              <div className="sim-canvas dark-canvas">
                <div className="sim-grid-dots"></div>

                <div className="sim-node origin-node">
                  <div className="node-pulse"></div>
                  <div className="node-label">Emergency Location</div>
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
                </div>

                <div className="sim-node destination-node">
                  <div className="dest-glow"></div>
                  <div className="node-label">Scored ER Facility</div>
                </div>
              </div>

              <div className="sim-telemetry dark-telemetry">
                <div className="telem-item">
                  <span className="telem-lbl">DRIVE DURATION</span>
                  <span className="telem-val">6.4 Mins</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">ICU CAPACITY</span>
                  <span className="telem-val green">Available</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">SPECIALIST TEAM</span>
                  <span className="telem-val green">On Duty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="capabilities-section">
        <div className="section-container">
          <div className="section-header-compact">
            <div className="section-kicker">ENGINE CAPABILITIES</div>
            <h2 className="section-heading">Built for High-Stakes Emergency Triage</h2>
            <p className="section-subtext">Three synchronized intelligence layers eliminate critical delays during medical emergencies.</p>
          </div>

          <div className="capabilities-cards-grid">
            <div className="capability-card">
              <div className="cap-indicator cap-traffic"></div>
              <h3 className="cap-title">Live Traffic Navigation</h3>
              <p className="cap-desc">Continuous Google Maps traffic calculations compute accurate driving durations to every regional emergency bay.</p>
            </div>

            <div className="capability-card">
              <div className="cap-indicator cap-icu"></div>
              <h3 className="cap-title">Real-Time ICU Sync</h3>
              <p className="cap-desc">Direct facility integration monitors live intensive care bed availability and emergency ventilator capacity.</p>
            </div>

            <div className="capability-card">
              <div className="cap-indicator cap-specialist"></div>
              <h3 className="cap-title">Specialist Matching</h3>
              <p className="cap-desc">Evaluates patient condition to match catheterization labs, stroke neurologists, trauma surgeons, and burn units.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison-section">
        <div className="section-container">
          <div className="section-header-compact">
            <div className="section-kicker">THE CRITICAL DIFFERENCE</div>
            <h2 className="section-heading">Nearest Facility vs. Capable Facility</h2>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card legacy">
              <div className="comp-tag">Standard Map Apps</div>
              <h3>Nearest Distance Only</h3>
              <ul>
                <li>Routes to facilities without verifying ICU bed availability</li>
                <li>No verification of condition-specific specialists on duty</li>
                <li>Ignores emergency room overload and triage wait times</li>
                <li>Zero pre-arrival communication with the emergency department</li>
              </ul>
            </div>
            <div className="comparison-card hlers-highlight">
              <div className="comp-tag hlers">HLERS Intelligence</div>
              <h3>Capable Location Optimization</h3>
              <ul>
                <li>Verifies live available ICU critical care beds</li>
                <li>Confirms specialist readiness for the patient's exact condition</li>
                <li>Factors live driving traffic and road travel duration</li>
                <li>Transmits direct pre-arrival alerts to the emergency desk</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pre-footer-cta-section">
        <div className="section-container">
          <div className="pre-footer-cta-box">
            <div className="cta-box-left">
              <h2 className="cta-box-title">Every Second Counts in a Medical Emergency</h2>
              <p className="cta-box-sub">Begin rapid triage to locate the most capable hospital with open ICU beds right now.</p>
            </div>
            <button
              className="cta-box-btn"
              onClick={() => navigate('/emergency')}
            >
              Start Emergency Triage
            </button>
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