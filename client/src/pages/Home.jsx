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
      label: 'Heart Attack',
      dest: 'Heart Hospital & ICU',
      eta: '6 Mins (Live Traffic)',
      icu: '4 Open Beds',
      spec: 'Cardiologist On Duty'
    },
    stroke: {
      label: 'Stroke / Brain',
      dest: 'Stroke Emergency Bay',
      eta: '8 Mins (Live Traffic)',
      icu: '3 Open Beds',
      spec: 'Brain Team Ready'
    },
    trauma: {
      label: 'Accident / Injury',
      dest: 'Trauma Emergency Center',
      eta: '5 Mins (Live Traffic)',
      icu: '5 Open Beds',
      spec: 'Surgeon On Duty'
    },
    burns: {
      label: 'Burn Emergency',
      dest: 'Specialized Burn Unit',
      eta: '11 Mins (Live Traffic)',
      icu: '2 Open Beds',
      spec: 'Burn Team Ready'
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
              Find the <span className="highlight-teal">right</span> hospital.<br />
              Not just the <span className="highlight-red">nearest</span> one.
            </h1>
            <p className="hero-description">
              In critical emergencies like heart attacks, stroke, or accidents, reaching the closest hospital is useless if they have no open ICU beds or the right specialist. HLERS finds you the fastest hospital with ready doctors and open beds.
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
                How It Works
              </button>
            </div>

            <div className="hero-metrics">
              <div className="metric-item">
                <span className="metric-val">&lt; 30s</span>
                <span className="metric-lbl">Decision Speed</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-item">
                <span className="metric-val">Live</span>
                <span className="metric-lbl">Bed Tracking</span>
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
                      {simData[key].label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sim-canvas slate-canvas">
                <div className="sim-grid-dots"></div>

                <div className="sim-node origin-node">
                  <div className="node-pulse"></div>
                  <div className="node-label">Your Location</div>
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
                  <span className="telem-lbl">DRIVE DURATION</span>
                  <span className="telem-val">{currentSim.eta}</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">ICU BEDS</span>
                  <span className="telem-val green">{currentSim.icu}</span>
                </div>
                <div className="telem-item">
                  <span className="telem-lbl">DOCTOR STATUS</span>
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
            <div className="section-kicker">THREE PROTECTIONS IN EVERY EMERGENCY</div>
            <h2 className="section-heading">How HLERS Finds Your Best Hospital</h2>
            <p className="section-subtext">We check three critical life-saving factors in real time before recommending any facility.</p>
          </div>

          <div className="bento-grid-layout">
            <div
              className={`bento-card featured-bento ${activeBento === 'traffic' ? 'active-focus' : ''}`}
              onClick={() => setActiveBento('traffic')}
            >
              <div className="bento-card-bg-glow glow-teal"></div>
              <div className="bento-top-row">
                <span className="bento-tag">STEP 1 · TRAFFIC NAVIGATION</span>
                <span className="bento-live-badge">Live Maps Sync</span>
              </div>

              <div className="bento-body">
                <h3 className="bento-title">Fastest Route With Live Traffic</h3>
                <p className="bento-description">
                  Calculates the quickest driving route to every nearby hospital using live Google Maps traffic so you avoid roadblocks and traffic jams.
                </p>

                <div className="bento-interactive-graphic route-graphic">
                  <div className="mini-telemetry-bar">
                    <div className="mini-telem-point">
                      <span className="dot origin"></span>
                      <span>You</span>
                    </div>
                    <div className="mini-telem-line">
                      <span className="traveling-pulse"></span>
                    </div>
                    <div className="mini-telem-point">
                      <span className="dot dest"></span>
                      <span>Hospital ER</span>
                    </div>
                  </div>
                  <div className="mini-speed-readout">
                    <span>Live Traffic Analysis: <strong>Avoids Roadblocks</strong></span>
                    <span className="latency-pill">Instant Routing</span>
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
                <span className="bento-tag">STEP 2 · BED AVAILABILITY</span>
                <span className="bento-metric-pill">Real-Time</span>
              </div>

              <div className="bento-body">
                <h3 className="bento-title">Guarantees Open ICU Beds</h3>
                <p className="bento-description">
                  Checks available intensive care beds and emergency equipment before you travel, so you never arrive at a full hospital.
                </p>

                <div className="bento-interactive-graphic icu-graphic">
                  <div className="icu-meter-header">
                    <span>Emergency ICU Capacity</span>
                    <strong className="green-text">Verified Open</strong>
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
                    <span>4 Critical Care Beds Ready</span>
                    <span>Status: <strong>Available</strong></span>
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
                <span className="bento-tag">STEP 3 · DOCTOR READINESS</span>
                <span className="bento-metric-pill">On Duty</span>
              </div>

              <div className="bento-body">
                <h3 className="bento-title">Ensures the Right Doctor Is There</h3>
                <p className="bento-description">
                  Confirms that heart doctors, brain specialists, or trauma surgeons are actively on duty and ready to treat the patient immediately.
                </p>

                <div className="bento-interactive-graphic specialist-graphic">
                  <div className="spec-badge-stack">
                    <div className="spec-item active">
                      <span className="spec-status-dot"></span>
                      <span>Heart Specialist</span>
                      <span className="spec-state">Ready</span>
                    </div>
                    <div className="spec-item active">
                      <span className="spec-status-dot"></span>
                      <span>Brain &amp; Stroke Doctor</span>
                      <span className="spec-state">Ready</span>
                    </div>
                    <div className="spec-item standby">
                      <span className="spec-status-dot standby"></span>
                      <span>Trauma Surgeon</span>
                      <span className="spec-state">On Duty</span>
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
            <div className="section-kicker">THE CRITICAL DIFFERENCE</div>
            <h2 className="section-heading">Why Regular Maps Are Not Enough in Emergencies</h2>
            <p className="section-subtext">Driving to the closest building without knowing if they have beds causes fatal delays.</p>
          </div>

          <div className="comparison-terminal-deck">
            <div className="terminal-card legacy-terminal">
              <div className="terminal-top-bar">
                <span className="terminal-status red">REGULAR MAP APPS</span>
                <span className="terminal-label">Nearest Location Only</span>
              </div>

              <div className="terminal-content">
                <h3 className="terminal-title">The "Closest Building" Problem</h3>
                <p className="terminal-summary">Regular maps guide you only by distance and know nothing about hospital readiness.</p>

                <div className="terminal-scenario-box warning">
                  <div className="scenario-row">
                    <span className="scenario-label">Driving Time:</span>
                    <span className="scenario-value">4 Mins (Closest)</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">ICU Beds:</span>
                    <span className="scenario-value red-text">0 Beds (Hospital Full)</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">Specialist:</span>
                    <span className="scenario-value red-text">Doctor Not Available</span>
                  </div>
                  <div className="scenario-outcome red">
                    Danger: Patient is turned away and must find another hospital (20+ mins lost)
                  </div>
                </div>

                <ul className="terminal-list">
                  <li>No way of checking bed capacity before you drive</li>
                  <li>No pre-alert sent to doctors before you arrive</li>
                </ul>
              </div>
            </div>

            <div className="terminal-card hlers-terminal">
              <div className="terminal-top-bar">
                <span className="terminal-status teal">HLERS EMERGENCY SYSTEM</span>
                <span className="terminal-label highlight">Ready &amp; Capable</span>
              </div>

              <div className="terminal-content">
                <h3 className="terminal-title">The "Ready &amp; Capable" Solution</h3>
                <p className="terminal-summary">Finds the fastest hospital that actually has open beds and the right doctors on duty.</p>

                <div className="terminal-scenario-box success">
                  <div className="scenario-row">
                    <span className="scenario-label">Driving Time:</span>
                    <span className="scenario-value">6 Mins (Live Traffic)</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">ICU Beds:</span>
                    <span className="scenario-value green-text">4 Open Beds Guaranteed</span>
                  </div>
                  <div className="scenario-row">
                    <span className="scenario-label">Specialist:</span>
                    <span className="scenario-value green-text">Doctor Alerted &amp; Ready</span>
                  </div>
                  <div className="scenario-outcome green">
                    Result: Immediate treatment upon arrival with zero wasted time
                  </div>
                </div>

                <ul className="terminal-list highlight">
                  <li>Direct alert sent to the emergency room desk</li>
                  <li>Turn-by-turn live navigation directly to emergency gates</li>
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
              <span className="action-kicker">INSTANT EMERGENCY ACCESS</span>
              <h2 className="action-title">Every Second Counts in a Medical Emergency</h2>
              <p className="action-subtitle">
                Select your patient's emergency condition and find the most capable hospital with open beds in under 30 seconds.
              </p>
            </div>
            <button
              className="action-launch-btn"
              onClick={() => navigate('/emergency')}
            >
              Find Best Hospital Now
            </button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-main-grid">
            <div className="footer-col brand-col">
              <div className="footer-brand-title">HLERS</div>
              <p className="footer-brand-sub">HyperLocal Emergency Routing System</p>
              <p className="footer-mission-text">
                Intelligent emergency dispatch connecting patients to capable hospitals with live ICU beds and on-duty specialists.
              </p>
              <div className="footer-system-status">
                <span className="status-dot-green"></span>
                <span>All Regional Hospital Hubs Online</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Emergency Triage</h4>
              <ul className="footer-links-list">
                <li><a href="/emergency">Heart Attack &amp; Cardiac</a></li>
                <li><a href="/emergency">Stroke &amp; Brain Care</a></li>
                <li><a href="/emergency">Severe Accidents &amp; Trauma</a></li>
                <li><a href="/emergency">Burn Care Emergency</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">How It Works</h4>
              <ul className="footer-links-list">
                <li><a href="#bento-grid">Live Traffic Routing</a></li>
                <li><a href="#bento-grid">ICU Bed Tracking</a></li>
                <li><a href="#bento-grid">Doctor Readiness</a></li>
                <li><a href="/emergency">Pre-Arrival ER Alerts</a></li>
              </ul>
            </div>

            <div className="footer-col hotlines-col">
              <h4 className="footer-heading">Emergency Hotlines</h4>
              <div className="hotline-card">
                <span className="hotline-label">National Medical Emergency</span>
                <a href="tel:108" className="hotline-number">108</a>
              </div>
              <div className="hotline-card">
                <span className="hotline-label">Police Emergency</span>
                <a href="tel:100" className="hotline-number sub">100</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p className="footer-disclaimer">
              <strong>Notice:</strong> HLERS is a decision support tool. For life-threatening emergencies needing immediate ambulance support, always call <strong>108</strong> immediately.
            </p>
            <p className="footer-copyright">© HLERS. Built for instant emergency access.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home