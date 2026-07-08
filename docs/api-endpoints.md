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

## Security Layers Active on All Endpoints

- Rate limiting: 100 requests per 15 minutes (global)
- Emergency endpoints: 10 requests per minute
- NoSQL injection sanitization on all request bodies
- HTTP Parameter Pollution protection
- JSON payload size limit: 10kb
- All endpoints tested and security verified (Day 8)

## Frontend Routes

### / (Home)
Landing page with problem statement and Report Emergency button.

### /emergency (Emergency Form)
30-second emergency form with:
- Emergency type selection (cardiac, trauma, burns, stroke, other)
- Patient age input
- Optional notes (max 100 chars)
- Auto location detection from browser

### /hospitals (Hospital List)
Results page showing:
- Google Maps view with hospital markers and user location
- Ranked hospital cards with ETA, ICU beds, load, specialists
- Pre-arrival alert button per hospital

### * (404 NotFound)
Catch-all route for unmatched URLs.

## Frontend Status
All pages built and tested — Day 12
Full flow working: Emergency Form → Hospital List → Alert Hospital