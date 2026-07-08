# HLERS — HyperLocal Emergency Routing System

## The Problem
When someone has a medical emergency in India, a heart attack, accident, or stroke, bystanders don't know which hospital can actually help RIGHT NOW. Google Maps shows the nearest hospital, but not whether the ICU is full, whether a cardiologist is available, or how long it will truly take to reach them in current traffic.

## What HLERS Does
HLERS is a web application that:
- Lets users report an emergency type (cardiac, trauma, burns, stroke)
- Shows nearby hospitals with **real-time** capacity, ICU beds, specialist availability, current load
- Recommends the BEST hospital using an ML scoring model (emergency type + ETA + current capacity)
- Sends a pre-arrival alert to the hospital with basic patient info

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express
- - **Database:** MongoDB with Mongoose ODM + GeoJSON geospatial indexing
- - **Maps:** Google Maps API — Directions API returning real ETAs, geospatial hospital search working
- **ML:** Python + scikit-learn (hospital recommendation scoring)
- **Security:** Helmet.js, custom NoSQL sanitizer, rate limiting, HPP, input validation

## Project Status
🟡 In active development — Day 13
The frontend is live with functional template as a base. More improvements will be added soon.

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
