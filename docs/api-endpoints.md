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