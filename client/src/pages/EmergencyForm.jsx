import './EmergencyForm.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { findNearbyHospitals, createEmergencyRequest } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

function EmergencyForm() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [emergencyType, setEmergencyType] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emergencyOptions = [
    { id: 'cardiac', labelKey: 'emergencyForm.condCardiacTitle', descKey: 'emergencyForm.condCardiacDesc', icon: '🫀', protocol: 'Direct Cath-Lab & Cardiologist Sync' },
    { id: 'stroke', labelKey: 'emergencyForm.condStrokeTitle', descKey: 'emergencyForm.condStrokeDesc', icon: '🧠', protocol: 'Immediate CT/MRI & Stroke Team Mobilization' },
    { id: 'trauma', labelKey: 'emergencyForm.condTraumaTitle', descKey: 'emergencyForm.condTraumaDesc', icon: '🩸', protocol: 'Trauma Bay & Ortho/Surgeon Standby' },
    { id: 'burns', labelKey: 'emergencyForm.condBurnsTitle', descKey: 'emergencyForm.condBurnsDesc', icon: '🔥', protocol: 'Specialized Burn ICU Protocol' },
    { id: 'other', labelKey: 'emergencyForm.condGeneralTitle', descKey: 'emergencyForm.condGeneralDesc', icon: '🚑', protocol: 'Rapid Acute ER Bed Allocation' }
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
          <div className="triage-panel-header">
            <button onClick={() => navigate('/')} className="form-back-link">
              ← Home
            </button>
            <div className="step-tag">STEP 1</div>
          </div>
          <h2 className="step-title">{t('emergencyForm.step1Title')}</h2>
          <p className="step-subtitle">{t('emergencyForm.headerSub')}</p>

          <div className="horizontal-options-list">
            {emergencyOptions.map((opt) => (
              <div
                key={opt.id}
                className={`horizontal-option-card ${emergencyType === opt.id ? 'selected' : ''}`}
                onClick={() => setEmergencyType(opt.id)}
              >
                <span className="opt-icon">{opt.icon}</span>
                <div className="opt-text">
                  <span className="opt-title">{t(opt.labelKey)}</span>
                  <span className="opt-desc">{t(opt.descKey)}</span>
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
          <div className="step-tag">STEP 2 &amp; 3</div>
          <h2 className="step-title">{t('emergencyForm.step3Title')}</h2>
          <p className="step-subtitle">{t('emergencyForm.locPlaceholder')}</p>

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
                <>
                  <span className="radar-spinner-dot"></span>
                  <span className="radar-sweep-text">{t('emergencyForm.gpsLocating')}</span>
                </>
              ) : location ? (
                t('emergencyForm.gpsLocked')
              ) : (
                'Detect My Current Location'
              )}
            </button>
            {location && (
              <div className="gps-readout">
                <span>Lat: {location.latitude.toFixed(4)}</span>
                <span>Lng: {location.longitude.toFixed(4)}</span>
                <span className="gps-live-dot">
                  <span className="live-gps-beacon"></span>
                  Precision Active
                </span>
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
            {loading ? <LoadingSpinner /> : t('emergencyForm.findBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyForm
