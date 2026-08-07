import './EmergencyForm.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { findNearbyHospitals, createEmergencyRequest } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

function EmergencyForm() {
  const navigate = useNavigate()
  const [emergencyType, setEmergencyType] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emergencyOptions = [
    { id: 'cardiac', label: 'Cardiac Emergency', desc: 'Heart attack, chest pain, cardiac arrest', icon: '🫀', protocol: 'Direct Cath-Lab & Cardiologist Sync' },
    { id: 'stroke', label: 'Stroke / Brain Emergency', desc: 'Paralysis, face drooping, speech difficulty', icon: '🧠', protocol: 'Immediate CT/MRI & Stroke Team Mobilization' },
    { id: 'trauma', label: 'Severe Trauma / Accident', desc: 'Major bleeding, fractures, vehicle crash', icon: '🩸', protocol: 'Trauma Bay & Ortho/Surgeon Standby' },
    { id: 'burns', label: 'Severe Burns', desc: 'Fire, thermal, chemical, electrical burn', icon: '🔥', protocol: 'Specialized Burn ICU Protocol' },
    { id: 'other', label: 'General Emergency', desc: 'Severe breathing distress, poisoning, acute illness', icon: '🚑', protocol: 'Rapid Acute ER Bed Allocation' }
  ]

  const selectedOpt = emergencyOptions.find(o => o.id === emergencyType)

  const detectLocation = () => {
    setLocationError('')
    setLocating(true)
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser')
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLocating(false)
      },
      () => {
        setLocationError('Please enable GPS/location permissions')
        setLocating(false)
      },
      { timeout: 10000 }
    )
  }

  const handleSubmit = async () => {
    setError('')
    if (!emergencyType) {
      setError('Please select an emergency type on the left')
      return
    }
    if (!patientAge || patientAge < 0 || patientAge > 120) {
      setError('Please enter the approximate patient age')
      return
    }
    if (!location) {
      setError('Please click "Detect My Location" before searching')
      return
    }
    setLoading(true)

    try {
      const nearbyResponse = await findNearbyHospitals({
        longitude: location.longitude,
        latitude: location.latitude,
        emergencyType
      })
      await createEmergencyRequest({
        emergencyType,
        patientAge: Number(patientAge),
        notes,
        userLocation: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        }
      })

      navigate('/hospitals', {
        state: {
          hospitals: nearbyResponse.data.data,
          emergencyType,
          userLocation: location,
          recommendation: nearbyResponse.data.recommendation,
          patientAge: Number(patientAge),
          notes
        }
      })
    } catch (err) {
      console.error(err)
      setError('Unable to fetch hospitals. Please check your network connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="emergency-web-container">
      <div className="horizontal-form-panel">
        <div className="left-triage-panel">
          <div className="step-tag">STEP 1</div>
          <h2 className="step-title">Select Emergency Condition</h2>
          <p className="step-subtitle">Click the category that matches the patient's condition:</p>

          <div className="horizontal-options-list">
            {emergencyOptions.map((opt) => (
              <div
                key={opt.id}
                className={`horizontal-option-card ${emergencyType === opt.id ? 'selected' : ''}`}
                onClick={() => setEmergencyType(opt.id)}
              >
                <span className="opt-icon">{opt.icon}</span>
                <div className="opt-text">
                  <span className="opt-title">{opt.label}</span>
                  <span className="opt-desc">{opt.desc}</span>
                </div>
                <div className="opt-radio">
                  {emergencyType === opt.id && <span className="radio-dot"></span>}
                </div>
              </div>
            ))}
          </div>

          {selectedOpt && (
            <div className="triage-protocol-banner">
              <span className="protocol-pulse"></span>
              <div className="protocol-text">
                <strong>Protocol Active:</strong> {selectedOpt.protocol}
              </div>
            </div>
          )}
        </div>

        <div className="right-dispatch-panel">
          <div className="step-tag">STEP 2 & 3</div>
          <h2 className="step-title">Patient & Location</h2>
          <p className="step-subtitle">Enter details to calculate driving ETA and bed capacity:</p>

          <div className="input-group">
            <label className="input-label">Patient Age (Years) *</label>
            <input
              type="number"
              placeholder="e.g. 45"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              min="0"
              max="120"
              className="web-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">GPS Location *</label>
            <button
              type="button"
              className={`web-location-btn ${location ? 'ready' : ''} ${locating ? 'locating' : ''}`}
              onClick={detectLocation}
              disabled={locating}
            >
              {locating ? (
                <span className="radar-sweep-text">📡 Acquiring High-Precision GPS...</span>
              ) : location ? (
                '✓ GPS Coordinates Locked'
              ) : (
                '📍 Click to Detect My Current Location'
              )}
            </button>
            {location && (
              <div className="gps-readout">
                <span>Lat: {location.latitude.toFixed(4)}</span>
                <span>Lng: {location.longitude.toFixed(4)}</span>
                <span className="gps-live-dot">● Precision Active</span>
              </div>
            )}
            {locationError && <p className="field-error">{locationError}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Optional Medical Notes</label>
            <input
              type="text"
              placeholder="e.g. diabetic, head injury, conscious..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={100}
              className="web-input"
            />
          </div>

          {error && <div className="web-error-box">{error}</div>}

          <button
            className="web-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Find & Score Best Hospitals →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyForm
