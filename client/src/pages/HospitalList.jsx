import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { sendAlert } from '../services/api'
import './HospitalList.css'
import MapView from '../components/MapView'

function HospitalList() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hospitals, emergencyType, userLocation, recommendation, patientAge, notes } = location.state || {}
  const [alertError, setAlertError] = useState('')
  const [dispatchingHospital, setDispatchingHospital] = useState(null)
  const [dispatchStep, setDispatchStep] = useState(1)

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
      setDispatchingHospital(hospital)
      setDispatchStep(1)

      const timer1 = setTimeout(() => setDispatchStep(2), 700)
      const timer2 = setTimeout(() => setDispatchStep(3), 1400)

      await sendAlert({
        hospitalId: hospital._id,
        emergencyType: emergencyType || 'general',
        patientAge: Number(patientAge) || 30,
        notes: notes || ''
      })

      setTimeout(() => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        navigate('/alert-confirmation', {
          state: {
            hospital,
            emergencyType,
            userLocation,
            patientAge: Number(patientAge) || 30,
            notes
          }
        })
      }, 2100)
    } catch (err) {
      console.error(err)
      setDispatchingHospital(null)
      setAlertError('Failed to dispatch alert. Please call emergency services directly.')
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
                className="hero-alert-btn"
                onClick={() => handleAlert(primaryHospital)}
                disabled={!!dispatchingHospital}
              >
                🔔 Alert Emergency Dept Now
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
                      className="sec-alert-btn"
                      onClick={() => handleAlert(hospital)}
                      disabled={!!dispatchingHospital}
                    >
                      Alert Hospital
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

      {dispatchingHospital && (
        <div className="dispatch-loader-backdrop">
          <div className="dispatch-loader-modal">
            <div className="radar-spinner">
              <div className="radar-core"></div>
              <div className="radar-wave wave-1"></div>
              <div className="radar-wave wave-2"></div>
            </div>

            <h2 className="dispatch-title">Transmitting Emergency Telemetry</h2>
            <p className="dispatch-target">Target Facility: <strong>{dispatchingHospital.name}</strong></p>

            <div className="dispatch-stepper">
              <div className={`step-row ${dispatchStep >= 1 ? 'done' : ''}`}>
                <span className="step-dot"></span>
                <span>Broadcasting patient condition &amp; GPS coordinates</span>
              </div>
              <div className={`step-row ${dispatchStep >= 2 ? 'done' : ''}`}>
                <span className="step-dot"></span>
                <span>Securing ICU bed &amp; specialist triage readiness</span>
              </div>
              <div className={`step-row ${dispatchStep >= 3 ? 'done' : ''}`}>
                <span className="step-dot"></span>
                <span>Locking live GPS driving route...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalList