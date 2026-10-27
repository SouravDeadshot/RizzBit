# RizzBit ⚡📍

> **Dating, in the moment.** Proximity-based dating and real-time geo-fenced matchmaking.

---

## 🌟 Overview

**RizzBit** is a next-generation dating platform built around real-world proximity and dynamic geo-fencing. Rather than endless swiping across hundreds of miles, RizzBit connects people who share physical spaces, vibes, and moments — whether you're at the same concert, campus, cafe, festival, or social hotspot.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│       Mobile App (React Native / Expo)       │
│  - Adaptive GPS Heartbeats (15m delta)       │
│  - Pulsing Proximity Radar UI (60 FPS)       │
│  - One-Tap Ghost Mode Privacy                │
└──────────────────────┬───────────────────────┘
                       │ REST / WebSockets
                       ▼
┌──────────────────────────────────────────────┐
│          Spring Boot 3 (Java 21)             │
│  - Virtual Threads (Project Loom)            │
│  - Stateless Security & Auth                 │
│  - Geofence Boundary Engine                  │
└───────────────┬──────────────────────┬───────┘
                │                      │
                ▼                      ▼
   ┌──────────────────────┐  ┌──────────────────────┐
   │      Redis GEO       │  │  PostgreSQL/PostGIS  │
   │  (Sub-5ms Proximity  │  │ (User profiles,      │
   │   Radar & Lookups)   │  │  geofence polygons)  │
   └──────────────────────┘  └──────────────────────┘
```

---

## 📁 Repository Structure

```
RizzBit/
├── backend/                      # ☕ Java 21 / Spring Boot 3 Backend
│   ├── pom.xml                   # Maven dependencies (Spatial, Redis, Web, Security)
│   └── src/main/
│       ├── java/com/rizzbit/
│       │   ├── config/           # Redis, Security, WebSocket configurations
│       │   ├── controller/       # Proximity & Geofence REST APIs
│       │   ├── dto/              # LocationPing, Radar responses, Geofence DTOs
│       │   ├── model/            # UserProfile & GeofenceZone JPA entities
│       │   ├── repository/       # Spring Data Repositories
│       │   └── service/          # ProximityService (Redis GEO) & GeofenceService
│       └── resources/
│           └── application.yml   # Virtual threads, Redis & PostGIS settings
├── mobile/                       # 📱 React Native (Expo) Frontend
│   ├── App.tsx                   # Main mobile app root
│   ├── app.json                  # Expo iOS/Android permissions config
│   ├── package.json              # Mobile dependencies (expo-location, etc.)
│   └── src/
│       ├── api/client.ts         # Backend API client
│       ├── components/           # RadarView, UserCard
│       ├── hooks/                # useLocation (battery-saving GPS watcher)
│       └── screens/              # RadarScreen
├── docs/
│   └── API_CONTRACT.md           # 🤝 Shared API contract & schemas between FE & BE
├── docker-compose.yml            # Local Redis & PostGIS containers
└── .env.example                  # Environment configuration template
```

---

## 👥 Two-Developer Workflow Guide

### 📱 For the Frontend Developer (React Native / Expo)

1. Make sure Node.js (v18+) is installed.
2. Navigate to the mobile folder and install packages:
   ```bash
   cd mobile
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```
4. Point to the backend:
   - By default, `mobile/src/api/client.ts` connects to `http://localhost:8080` (iOS simulator) or `http://10.0.2.2:8080` (Android emulator).
   - If testing on a physical phone over Wi-Fi, create `mobile/.env` with:
     ```env
     EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_WIFI_IP>:8080
     ```

---

### ☕ For the Backend Developer (Java / Spring Boot)

1. **Start the Database & Redis via Docker:**
   ```bash
   docker compose up -d
   ```
   *(Starts Redis on port `6379` and PostgreSQL/PostGIS on `5432`)*

2. **Run the Spring Boot application:**
   *(Requires JDK 21+ and Maven)*
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will boot up at `http://localhost:8080`.

3. **Check the API Contract:**
   See [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) for all JSON schemas, endpoint paths, and privacy rules.

---

## 🤝 Git Collaboration Guidelines

- **Main branch:** `main` (production-ready stable code).
- **Frontend branch:** create branches like `feat/fe-radar-animations` or `feat/fe-auth-ui`.
- **Backend branch:** create branches like `feat/be-jwt-auth` or `feat/be-venues-crud`.
- Open **Pull Requests (PRs)** to merge into `main` after testing.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
