import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px'
}

const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false
}

function MapView({ hospitals, userLocation }) {
  const [selectedHospital, setSelectedHospital] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY
  })

  if (loadError) {
    return <div className="map-error">Unable to load map</div>
  }

  if (!isLoaded) {
    return <div className="map-loading">Loading map...</div>
  }

  const center = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : { lat: 18.5204, lng: 73.8567 }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      options={mapOptions}
    >
      {userLocation && (
        <Marker
          position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }}
        />
      )}

      {hospitals.map((hospital) => (
        <Marker
          key={hospital._id}
          position={{
            lat: hospital.location.coordinates[1],
            lng: hospital.location.coordinates[0]
          }}
          onClick={() => setSelectedHospital(hospital)}
        />
      ))}

      {selectedHospital && (
        <InfoWindow
          position={{
            lat: selectedHospital.location.coordinates[1],
            lng: selectedHospital.location.coordinates[0]
          }}
          onCloseClick={() => setSelectedHospital(null)}
        >
          <div className="info-window">
            <h3>{selectedHospital.name}</h3>
            <p>ETA: {selectedHospital.eta?.duration || 'N/A'}</p>
            <p>ICU Beds: {selectedHospital.availableICUBeds}/{selectedHospital.totalICUBeds}</p>
            <p>Load: {selectedHospital.currentLoad}/10</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export default MapView