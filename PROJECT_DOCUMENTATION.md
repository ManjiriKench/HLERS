# HLERS — HyperLocal Emergency Routing System
## Technical Architecture, Product Specification & Security Portfolio
**Author / Lead Engineer:** Manjiri Kench (Pune, India)  
**Project Category:** Emergency Healthcare Logistics / Distributed Systems / Real-Time Machine Learning

---

# 1. Executive Summary & Product Vision

### The Problem
During critical medical emergencies in India (such as acute cardiac arrest, massive stroke, severe trauma, or major burn injuries), **time-to-appropriate-care is the single biggest factor governing patient survival**. 

Existing consumer navigation tools (e.g., standard Google Maps) only locate the physically closest building labeled "Hospital." They possess **zero visibility** into real-time clinical and operational telemetry:
- *Is the ICU currently at 100% capacity?*
- *Is an acute cardiac Cath-Lab or Cardiologist on duty right now?*
- *Is the Emergency Department temporarily closed due to overload?*
- *What is the actual traffic-adjusted driving ETA to reach that specific emergency room?*

Choosing a hospital purely based on physical distance often leads to **life-threatening delays** if the patient arrives at a facility that cannot admit or treat them immediately, forcing a emergency re-transfer.

### The Solution: HLERS
**HLERS (HyperLocal Emergency Routing System)** is an end-to-end, intelligent emergency routing and pre-arrival dispatch ecosystem built specifically for Pune metro region. 

Instead of showing static points on a map, HLERS dynamically evaluates real-time clinical availability, specialist readiness, hospital load, and live traffic ETAs to **recommend and dispatch patients to the single facility best equipped to handle their specific emergency condition in the shortest time**.

---

# 2. Key Product Capabilities

```
  [1. Zero-Delay Emergency Triage] ──► [2. ML Multi-Factor Hospital Scoring]
                                                      │
                                                      ▼
  [4. Live Turn-by-Turn Navigation] ◄── [3. Pre-Arrival Hospital Telemetry Dispatch]
```

1. **Zero-Delay Emergency Triage**: Bystanders or families select the medical condition in 1 tap (`Cardiac`, `Stroke`, `Trauma`, `Burns`, `General Acute`). Browser GPS automatically acquires exact coordinates without requiring typing.
2. **Geospatial & Clinical Filtering**: Instantly filters open facilities within a 30km radius using MongoDB 2dsphere spatial indexing, weeding out closed ERs or non-matching facilities.
3. **Real-Time ML Scoring Engine**: Scores and ranks candidate hospitals dynamically using a multi-factor mathematical model combining specialist readiness, ICU bed ratio, current facility load, and live driving ETA.
4. **Pre-Arrival Hospital Alert Telemetry**: Transmits patient age, emergency type, notes, and GPS coordinates directly to the target hospital's triage desk prior to arrival.
5. **Live GPS Turn-by-Turn Navigation**: Provides real-time route guidance with an animated, heading-aware ambulance marker that rotates along turn vectors and updates maneuver instructions live.

---

# 3. System Architecture & Technical Deep Dive

HLERS follows a **decoupled, microservices-oriented architecture** to ensure maximum reliability, high throughput, and independent scalability of the ML scoring engine.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|               React.js + Vite + Context API + Google Maps JS API                  |
+--------------------------------─────────┬────────────────────────────────---------+
                                          |
                                          | REST API (HTTPS / JSON)
                                          ▼
+-----------------------------------------------------------------------------------+
|                                 BACKEND LAYER                                     |
|           Node.js + Express.js API Server (Port 5000)                             |
|    Security: Helmet.js | Rate Limiters | NoSQL Sanitizer | HPP | CORS             |
+──────────────────┬──────────────────────────────────────────┬─────────────────────+
                   │                                          │
                   │ Mongoose ODM                             │ Axios HTTP RPC
                   ▼                                          ▼
