import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { sendAlert } from '../services/api'
import MapView from '../components/MapView'

function HospitalList() {
  const location = useLocation()
  const navigate = useNavigate()
  const { hospitals, emergencyType, userLocation } = location.state || {}
  const [alertSent, setAlertSent] = useState({})
  const [alertError, setAlertError] = useState('')

  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="list-container">
        <div className="no-results">
          <h1>No hospitals found</h1>
          <p>No hospitals available for this emergency type in your area.</p>
          <button onClick={() => navigate('/emergency')} className="back-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const handleAlert = async (hospital) => {
    try {
      await sendAlert({
        hospitalId: hospital._id,
        emergencyType,
        patientAge: 0,
        notes: ''
      })
      setAlertSent((prev) => ({ ...prev, [hospital._id]: true }))
    } catch {
      setAlertError('Failed to send alert. Please try again.')
    }
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <button onClick={() => navigate('/emergency')} className="back-btn">
          Back
        </button>
        <h1>Nearby Hospitals</h1>
        <p className="emergency-badge">{emergencyType?.toUpperCase()}</p>
      </div>

      {alertError && <p className="error-text">{alertError}</p>}

      <div className="map-wrapper">
        <MapView
          hospitals={hospitals}
          userLocation={userLocation}
        />
      </div>

      <div className="hospital-list">
        {hospitals.map((hospital, index) => (
          <div key={hospital._id} className="hospital-card">
            <div className="card-header">
              <span className="rank">#{index + 1}</span>
              <div className="card-title">
                <h2>{hospital.name}</h2>
                <p className="address">{hospital.address}</p>
              </div>
              <span className={`status-badge ${hospital.emergencyDeptOpen ? 'open' : 'closed'}`}>
                {hospital.emergencyDeptOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>

            <div className="card-stats">
              <div className="stat">
                <span className="stat-value">{hospital.eta?.duration || 'N/A'}</span>
                <span className="stat-label">ETA</span>
              </div>
              <div className="stat">
                <span className="stat-value">{hospital.eta?.distance || 'N/A'}</span>
                <span className="stat-label">Distance</span>
              </div>
              <div className="stat">
                <span className={`stat-value ${hospital.availableICUBeds === 0 ? 'red' : 'green'}`}>
                  {hospital.availableICUBeds}/{hospital.totalICUBeds}
                </span>
                <span className="stat-label">ICU Beds</span>
              </div>
              <div className="stat">
                <span className={`stat-value ${hospital.currentLoad >= 8 ? 'red' : hospital.currentLoad >= 5 ? 'orange' : 'green'}`}>
                  {hospital.currentLoad}/10
                </span>
                <span className="stat-label">Load</span>
              </div>
            </div>

            {hospital.specialists && hospital.specialists.length > 0 && (
              <div className="specialists">
                <p className="specialists-label">Specialists:</p>
                <div className="specialist-list">
                  {hospital.specialists.map((spec) => (
                    <span
                      key={spec._id}
                      className={`specialist-tag ${spec.available ? 'available' : 'unavailable'}`}
                    >
                      {spec.type} {spec.available ? '✓' : '✗'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              className={`alert-btn ${alertSent[hospital._id] ? 'sent' : ''}`}
              onClick={() => handleAlert(hospital)}
              disabled={alertSent[hospital._id]}
            >
              {alertSent[hospital._id] ? 'Alert Sent' : 'Alert This Hospital'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HospitalList