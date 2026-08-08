# HLERS — HyperLocal Emergency Routing System

## The Problem
When someone has a medical emergency in India—a heart attack, accident, stroke, or severe trauma—bystanders and families don't know which hospital can actually accept and treat them RIGHT NOW. Google Maps shows nearest facilities, but not ICU bed availability, specialist readiness on duty, or ER operational status.

## What HLERS Does
HLERS is an emergency-focused hospital recommendation and dispatch web application that:
- **Categorizes Emergency Types**: Cardiac, stroke, trauma, burns, and general acute emergencies.
- **Geospatial Proximity Search**: Uses GeoJSON 2dsphere indexing across 32 Pune hospitals spanning 20+ localities.
- **Real-Time Driving ETA**: Integrates Google Maps API Directions engine for accurate route duration.
- **ML Scoring Engine**: Normalizes and weights emergency match, ICU availability, occupancy load, and travel time.
- **Pre-Arrival Telemetry & Dispatch Alert**: Transmits patient telemetry directly to the selected facility.
- **Live GPS Navigation**: Real-time turn-by-turn guidance with heading-aware ambulance marker tracking.

## System Architecture
- **Frontend**: React.js + Vite + Leaflet / Google Maps API
- **Backend**: Node.js + Express + MongoDB (Mongoose ODM with 2dsphere indexing)
- **ML Engine**: Python + Flask + scikit-learn (`MinMaxScaler` scoring model)
- **Security & Middleware**: Helmet.js, NoSQL sanitizer, rate limiting, HPP, CORS

## Pune Hospital Dataset (32 Facilities)
Covers key areas across Pune including Sassoon Road, Erandwane, Kothrud, Hadapsar, PCMC, Baner, Aundh, Shivajinagar, Deccan, Swargate, Sahakarnagar, Bibwewadi, Kondhwa, Wanowrie, Koregaon Park, Viman Nagar, Kharadi, Yerawada, Sinhagad Road, Warje, Pashan, Hinjawadi, and Gangadham.

## Quick Start Guide

### 1. Backend Server & Database
```bash
cd server
npm install
node seed.js    # Seed 32 Pune hospitals
npm run dev     # Starts Express server on port 5000
```

### 2. ML Scoring Service
```bash
cd ml
venv\Scripts\activate
python app.py   # Starts Flask ML service on port 5001
```

### 3. Frontend Application
```bash
cd client
npm install
npm run dev     # Starts Vite web application
```

## Developer
Manjiri Kench — Pune, India
