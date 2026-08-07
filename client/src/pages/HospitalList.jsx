import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { sendAlert } from '../services/api'
import './HospitalList.css'
import MapView from '../components/MapView'

function HospitalList() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hospitals, emergencyType, userLocation, recommendation, patientAge, notes } = location.state || {}
  const [alertSent, setAlertSent] = useState({})
  const [alertError, setAlertError] = useState('')
  const [alertModalHospital, setAlertModalHospital] = useState(null)

  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="results-wrapper empty-layout">
        <div className="no-results-card">
          <div className="no-results-icon">⚠️</div>
          <h1>No Available Hospitals Found</h1>
          <p>We couldn't find matching emergency facilities for <strong>{emergencyType || 'this condition'}</strong> nearby.</p>
          <button onClick={() => navigate('/emergency')} className="primary-action-btn">
            ← Edit Emergency Details
          </button>
        </div>
      </div>
    )
  }

  const primaryHospital = recommendation || hospitals[0]
  const otherHospitals = hospitals.filter(h => h._id !== primaryHospital._id)

  const handleAlert = async (hospital) => {
    try {
      setAlertError('')
      await sendAlert({
        hospitalId: hospital._id,
        emergencyType: emergencyType || 'general',
        patientAge: Number(patientAge) || 30,
        notes: notes || ''
      })
      setAlertSent((prev) => ({ ...prev, [hospital._id]: true }))
      setAlertModalHospital(hospital)
    } catch (err) {
      console.error(err)
      setAlertError('Failed to send alert. Please call emergency services directly.')
    }
  }

  return (
    <div className="results-wrapper">
      <div className="split-layout">
        <div className="left-scroll-panel">
          <div className="results-top-bar">
            <button onClick={() => navigate('/emergency')} className="back-link">
              ← Re-triage Emergency
            </button>
            <div className="badge-group">
              <span className="live-status-pill">● Live Dispatch Ready</span>
              <span className="emergency-type-badge">
                {emergencyType?.toUpperCase() || 'EMERGENCY'}
              </span>
            </div>
          </div>

          {alertError && <div className="alert-error-banner">{alertError}</div>}

          <div className="hero-hospital-section">
            <div className="hero-rec-card">
              <div className="hero-badge-row">
                <span className="top-choice-tag">⭐ #1 BEST MATCHED HOSPITAL</span>
                {primaryHospital.hlers_score && (
                  <span className="ml-score-pill">ML Match Score: {primaryHospital.hlers_score}</span>
                )}
              </div>

              <h1 className="hero-hospital-title">{primaryHospital.name}</h1>
              <p className="hero-hospital-address">📍 {primaryHospital.address}</p>

              <div className="hero-stats-grid">
                <div className="hero-stat-box highlight">
                  <span className="stat-value">{primaryHospital.eta?.duration || 'N/A'}</span>
                  <span className="stat-label">Driving ETA</span>
                </div>
                <div className="hero-stat-box">
                  <span className="stat-value">{primaryHospital.eta?.distance || 'N/A'}</span>
                  <span className="stat-label">Distance</span>
                </div>
                <div className="hero-stat-box">
                  <span className={`stat-value ${primaryHospital.availableICUBeds === 0 ? 'red-text' : 'green-text'}`}>
                    {primaryHospital.availableICUBeds}/{primaryHospital.totalICUBeds}
                  </span>
                  <span className="stat-label">ICU Beds</span>
                </div>
                <div className="hero-stat-box">
                  <span className="stat-value">{primaryHospital.currentLoad}/10</span>
                  <span className="stat-label">Load Level</span>
                </div>
              </div>

              {primaryHospital.specialists && primaryHospital.specialists.length > 0 && (
                <div className="hero-specialists-group">
                  <span className="hero-spec-label">Verified Specialists On Duty:</span>
                  <div className="hero-spec-tags">
                    {primaryHospital.specialists.map((spec) => (
                      <span
                        key={spec._id || spec.name}
                        className={`spec-pill ${spec.available ? 'active' : 'inactive'}`}
                      >
                        {spec.type} {spec.available ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className={`hero-alert-btn ${alertSent[primaryHospital._id] ? 'dispatched' : ''}`}
                onClick={() => handleAlert(primaryHospital)}
                disabled={alertSent[primaryHospital._id]}
              >
                {alertSent[primaryHospital._id] ? '✓ Hospital Desk Alerted' : '🔔 Alert Emergency Dept Now'}
              </button>
            </div>
          </div>

          {otherHospitals.length > 0 && (
            <div className="other-hospitals-section">
              <h2 className="other-section-title">Other Nearby Facilities ({otherHospitals.length})</h2>
              <div className="other-hospitals-list">
                {otherHospitals.map((hospital, idx) => (
                  <div key={hospital._id} className="secondary-hospital-card">
                    <div className="sec-card-header">
                      <span className="sec-rank-badge">Rank #{idx + 2}</span>
                      <h3 className="sec-hospital-title">{hospital.name}</h3>
                    </div>
                    <p className="sec-hospital-address">📍 {hospital.address}</p>

                    <div className="sec-stats-row">
                      <span><strong>ETA:</strong> {hospital.eta?.duration || 'N/A'}</span>
                      <span><strong>Dist:</strong> {hospital.eta?.distance || 'N/A'}</span>
                      <span><strong>ICU:</strong> {hospital.availableICUBeds}/{hospital.totalICUBeds}</span>
                    </div>

                    <button
                      className={`sec-alert-btn ${alertSent[hospital._id] ? 'dispatched' : ''}`}
                      onClick={() => handleAlert(hospital)}
                      disabled={alertSent[hospital._id]}
                    >
                      {alertSent[hospital._id] ? '✓ Alert Sent' : 'Alert Hospital'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="right-map-panel">
          <div className="map-layer-badge">
            <span className="map-radar-pulse"></span>
            Live Google Maps Traffic &amp; Route Layer
          </div>
          <MapView hospitals={hospitals} userLocation={userLocation} />
        </div>
      </div>

      {alertModalHospital && (
        <div className="modal-backdrop" onClick={() => setAlertModalHospital(null)}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🚨</div>
            <h2>Emergency Alert Dispatched</h2>
            <p>
              Pre-arrival notification sent directly to emergency triage at <strong>{alertModalHospital.name}</strong>.
            </p>
            <div className="modal-info-box">
              <div><strong>Hospital:</strong> {alertModalHospital.name}</div>
              <div><strong>Estimated Drive Time:</strong> {alertModalHospital.eta?.duration || 'N/A'}</div>
              <div><strong>ER Desk Contact:</strong> {alertModalHospital.phone || '108 Direct'}</div>
            </div>
            <button className="modal-confirm-btn" onClick={() => setAlertModalHospital(null)}>
              Proceed to Navigation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalList