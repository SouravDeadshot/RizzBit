# RizzBit ⚡📍

> **Dating, in the moment.** Proximity-based dating and real-time geo-fenced matchmaking.

---

## 🌟 Overview

**RizzBit** is a next-generation dating platform built around real-world proximity and dynamic geo-fencing. Rather than endless swiping across hundreds of miles, RizzBit connects people who share physical spaces, vibes, and moments — whether you're at the same concert, campus, cafe, festival, or social hotspot.

---

## 🚀 Key Features

### 1. 📍 Dynamic Geo-Fencing & Hotspots
- **Venue & Event Fences:** Automatically discover active geo-fences at verified venues, festivals, coffee shops, and university campuses.
- **Ephemeral Rooms:** Join location-bounded matchmaking pools that are active only while you are within the perimeter.

### 2. ⚡ Proximity Radar (Real-Time Matching)
- **Hyper-Local Discovery:** Match with individuals within adjustable proximity ranges (e.g., 100m, 500m, 1km, 5km).
- **Proximity Sparks:** Instant nudges when someone matching your preferences enters your vicinity and mutual interest is signaled.

### 3. 🛡️ Privacy & Safety by Design
- **Fuzzy Proximity:** True GPS coordinates are never broadcast to other users; distance is obfuscated into privacy-safe zones or distance bands.
- **Ghost Mode:** Instantly pause location broadcasting while retaining your profile and ongoing chats.
- **Check-In Verification:** Location spoofing detection and safety check-ins.

### 4. 💬 Real-Time Ephemeral Interaction
- Icebreaker games, speed interactions, and proximity-based voice or text lounges before exchanging contacts.

---

## 🛠️ Architecture & Core Components

```
RizzBit/
├── apps/               # Mobile / Web clients (e.g., React Native / Flutter / Web)
├── services/           # Backend microservices / serverless functions
│   ├── location/       # Geospatial indexing (Redis GEO / PostGIS) & geofence engine
│   ├── matching/       # Proximity pairing algorithms & preference matching
│   └── chat/           # Real-time WebSocket / WebRTC communication
├── packages/           # Shared models, schemas, and utility libraries
└── docs/               # System design, API specs, and security protocols
```

---

## 🗺️ Roadmap

- [x] Initial Project Setup & Repository Initialization
- [ ] Core Geospatial & Geofencing Engine (Redis GEO / PostGIS)
- [ ] User Identity & Privacy-Preserving Location Architecture
- [ ] Mobile Client Prototype (Proximity Radar & Radar Visualizer)
- [ ] Ephemeral Chat & Match Engine
- [ ] Beta Venue Launch & Campus Pilots

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
