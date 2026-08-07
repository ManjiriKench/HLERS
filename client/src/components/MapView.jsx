import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useEffect, useRef, useCallback } from 'react'

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '14px'
}

const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  gestureHandling: 'greedy'
}

function haversineDistance(a, b) {
  const R = 6371000
  const dLat = (b.latitude - a.latitude) * Math.PI / 180
  const dLon = (b.longitude - a.longitude) * Math.PI / 180
  const lat1 = a.latitude * Math.PI / 180
  const lat2 = b.latitude * Math.PI / 180
  const sinDlat = Math.sin(dLat / 2)
  const sinDlon = Math.sin(dLon / 2)
  const x = sinDlat * sinDlat + sinDlon * sinDlon * Math.cos(lat1) * Math.cos(lat2)
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function calculateBearing(from, to) {
  const dLon = (to.longitude - from.longitude) * Math.PI / 180
  const lat1 = from.latitude * Math.PI / 180
  const lat2 = to.latitude * Math.PI / 180
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

function buildAmbulanceSVG(heading) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <g transform="rotate(${heading}, 20, 20)">
      <rect x="11" y="5" width="18" height="26" rx="4" fill="#0F5E63"/>
      <rect x="11" y="5" width="18" height="10" rx="4" fill="#0D7377"/>
      <rect x="14" y="7" width="5" height="5" rx="1.5" fill="rgba(255,255,255,0.85)"/>
      <rect x="21" y="7" width="5" height="5" rx="1.5" fill="rgba(255,255,255,0.85)"/>
      <rect x="14" y="16" width="12" height="10" rx="2" fill="rgba(255,255,255,0.12)"/>
      <rect x="18.5" y="17" width="3" height="1.5" rx="0.75" fill="white"/>
      <rect x="19.25" y="15.5" width="1.5" height="5" rx="0.75" fill="white"/>
      <rect x="13" y="30" width="5" height="5" rx="2.5" fill="#1a1a2e"/>
      <rect x="22" y="30" width="5" height="5" rx="2.5" fill="#1a1a2e"/>
      <rect x="13" y="30" width="5" height="5" rx="2.5" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
      <rect x="22" y="30" width="5" height="5" rx="2.5" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
    </g>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function MapView({ hospitals, userLocation, targetHospital, mode = 'overview', isNavigating = false }) {
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [directions, setDirections] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [showSteps, setShowSteps] = useState(false)
  const [liveUserPos, setLiveUserPos] = useState(userLocation)
  const [heading, setHeading] = useState(0)

  const watchIdRef = useRef(null)
  const mapRef = useRef(null)
  const lastFetchPosRef = useRef(null)
  const directionsInitRef = useRef(false)
  const prevPosRef = useRef(null)
  const directionsRef = useRef(null)
  const activeStepRef = useRef(0)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || ''
  })

  const effectiveTarget = targetHospital || (hospitals && hospitals.length === 1 ? hospitals[0] : null)

  const advanceStepIfNeeded = useCallback((pos, dirs) => {
    if (!dirs) return
    const legs = dirs.routes?.[0]?.legs?.[0]
    if (!legs) return
    const steps = legs.steps
    const current = activeStepRef.current
    if (current >= steps.length - 1) return
    const stepEnd = steps[current].end_location
    const dist = haversineDistance(pos, {
      latitude: stepEnd.lat(),
      longitude: stepEnd.lng()
    })
    if (dist < 30) {
      const next = current + 1
      activeStepRef.current = next
      setActiveStep(next)
    }
  }, [])

  useEffect(() => {
    directionsRef.current = directions
  }, [directions])

  useEffect(() => {
    if (!isNavigating || !navigator.geolocation) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      directionsInitRef.current = false
      lastFetchPosRef.current = null
      prevPosRef.current = null
      activeStepRef.current = 0
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        if (prevPosRef.current) {
          const dist = haversineDistance(prevPosRef.current, newPos)
          if (dist > 2) {
            const bear = calculateBearing(prevPosRef.current, newPos)
            setHeading(bear)
          }
        }

        prevPosRef.current = newPos
        setLiveUserPos(newPos)

        if (mapRef.current) {
          mapRef.current.panTo({ lat: newPos.latitude, lng: newPos.longitude })
        }

        advanceStepIfNeeded(newPos, directionsRef.current)
      },
      (err) => {
        console.warn('GPS watch error:', err)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }
    )

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [isNavigating, advanceStepIfNeeded])

  useEffect(() => {
    if (!isLoaded || !window.google || !liveUserPos || !effectiveTarget || mode === 'overview') {
      if (!isNavigating) setDirections(null)
      return
    }

    const shouldFetch = !directionsInitRef.current ||
      (lastFetchPosRef.current && haversineDistance(lastFetchPosRef.current, liveUserPos) > 80)

    if (!shouldFetch) return

    lastFetchPosRef.current = liveUserPos
    directionsInitRef.current = true

    const svc = new window.google.maps.DirectionsService()
    svc.route(
      {
        origin: { lat: liveUserPos.latitude, lng: liveUserPos.longitude },
        destination: {
          lat: effectiveTarget.location.coordinates[1],
          lng: effectiveTarget.location.coordinates[0]
        },
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
          directionsRef.current = result
          activeStepRef.current = 0
          setActiveStep(0)
        }
      }
    )
  }, [isLoaded, liveUserPos, effectiveTarget, mode, isNavigating])

  if (loadError) {
    return <div className="map-error">Unable to load map engine.</div>
  }

  if (!isLoaded) {
    return <div className="map-loading">Loading Map...</div>
  }

  const initialCenter = liveUserPos
    ? { lat: liveUserPos.latitude, lng: liveUserPos.longitude }
    : { lat: 18.5204, lng: 73.8567 }

  const currentRoute = directions?.routes?.[0]?.legs?.[0]
  const steps = currentRoute?.steps || []

  const ambulanceIcon = isLoaded && window.google
    ? {
        url: buildAmbulanceSVG(heading),
        scaledSize: new window.google.maps.Size(40, 40),
        anchor: new window.google.maps.Point(20, 20)
      }
    : undefined

  return (
    <div className="map-gps-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {mode !== 'overview' && isNavigating && currentRoute && (
        <div className="gps-turn-hud">
          <div className="hud-primary-row">
            <div className="hud-instruction">
              <span className="hud-next-step">
                {steps[activeStep]?.instructions
                  ? steps[activeStep].instructions.replace(/<[^>]*>?/gm, '')
                  : `Navigating to ${effectiveTarget?.name}`}
              </span>
              <span className="hud-sub-metric">
                {steps[activeStep]?.distance?.text || currentRoute.distance?.text}
                {' · '}
                {currentRoute.duration?.text} remaining
              </span>
            </div>
            <div className="hud-actions-wrap">
              <button
                className="hud-toggle-btn"
                onClick={() => setShowSteps(!showSteps)}
              >
                {showSteps ? 'Hide' : 'Turns'}
              </button>
            </div>
          </div>

          {showSteps && (
            <div className="hud-steps-list">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`step-item ${activeStep === idx ? 'current' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <span className="step-num">{idx + 1}</span>
                  <span className="step-text">{step.instructions.replace(/<[^>]*>?/gm, '')}</span>
                  <span className="step-dist">{step.distance?.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialCenter}
        zoom={14}
        options={mapOptions}
        onLoad={(map) => {
          mapRef.current = map
        }}
      >
        {mode !== 'overview' && directions ? (
          <>
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#0F5E63',
                  strokeWeight: 5,
                  strokeOpacity: 0.9
                },
                suppressMarkers: true,
                preserveViewport: true
              }}
            />

            {liveUserPos && ambulanceIcon && (
              <Marker
                position={{ lat: liveUserPos.latitude, lng: liveUserPos.longitude }}
                icon={ambulanceIcon}
                zIndex={1000}
              />
            )}

            {effectiveTarget && (
              <Marker
                position={{
                  lat: effectiveTarget.location.coordinates[1],
                  lng: effectiveTarget.location.coordinates[0]
                }}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }}
              />
            )}
          </>
        ) : (
          <>
            {liveUserPos && (
              <Marker
                position={{ lat: liveUserPos.latitude, lng: liveUserPos.longitude }}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            )}

            {hospitals?.map((hospital) => (
              <Marker
                key={hospital._id}
                position={{
                  lat: hospital.location.coordinates[1],
                  lng: hospital.location.coordinates[0]
                }}
                onClick={() => setSelectedHospital(hospital)}
              />
            ))}
          </>
        )}

        {selectedHospital && (
          <InfoWindow
            position={{
              lat: selectedHospital.location.coordinates[1],
              lng: selectedHospital.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedHospital(null)}
          >
            <div className="info-window">
              <h3 style={{ fontSize: '0.95rem', color: '#1C2D37', margin: 0, fontWeight: 700 }}>{selectedHospital.name}</h3>
              <p style={{ margin: '4px 0', fontSize: '0.82rem', color: '#4A636E' }}>ETA: {selectedHospital.eta?.duration || 'N/A'}</p>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#1B806A', fontWeight: 600 }}>ICU Beds: {selectedHospital.availableICUBeds}/{selectedHospital.totalICUBeds}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}

export default MapView