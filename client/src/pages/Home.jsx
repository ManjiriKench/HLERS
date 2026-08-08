import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [activeSim, setActiveSim] = useState('cardiac')
  const [activeBento, setActiveBento] = useState('traffic')

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const simData = {
    cardiac: {
      label: 'Cardiac Emergency',
      dest: 'Cath Lab & Cardiac ICU',
      eta: '6.4 Mins',
      icu: '4 Beds Open',
      spec: 'Cardiologist On Duty',
      code: 'STEMI PROTOCOL'
    },
    stroke: {
      label: 'Acute Stroke',
      dest: 'Comprehensive Stroke Bay',
      eta: '8.2 Mins',
      icu: '3 Beds Open',
      spec: 'Neuro Team Ready',
      code: 'THROMBOLYSIS READY'
    },
    trauma: {
      label: 'Severe Trauma',
      dest: 'Level 1 Trauma Bay',
      eta: '5.8 Mins',
      icu: '5 Beds Open',
      spec: 'Trauma Surgeon Active',
      code: 'RED ALERT TRAUMA'
    },
    burns: {
      label: 'Burn Emergency',
      dest: 'Specialized Burn Unit',
      eta: '11.0 Mins',
      icu: '2 Beds Open',
      spec: 'Burn ICU Team Ready',
      code: 'CRITICAL CARE'
    }
  }

  const currentSim = simData[activeSim] || simData.cardiac

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-grid-ambient"></div>
        <div className="hero-glow-orb orb-1"></div>
        <div className="hero-glow-orb orb-2"></div>

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
                onClick={() => scrollToSection('bento-grid')}
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
            <div className="simulation-card slate-theme">
              <div className="sim-header">
                <div className="sim-header-left">
                  <span className="sim-radar-dot"></span>
                  <span className="sim-header-title">LIVE ROUTING SIMULATION</span>
                </div>
                <div className="sim-tabs-group">
                  {Object.keys(simData).map((key) => (
                    <button
                      key={key}
                      className={`sim-tab-pill ${activeSim === key ? 'active' : ''}`}
                      onClick={() => setActiveSim(key)}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sim-canvas slate-canvas">
                <div className="sim-grid-dots"></div>

                <div className="sim-node origin-node">
                  <div className="node-pulse"></div>
                  <div className="node-label">Emergency GPS</div>
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
                  <div className="node-label">{currentSim.dest}</div>
                </div>
              </div>

              <div className="sim-telemetry slate-telemetry">
                <div className="telem-item">
                  <span className="telem-lbl">EST. DRIVE TIME</span>
                  <span className="telem-val">{currentSim.eta}</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">ICU CAPACITY</span>
                  <span className="telem-val green">{currentSim.icu}</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">SPECIALIST STATUS</span>
                  <span className="telem-val green">{currentSim.spec}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="bento-grid" className="bento-showcase-section">
        <div className="section-container">
          <div className="section-header-compact">
            <div className="section-kicker">INTELLIGENCE PLATFORM</div>
            <h2 className="section-heading">Engineered for Zero-Delay Emergency Decisions</h2>
            <p className="section-subtext">Three synchronized clinical telemetry streams converge into an instantaneous survival score.</p>
          </div>

          <div className="bento-grid-layout">
            <div
              className={`bento-card featured-bento ${activeBento === 'traffic' ? 'active-focus' : ''}`}
              onClick={() => setActiveBento('traffic')}
            >
              <div className="bento-card-bg-glow glow-teal"></div>
              <div className="bento-top-row">
                <span className="bento-tag">LAYER 01 · ROUTING DYNAMICS</span>
                <span className="bento-live-badge">Live API Sync</span>
              </div>

              <div className="bento-body">
                <h3 className="bento-title">Google Maps Traffic Engine</h3>
                <p className="bento-description">
                  Sub-second traffic matrix calculations project exact real-time driving duration to every emergency room in the metropolitan grid, accounting for live congestion spikes and roadblock deviations.
                </p>

                <div className="bento-interactive-graphic route-graphic">
                  <div className="mini-telemetry-bar">
                    <div className="mini-telem-point">
                      <span className="dot origin"></span>
                      <span>User Origin</span>
                    </div>
                    <div className="mini-telem-line">
                      <span className="traveling-pulse"></span>
                    </div>
                    <div className="mini-telem-point">
                      <span className="dot dest"></span>
                      <span>Target Hospital ER</span>
                    </div>
                  </div>
                  <div className="mini-speed-readout">
                    <span>Peak Optimization: <strong>Dynamic Isochrone Polylines</strong></span>
                    <span className="latency-pill">Latency &lt; 140ms</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`bento-card ${activeBento === 'icu' ? 'active-focus' : ''}`}
              onClick={() => setActiveBento('icu')}
            >
              <div className="bento-card-bg-glow glow-green"></div>
              <div className="bento-top-row">
                <span className="bento-tag">LAYER 02 · CAPACITY</span>
                <span className="bento-metric-pill">Real-Time</span>
              </div>

              <div className="bento-body">
                <h3 className="bento-title">Critical Care Bed Telemetry</h3>
                <p className="bento-description">
                  Monitors live emergency ICU bed availability, operational mechanical ventilators, and active catheterization bay readiness to prevent dead-end arrivals.
                </p>

                <div className="bento-interactive-graphic icu-graphic">
                  <div className="icu-meter-header">
                    <span>Emergency ICU Availability</span>
                    <strong className="green-text">Live Verified</strong>
                  </div>
                  <div className="segmented-capacity-bar">
                    <div className="cap-segment filled"></div>
                    <div className="cap-segment filled"></div>
                    <div className="cap-segment filled"></div>
                    <div className="cap-segment filled"></div>
                    <div className="cap-segment empty"></div>
                    <div className="cap-segment empty"></div>
                  </div>
                  <div className="meter-footer">
                    <span>4 Critical Bays Standing By</span>
                    <span>Load Index: <strong>3.2/10</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`bento-card ${activeBento === 'specialists' ? 'active-focus' : ''}`}
              onClick={() => setActiveBento('specialists')}
            >
              <div className="bento-card-bg-glow glow-blue"></div>
              <div className="bento-top-row">
                <span className="bento-tag">LAYER 03 · CLINICAL TRIAGE</span>
                <span className="bento-metric-pill">On Duty</span>
              </div>

              <div className="bento-body">
                <h3 className="bento-title">Specialist Roster Matching</h3>
                <p className="bento-description">
                  Synchronizes patient emergency condition with verified on-duty specialists across Cardiology, Neurology, Orthopedic Trauma, and Burn Critical Care.
                </p>

                <div className="bento-interactive-graphic specialist-graphic">
                  <div className="spec-badge-stack">
                    <div className="spec-item active">
                      <span className="spec-status-dot"></span>
                      <span>Interventional Cardiologist</span>
                      <span className="spec-state">Active</span>
                    </div>
                    <div className="spec-item active">
                      <span className="spec-status-dot"></span>
                      <span>Neuro-Trauma Surgeon</span>
                      <span className="spec-state">Active</span>
                    </div>
                    <div className="spec-item standby">
                      <span className="spec-status-dot standby"></span>
                      <span>Burn Critical Unit</span>
                      <span className="spec-state">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="terminal-comparison-section">
        <div className="section-container">
          <div className="section-header-compact">
            <div className="section-kicker">DECISION PARADIGM</div>
            <h2 className="section-heading">Why Distance Is The Wrong Metric In Emergencies</h2>
            <p className="section-subtext">Navigating to the nearest hospital without confirmed capacity leads to fatal secondary transfers.</p>
          </div>

          <div className="comparison-terminal-deck">
            <div className="terminal-card legacy-terminal">
              <div className="terminal-top-bar">
                <span className="terminal-status red">STANDARD NAVIGATION</span>
                <span className="terminal-label">Traditional Maps</span>
              </div>

              <div className="terminal-content">
                <h3 className="terminal-title">The "Nearest" Trap</h3>
                <p className="terminal-summary">Routes strictly by geographic proximity, blind to emergency capabilities.</p>

                <div className="terminal-scenario-box warning">
                  <div className="scenario-row">
                    <span className="scenario-label">Travel Time:</span>
                    <span className="scenario-value">4.2 Mins (Nearest)</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">ICU Beds:</span>
                    <span className="scenario-value red-text">0 Available (Full)</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">Specialist:</span>
                    <span className="scenario-value red-text">Not On Duty</span>
                  </div>
                  <div className="scenario-outcome red">
                    Outcome: Secondary transfer required (+22 mins critical delay)
                  </div>
                </div>

                <ul className="terminal-list">
                  <li>No hospital triage notification before arrival</li>
                  <li>Ignores emergency bay overcrowding &amp; wait queues</li>
                </ul>
              </div>
            </div>

            <div className="terminal-card hlers-terminal">
              <div className="terminal-top-bar">
                <span className="terminal-status teal">HLERS INTELLIGENCE</span>
                <span className="terminal-label highlight">Survival Optimization</span>
              </div>

              <div className="terminal-content">
                <h3 className="terminal-title">The "Capable" Destination</h3>
                <p className="terminal-summary">Calculates clinical readiness, live traffic, and bed availability simultaneously.</p>

                <div className="terminal-scenario-box success">
                  <div className="scenario-row">
                    <span className="scenario-label">Travel Time:</span>
                    <span className="scenario-value">6.4 Mins (+2 mins driving)</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">ICU Beds:</span>
                    <span className="scenario-value green-text">4 Verified Available</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">Specialist:</span>
                    <span className="scenario-value green-text">Cardiologist Standing By</span>
                  </div>
                  <div className="scenario-outcome green">
                    Outcome: Direct Cath-Lab intake upon arrival (0 minutes lost)
                  </div>
                </div>

                <ul className="terminal-list highlight">
                  <li>Pre-arrival triage alert dispatched directly to ER desk</li>
                  <li>Live in-app GPS driving guidance with turn HUD</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="action-banner-section">
        <div className="section-container">
          <div className="action-banner-card">
            <div className="action-banner-glow"></div>
            <div className="action-banner-content">
              <span className="action-kicker">INSTANT ACCESS PROTOCOL</span>
              <h2 className="action-title">Seconds Save Lives. Begin Emergency Triage.</h2>
              <p className="action-subtitle">
                Access immediate hospital recommendations scored specifically for your patient's emergency condition.
              </p>
            </div>
            <button
              className="action-launch-btn"
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