+──────────────────────────────────+       +────────────────────────────────────────+
|          DATABASE LAYER          |       |                ML LAYER                |
|      MongoDB Database            |       |     Python 3 + Flask API (Port 5001)   |
|   (2dsphere GeoJSON Indexing)    |       |   scikit-learn (MinMaxScaler Scorer)   |
+──────────────────────────────────+       +────────────────────────────────────────+
```

---

# 4. Component-by-Component Breakdown & Purpose

### 4.1 Frontend Application (`/client`)
- **Technology:** React.js, Vite, React Router v6, Google Maps JS API, Context API.
- **Why Built:** Provides a zero-friction, emergency-optimized user interface capable of functioning under high-stress situations with high visual clarity and single-tap interactions.
- **Key Modules:**
  - `EmergencyForm.jsx`: Triage input & instant GPS detection.
  - `HospitalList.jsx`: Ranked hospital list displaying ML Match Scores, ICU bed counts, and load indicators.
  - `AlertConfirmation.jsx`: Pre-arrival telemetry status screen with route switching capabilities.
  - `MapView.jsx`: Custom map canvas featuring live GPS tracking (`watchPosition`), dynamic turn-by-turn HUD, and dynamic SVG ambulance rotation based on compass bearing.

### 4.2 Core API Microservice (`/server`)
- **Technology:** Node.js, Express.js.
- **Why Built:** Serves as the central API gateway and business logic coordinator. Receives emergency requests, performs geospatial database queries, coordinates with external Maps APIs for traffic ETAs, invokes the ML Scoring Microservice, and persists emergency telemetry.
- **Key Services & Routes:**
  - `hospitalRoutes.js`: Exposes `/api/hospitals/nearby` with `$near` GeoJSON queries.
  - `emergencyRoutes.js`: Handles emergency request logging.
  - `alertRoutes.js`: Dispatches pre-arrival telemetry to target hospitals.
  - `mapsService.js`: Integrates `@googlemaps/google-maps-services-js` for live driving ETAs.
  - `mlService.js`: Performs internal HTTP RPC calls to the Python ML microservice.

### 4.3 ML Scoring Microservice (`/ml`)
- **Technology:** Python 3, Flask, NumPy, scikit-learn (`MinMaxScaler`).
- **Why Built:** Decouples complex multi-factor numerical normalization and mathematical scoring from the Node.js event loop. This ensures that heavy matrix operations scale independently without blocking backend API response times.

### 4.4 Geospatial Database (`/server/models`)
- **Technology:** MongoDB, Mongoose ODM.
- **Why Built:** Uses native GeoJSON `Point` schemas and `2dsphere` spatial indexes. Allows sub-millisecond proximity queries across Pune's geographical coordinates (`$near` with `$maxDistance`).

---

# 5. ML Scoring Model & Mathematical Formula

HLERS uses a multi-variable weighted linear scoring model. Raw metrics are normalized between $[0, 1]$ using `MinMaxScaler` across candidate hospitals:

$$\text{Score} = 100 \times \left( 0.30 \cdot S_{\text{match}} + 0.25 \cdot S_{\text{icu}} + 0.20 \cdot S_{\text{load}} + 0.15 \cdot S_{\text{eta}} \right)$$

### Factor Breakdown
1. **Emergency & Specialist Match Score ($S_{\text{match}}$, Weight: 30%)**:
   - Base score $= 1.0$ if hospital supports emergency type.
   - Bonus $+0.3$ (capped at $1.0$) if specialized physician (e.g., Cardiologist for Cardiac, Neurologist for Stroke) is **confirmed on duty**.
2. **ICU Bed Availability Ratio ($S_{\text{icu}}$, Weight: 25%)**:
   - Ratio $= \frac{\text{Available ICU Beds}}{\text{Total ICU Beds}}$.
3. **Current Facility Occupancy Load ($S_{\text{load}}$, Weight: 20%)**:
   - Inverse load factor $= 1 - \frac{\text{Current Load}}{10}$.
4. **Traffic-Adjusted Travel Time ($S_{\text{eta}}$, Weight: 15%)**:
   - Inverse normalized ETA $= 1 - \frac{\min(\text{ETA Seconds}, 3600)}{3600}$.

---

# 6. Built-in Security Architecture (Protected from Day 1)

Security in an emergency medical application is critical to prevent denial-of-service, data tampering, or unauthorized access. HLERS incorporates security best practices into its core code from day one:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SECURITY DEFENSE LAYERS                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. HTTP Security Headers       ──►  Helmet.js Middleware               │
│ 2. Rate Limiting / DoS         ──►  express-rate-limit (10 req/min)     │
│ 3. NoSQL Injection Defense     ──►  Custom Request Sanitizer           │
│ 4. Parameter Pollution Guard   ──►  HPP Middleware                     │
│ 5. Strict Payload Size Limits  ──►  express.json({ limit: '10kb' })    │
│ 6. Strict Data Validation      ──►  Mongoose Schema Range Validation   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Helmet.js HTTP Security Headers**: Secures Express HTTP responses by setting X-Content-Type-Options, Strict-Transport-Security (HSTS), X-Frame-Options (clickjacking protection), and hiding `X-Powered-By: Express`.
2. **Multi-Tier Rate Limiting (Anti-DoS Protection)**:
   - **Global Limiter**: Caps general API endpoints to 100 requests per 15-minute window.
   - **Emergency Endpoint Limiter**: Caps high-priority emergency creation (`/api/emergencies`) and alert dispatch (`/api/alerts`) to **10 requests per minute** to prevent spam attacks while guaranteeing bandwidth for genuine emergencies.
3. **NoSQL Injection Sanitization**: Implemented custom request sanitization middleware (`sanitize.js`) that strips dangerous MongoDB operators (`$gt`, `$where`, `$ne`, etc.) from incoming query params and body objects.
4. **HTTP Parameter Pollution (HPP) Defense**: Integrated `hpp` middleware to prevent attackers from causing server errors or unexpected behavior via duplicated URL parameters.
5. **Strict Request Body Size Capping**: Server limits JSON payload size to `10kb` (`express.json({ limit: '10kb' })`), preventing memory exhaustion attacks via large body payloads.
6. **Mongoose Schema Level Validation**: Enforces strict enum checks (e.g. valid emergency categories), numeric range constraints (`currentLoad: 0..10`, `patientAge: 0..120`), and 10-digit phone number regex patterns (`/^[0-9]{10}$/`).

---

# 7. Dataset & Geospatial Scale (32 Pune Hospitals)

The system dataset includes **32 Pune hospitals** spanning over 20 distinct geographical areas across Pune metro region to provide meaningful spatial and operational differentiation:

- **Locations Covered**: Kothrud, Hadapsar, Wakad, Pimpri-Chinchwad (PCMC), Baner, Aundh, Shivajinagar, Deccan, Swargate, Sahakarnagar, Bibwewadi, Kondhwa, Wanowrie, Camp, Koregaon Park, Viman Nagar, Kharadi, Yerawada, Sinhagad Road, Warje, Pashan, Hinjawadi, and Gangadham.
- **Key Featured Hospitals**: Ruby Hall Clinic (Sassoon Rd & Wanowrie), Deenanath Mangeshkar, Sassoon General, KEM Hospital, Jehangir, Sahyadri Kothrud & Warje, Aditya Birla Memorial, Jupiter Baner, Ace Hospital & Research Centre, Rao Nursing Home, Namoh Hospital, Noble Hadapsar, Command Hospital Pashan, and more.
- **Stress-Test Scenarios Included**: Closed ERs, Zero-bed ICUs, High-occupancy facilities (load 8-10), and specialized-only clinics.

---

# 8. Technical Stack Summary

| Layer | Technologies & Tools |
|---|---|
| **Frontend UI** | React.js (v18), Vite, Vanilla CSS Design System, Google Maps API |
| **Backend API** | Node.js, Express.js, Axios, dotenv, CORS |
| **Database** | MongoDB, Mongoose ODM, GeoJSON 2dsphere Indexing |
| **Machine Learning** | Python 3, Flask, NumPy, scikit-learn (`MinMaxScaler`) |
| **Maps & Routing** | Google Maps Services Node SDK, Directions API, Geolocation API |
| **Security** | Helmet.js, express-rate-limit, HPP, NoSQL Sanitizer |

---

# 9. Conclusion & Production Readiness

HLERS demonstrates an end-to-end engineered solution combining **geospatial querying, machine learning recommendation algorithms, real-time telemetry dispatch, live GPS navigation, and defense-in-depth security**. 

The system has been verified end-to-end, tested across multiple Pune localities, and is ready for real-world deployment.
