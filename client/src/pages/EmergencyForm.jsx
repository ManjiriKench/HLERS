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

    const detectLocation = () => {
        setLocationError('')
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser')
            return
        }
        navigator.geolocation.getCurrentPosition(
            (position) =>{
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
           () => {
            setLocationError('Unable to detect location. Please enable location access.')
        }
        )
    } 
    
    const handleSubmit = async () => {
        setError('')
        if(!emergencyType){
            setError('Please select an emergency type')
            return
        }
        if(!patientAge || patientAge <0|| patientAge > 120){
            setError('Please enter a valid patient age')
            return
        }
        if (!location) {
            setError('please detect your location first')
            return
        }
        setLoading(true)

        try{
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
              recommendation: nearbyResponse.data.recommendation
            }
        })
        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const emergencyTypes = ['cardiac', 'trauma', 'burns', 'stroke', 'other']

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Emergency</h1>
        <p>Fill this in 30 seconds. We'll find the right hospital.</p>
      </div>

      <div className="form-section">
        <h2>What is the emergency?</h2>
        <div className="emergency-types">
          {emergencyTypes.map((type) => (
            <button
              key={type}
              className={`type-btn ${emergencyType === type ? 'selected' : ''}`}
              onClick={() => setEmergencyType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h2>Patient age (approximate)</h2>
        <input
          type="number"
          placeholder="e.g. 45"
          value={patientAge}
          onChange={(e) => setPatientAge(e.target.value)}
          min="0"
          max="120"
          className="age-input"
        />
      </div>

      <div className="form-section">
        <h2>Any notes? (optional)</h2>
        <textarea
          placeholder="e.g. diabetic, head injury, unconscious..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={100}
          className="notes-input"
          rows={3}
        />
        <p className="char-count">{notes.length}/100</p>
      </div>

      <div className="form-section">
        <h2>Your location</h2>
        <button
          className="location-btn"
          onClick={detectLocation}
        >
          { location ? 'Location detected' : 'Detect my location' }
        </button>
        { locationError && <p className="error-text">{locationError}</p> }
      </div>

      { error && <p className="error-text">{error}</p> }

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        { loading ? <LoadingSpinner /> : 'Find Hospitals Now' }
      </button>
    </div>
  )
}

export default EmergencyForm
