import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './AlertConfirmation.css'
import MapView from '../components/MapView'

function AlertConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hospital, emergencyType, userLocation, patientAge, notes } = location.state || {}
  const [isNavigating, setIsNavigating] = useState(false)

  if (!hospital) {
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


  return (
    <div className="confirmation-page">
      <div className="confirmation-top-banner">
        <div className="banner-left">
          <span className="live-alert-beacon"></span>
          <span className="banner-main-title">Emergency Dispatch Active</span>
          <span className="banner-sub-tag">Pre-Arrival Telemetry Transmitted</span>
        </div>
        <div className="banner-right">
          <span className="eta-badge">Est. Arrival: {hospital.eta?.duration || '6 mins'}</span>
        </div>
      </div>

      <div className="confirmation-split-layout">
        <div className="confirm-left-panel">
          <div className="hospital-dispatch-card">
            <div className="dispatch-header">
              <span className="detected-tag">Primary Matched Facility</span>
              <span className="er-status-badge">ER Standing By</span>
            </div>

            <h1 className="dispatched-hospital-name">{hospital.name}</h1>
            <p className="dispatched-hospital-address">📍 {hospital.address}</p>

            <div className="telemetry-stats-row">
              <div className="telemetry-stat">
                <span className="t-val">{hospital.eta?.duration || 'N/A'}</span>
                <span className="t-lbl">Drive Time</span>
              </div>
              <div className="telemetry-stat">
                <span className="t-val">{hospital.eta?.distance || 'N/A'}</span>
                <span className="t-lbl">Distance</span>
              </div>
              <div className="telemetry-stat">
                <span className="t-val green-text">{hospital.availableICUBeds} Open</span>
                <span className="t-lbl">ICU Beds</span>
              </div>
              <div className="telemetry-stat">
                <span className="t-val">{hospital.currentLoad}/10</span>
                <span className="t-lbl">Load Level</span>
              </div>
            </div>

            <div className="readiness-checklist">
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <div className="check-text">
                  <strong>Pre-Arrival Triage Notification Delivered</strong>
                  <span>Triage desk alerted for {emergencyType?.toUpperCase()} condition.</span>
                </div>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <div className="check-text">
                  <strong>Critical Care Bed Reserved</strong>
                  <span>Direct catheterization &amp; emergency bay verified.</span>
                </div>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <div className="check-text">
                  <strong>Specialist Team Ready</strong>
                  <span>On-duty medical specialists standing by for immediate intake.</span>
                </div>
              </div>
            </div>

            <div className="patient-triage-summary">
              <div className="summary-title">PATIENT SUMMARY</div>
              <div className="summary-grid">
                <div><strong>Type:</strong> {emergencyType?.toUpperCase()}</div>
                <div><strong>Age:</strong> {patientAge ? `${patientAge} Years` : 'Not specified'}</div>
                <div className="full-span"><strong>Notes:</strong> {notes || 'None provided'}</div>
              </div>
            </div>

            <div className="emergency-actions-row">
              {hospital.phone && (
                <a href={`tel:${hospital.phone}`} className="call-er-btn">
                  📞 Call ER Desk: {hospital.phone}
                </a>
              )}
              <a href="tel:108" className="call-108-btn">
                🚑 Call 108 Hotline
              </a>
            </div>
          </div>
        </div>

        <div className="confirm-right-panel">
          <div className="live-gps-hud-bar">
            <div className="hud-info">
              <span className={`hud-radar ${isNavigating ? 'active' : ''}`}></span>
              <span>{isNavigating ? 'Live Device GPS Active' : 'Route Ready to Start'}</span>
            </div>
            <div className="hud-btns-group">
              <button
                className={`start-nav-btn ${isNavigating ? 'active' : ''}`}
                onClick={() => setIsNavigating(!isNavigating)}
              >
                {isNavigating ? '⏸ Pause GPS' : '🚀 Start Live Navigation'}
              </button>
            </div>
          </div>

          <MapView
            hospitals={[hospital]}
            targetHospital={hospital}
            userLocation={userLocation}
            mode="navigation"
            isNavigating={isNavigating}
          />
        </div>
      </div>
    </div>
  )
}

export default AlertConfirmation
