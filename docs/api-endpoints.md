# HLERS API Endpoints

## Hospitals

### GET /api/hospitals
Returns all hospitals.

### GET /api/hospitals/:id
Returns a single hospital by ID.

### POST /api/hospitals
Creates a new hospital. Validates all fields against the Hospital schema.

### PATCH /api/hospitals/:id/capacity
Updates only: availableICUBeds, currentLoad, emergencyDeptOpen, specialists.
All other fields are ignored — whitelist-based update for security.

## Status
All endpoints tested and working with Thunder Client (Day 4)

## Emergency Requests

### POST /api/emergencies
Creates a new emergency request.
Required: emergencyType, patientAge, userLocation

### GET /api/emergencies
Returns all emergency requests with recommended hospital details populated.

## Alerts

### POST /api/alerts
Creates a pre-arrival alert to a specific hospital.
Required: hospitalId, emergencyType, patientAge

### GET /api/alerts
Returns all alerts with hospital name, address and phone populated.

## Seed Data
5 real Pune hospitals seeded — Ruby Hall Clinic, Deenanath Mangeshkar,
KEM Hospital, Sassoon General, Jehangir Hospital.
All endpoints tested and verified (Day 6)