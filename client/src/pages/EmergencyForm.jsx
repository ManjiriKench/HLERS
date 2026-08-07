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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emergencyOptions = [
    { id: 'cardiac', label: 'Cardiac', desc: 'Chest pain, cardiac arrest', icon: '🫀', tag: 'CRITICAL' },
    { id: 'stroke', label: 'Stroke', desc: 'Paralysis, speech difficulty', icon: '🧠', tag: 'TIME-CRITICAL' },
    { id: 'trauma', label: 'Trauma', desc: 'Accident, severe injury', icon: '🩸', tag: 'URGENT' },
    { id: 'burns', label: 'Burns', desc: 'Fire, chemical burns', icon: '🔥', tag: 'SPECIALIZED' },
    { id: 'other', label: 'General / Other', desc: 'Acute respiratory, poison, other', icon: '🚑', tag: 'IMMEDIATE' }
  ]

  const quickSymptoms = ['Unconscious', 'Chest Pain', 'Heavy Bleeding', 'Diabetic', 'Breathing Issues', 'Head Injury']

  const agePresets = [
    { label: 'Child (5)', val: '5' },
    { label: 'Young (25)', val: '25' },
    { label: 'Adult (45)', val: '45' },
    { label: 'Senior (70)', val: '70' }
  ]

  const handleSymptomClick = (symptom) => {
    if (notes.includes(symptom)) {
      setNotes(notes.replace(symptom, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim())
    } else {
      setNotes(notes ? `${notes}, ${symptom}`.slice(0, 100) : symptom)
    }
  }

  const detectLocation = () => {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      () => {
        setLocationError('Unable to detect location. Please grant GPS access.')
      },
      { timeout: 10000 }
    )
  }

  const handleSubmit = async () => {
    setError('')
    if (!emergencyType) {
      setError('Please select an emergency category above')
      return
    }
    if (!patientAge || patientAge < 0 || patientAge > 120) {
      setError('Please enter a valid approximate age (0 - 120)')
      return
    }
    if (!location) {
      setError('Please click Detect My Location to get GPS coordinates')
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
      setError('Connection timeout. Please check your network or try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="emergency-form-page">
      <div className="form-wrapper">
        <div className="form-top-indicator">
          <div className="status-live">
            <span className="pulsing-beacon"></span>
            RAPID TRIAGE INTAKE
          </div>
          <div className="target-timer">⏱️ Target: &lt; 30 Seconds</div>
        </div>

        <div className="form-heading-block">
          <h1>What is the Medical Emergency?</h1>
          <p>Instant ML matching for real-time ICU beds, specialists, and traffic ETA.</p>
        </div>

        <div className="triage-section">
          <div className="emergency-grid">
            {emergencyOptions.map((opt) => (
              <div
                key={opt.id}
                className={`emergency-card ${emergencyType === opt.id ? 'active' : ''}`}
                onClick={() => setEmergencyType(opt.id)}
              >
                <div className="card-top">
                  <span className="card-emoji">{opt.icon}</span>
                  <span className="urgency-tag">{opt.tag}</span>
                </div>
                <div className="card-title">{opt.label}</div>
                <div className="card-desc">{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="triage-row-split">
          <div className="triage-col">
            <label className="field-title">Patient Age (Approximate) *</label>
            <div className="age-input-row">
              <input
                type="number"
                placeholder="Enter age (e.g. 45)"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                min="0"
                max="120"
                className="patient-age-field"
              />
            </div>
            <div className="quick-age-pills">
              {agePresets.map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  className={`age-preset-btn ${patientAge === preset.val ? 'selected' : ''}`}
                  onClick={() => setPatientAge(preset.val)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="triage-col">
            <label className="field-title">Quick Condition Tags (Optional)</label>
            <div className="quick-tags-wrap">
              {quickSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  className={`symptom-tag ${notes.includes(symptom) ? 'selected' : ''}`}
                  onClick={() => handleSymptomClick(symptom)}
                >
                  {notes.includes(symptom) ? `✓ ${symptom}` : `+ ${symptom}`}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Or type specific notes (e.g. high BP, head injury)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={100}
              className="notes-custom-field"
              rows={2}
            />
          </div>
        </div>

        <div className="location-verify-section">
          <div className="location-info-row">
            <div className="location-text">
              <strong>GPS Dispatch Coordinates *</strong>
              <span>
                {location
                  ? `Lat: ${location.latitude.toFixed(4)}, Long: ${location.longitude.toFixed(4)}`
                  : 'Required for real-time Google Maps traffic calculation'}
              </span>
            </div>
            <button
              type="button"
              className={`detect-gps-btn ${location ? 'acquired' : ''}`}
              onClick={detectLocation}
            >
              {location ? '✓ Location Locked' : '📍 Auto-Detect My Location'}
            </button>
          </div>
          {locationError && <div className="location-err">{locationError}</div>}
        </div>

        {error && <div className="form-error-toast">{error}</div>}

        <button
          className="dispatch-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : '🚨 Match Best Hospital Immediately →'}
        </button>
      </div>
    </div>
  )
}

export default EmergencyForm
