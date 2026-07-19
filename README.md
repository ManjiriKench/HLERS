# HLERS — HyperLocal Emergency Routing System

## The Problem
When someone has a medical emergency in India, a heart attack, accident, or stroke, bystanders don't know which hospital can actually help RIGHT NOW. Google Maps shows the nearest hospital, but not whether the ICU is full, whether a cardiologist is available, or how long it will truly take to reach them in current traffic.

## What HLERS Does
HLERS is a web application that:
- Lets users report an emergency type (cardiac, trauma, burns, stroke)
- Detects user location automatically from browser — no address typing
- Shows nearby hospitals filtered by emergency type and ER open status
- Calculates real driving ETA for each hospital using Google Maps Directions API
- Scores each hospital using a weighted ML model (emergency type match + ICU availability + current load + ETA)
- Recommends the single BEST hospital for that specific emergency
- Sends a pre-arrival alert to the hospital before the patient arrives
- Displays results on an interactive Google Maps view with hospital markers.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express
- - **Database:** MongoDB with Mongoose ODM + GeoJSON geospatial indexing
- - **Maps:** Google Maps API — Directions API returning real ETAs, geospatial hospital search working
- **ML:** Python + scikit-learn (hospital recommendation scoring)
- **Security:** Helmet.js, custom NoSQL sanitizer, rate limiting, HPP, input validation

## Current Status
🟡 In active development — Day 33


✅ Backend complete — Node.js + Express + MongoDB + Google Maps API
✅ ML scoring layer complete — Python + Flask + scikit-learn
✅ Frontend complete — React + Vite + Google Maps
✅ Full end-to-end flow working — Emergency Form → ML Recommendation → Hospital List → Alert
🟡 In active development — Day 33
⏳ Coming soon — Mobile responsiveness, deployment, UI redesign
## Screenshots

### Hospital Results with Google Maps
- Real-time Google Maps view with hospital markers
- Live ICU bed count, ETA, specialist availability
- Pre-arrival alert system
- Color-coded emergency load indicator

## Live Demo
Coming soon — deployment in progress

## How to Run Locally

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Seed Database
```bash
cd server
node seed.js
```

## Developer
Manjiri Kench — Pune, India
