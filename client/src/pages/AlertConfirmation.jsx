import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './AlertConfirmation.css'
import MapView from '../components/MapView'

function AlertConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hospital: initialHospital, allHospitals, emergencyType, userLocation, patientAge, notes } = location.state || {}
  const [activeHospital, setActiveHospital] = useState(initialHospital)
  const [isNavigating, setIsNavigating] = useState(false)
  const [switchFeedback, setSwitchFeedback] = useState('')

  if (!activeHospital) {
    return (
      <div className="alert-page-fallback">
        <div className="fallback-card">
          <h1>No Active Emergency Alert</h1>
          <p>Please select and report an emergency condition to initiate hospital routing.</p>
          <button onClick={() => navigate('/emergency')} className="fallback-btn">
            Report Emergency
          </button>
        </div>
      </div>
    )
  }

  const alternatives = (allHospitals || []).filter(h => h._id !== activeHospital._id)

  const getRankBadge = (h) => {
    const originalIndex = (allHospitals || []).findIndex(item => item._id === h._id)
    if (originalIndex === 0) return 'Option #1 (Primary Match)'
    if (originalIndex > 0) return `Option #${originalIndex + 1}`
    return 'Alternate Facility'
  }

  const activeIndex = (allHospitals || []).findIndex(item => item._id === activeHospital._id)
  const activeBadge = activeIndex === 0 ? 'Primary #1 Facility' : `Option #${activeIndex + 1} (Active)`

  const handleBackToHospitals = () => {
    navigate('/hospitals', {
      state: {
        hospitals: allHospitals,
        emergencyType,
        userLocation,
        recommendation: allHospitals?.[0] || activeHospital,
        patientAge,
        notes
      }
    })
  }

  const handleSwitchHospital = (newHospital) => {
    setActiveHospital(newHospital)
    setSwitchFeedback(`Route updated to ${newHospital.name}`)
    setTimeout(() => setSwitchFeedback(''), 3000)
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-top-banner">
        <div className="banner-left">
          <span className="live-alert-beacon"></span>
          <span className="banner-main-title">Emergency Dispatch Confirmed</span>
        </div>
        <div className="banner-right">
          <span className="eta-badge">ETA: {activeHospital.eta?.duration || '6 mins'}</span>
        </div>
      </div>

      <div className="confirmation-split-layout">
        <div className="confirm-left-panel">
          <div className="change-alert-bar">
            <button onClick={handleBackToHospitals} className="change-alert-action-btn">
              ← Change Hospital Alert
            </button>
          </div>

          <div className="hospital-dispatch-card">
            <div className="hospital-title-group">
              <span className="card-badge">{activeBadge}</span>
              <h1 className="dispatched-hospital-name">{activeHospital.name}</h1>
              <p className="dispatched-hospital-address">{activeHospital.address}</p>
            </div>

            <div className="essential-stats-row">
              <div className="essential-stat">
                <span className="stat-num">{activeHospital.eta?.duration || 'N/A'}</span>
                <span className="stat-lbl">Drive Time</span>
              </div>
              <div className="essential-stat">
                <span className="stat-num">{activeHospital.availableICUBeds} Beds</span>
                <span className="stat-lbl">ICU Open</span>
              </div>
            </div>

            <div className="patient-triage-pill">
              <span className="triage-label">Condition:</span>
              <span className="triage-val">
                {emergencyType?.toUpperCase()} {patientAge ? `(${patientAge} yrs)` : ''}
              </span>
            </div>

            {notes && (
              <div className="patient-notes-pill">
                <span className="notes-label">Notes:</span> {notes}
              </div>
            )}

            <div className="emergency-actions-row">
              {activeHospital.phone && (
                <a href={`tel:${activeHospital.phone}`} className="call-er-btn">
                  Call ER Desk
                </a>
              )}
              <a href="tel:108" className="call-108-btn">
                Call 108 Hotline
              </a>
            </div>
          </div>

          {switchFeedback && (
            <div className="switch-feedback-toast">
              {switchFeedback}
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="contingency-routing-section">
              <div className="contingency-header">
                <span className="contingency-title">Traffic / Alternate Options</span>
                <span className="contingency-hint">Switch route if delayed</span>
              </div>

              <div className="contingency-list">
                {alternatives.map((alt) => (
                  <div key={alt._id} className="contingency-card">
                    <div className="contingency-top">
                      <div className="contingency-info">
                        <span className="alt-tag">{getRankBadge(alt)}</span>
                        <h4 className="alt-name">{alt.name}</h4>
                        <p className="alt-address">{alt.address}</p>
                      </div>
                      <button
                        className="switch-reroute-btn"
                        onClick={() => handleSwitchHospital(alt)}
                      >
                        Switch Route
                      </button>
                    </div>

                    <div className="contingency-metrics">
                      <span><strong>ETA:</strong> {alt.eta?.duration || 'N/A'}</span>
                      <span><strong>Dist:</strong> {alt.eta?.distance || 'N/A'}</span>
                      <span><strong>ICU:</strong> {alt.availableICUBeds} Beds</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="confirm-right-panel">
          <button
            className={`smart-nav-bar ${isNavigating ? 'active' : ''}`}
            onClick={() => setIsNavigating(!isNavigating)}
          >
            <div className="smart-nav-left">
              <div className="smart-nav-icon-wrap">
                <span className={`nav-live-dot ${isNavigating ? 'active' : ''}`}></span>
              </div>
              <div className="smart-nav-text">
                <span className="smart-nav-title">
                  {isNavigating ? 'LIVE GPS ACTIVE' : 'START NAVIGATION'}
                </span>
                <span className="smart-nav-sub">
                  {isNavigating
                    ? `Tracking real-time movement to ${activeHospital.name}`
                    : `Drive route to ${activeHospital.name} · ${activeHospital.eta?.duration || '6 mins'}`}
                </span>
              </div>
            </div>
            <div className="smart-nav-btn-pill">
              {isNavigating ? 'Pause' : 'Start Navigation'}
            </div>
          </button>

          <div className="map-view-container">
            <MapView
              hospitals={[activeHospital]}
              targetHospital={activeHospital}
              userLocation={userLocation}
              mode="navigation"
              isNavigating={isNavigating}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertConfirmation
