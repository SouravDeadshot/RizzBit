# RizzBit ⚡📍

> **Dating, in the moment.** Proximity-based dating and real-time geo-fenced matchmaking.

---

## 🌟 Overview

**RizzBit** is a next-generation dating platform built around real-world proximity and dynamic geo-fencing. Rather than endless swiping across hundreds of miles, RizzBit connects people who share physical spaces, vibes, and moments — whether you're at the same concert, campus, cafe, festival, or social hotspot.

---

## 🏗️ Architecture

RizzBit pairs a high-performance **Java 21 + Spring Boot 3** backend with an in-memory **Redis Geospatial Index** and **PostgreSQL/PostGIS** database:

```
┌─────────────────────────────────────────┐
│     Mobile App (React Native / Flutter)  │
└───────────────────┬─────────────────────┘
                    │ REST / WebSockets (STOMP)
                    ▼
┌─────────────────────────────────────────┐
│      Spring Boot 3 (Java 21)            │
│  - Virtual Threads (Project Loom)       │
│  - Spring Security (Stateless / JWT)    │
│  - Haversine & JTS Geofencing Engine    │
└───────────────┬─────────────────┬───────┘
                │                 │
                ▼                 ▼
   ┌────────────────────┐  ┌────────────────────┐
   │    Redis GEO       │  │ PostgreSQL/PostGIS │
   │ (Sub-5ms Proximity │  │ (User profiles,    │
   │  Radar & Lookups)  │  │  geofence polygons)│
   └────────────────────┘  └────────────────────┘
```

---

## 🚀 Key Features

### 1. 📍 In-Memory Proximity Radar (Sub-5ms)
- Uses **Redis GEO** (`GEOADD`, `GEOSEARCH`) to index active user locations in real time.
- Returns nearby candidates within adjustable radius bands (e.g. 100m, 500m, 1km, 5km).
- Never queries disk database on raw GPS heartbeats.

### 2. 🛡️ Privacy & Safety by Design
- **Distance Bands:** Distances are returned as privacy-safe bands (`"Very Close (< 100m)"`, `"Within 500m"`) to prevent trilateration / stalking.
- **Ghost Mode:** Instantly evicts the user's coordinates from the Redis spatial index with zero trace.
- **Auto-Expiring Location:** Location TTL removes inactive users after 30 minutes.

### 3. 🎪 Dynamic Geofenced Venues & Hotspots
- Campus, event, festival, and venue geofencing.
- Automatic check-in and room assignment when crossing boundary coordinates.

---

## 📁 Project Structure

```
RizzBit/
├── backend/                      # Java 21 / Spring Boot 3 Backend
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
├── docker-compose.yml            # Local Redis & PostGIS containers
├── .env.example                  # Environment configuration template
└── README.md
```

---

## ⚡ Quick Start

### 1. Start Infrastructure (PostGIS + Redis)

Make sure [Docker Desktop](https://www.docker.com/) is installed and running, then run:

```bash
docker compose up -d
```

This starts:
- **Redis 7** on port `6379`
- **PostgreSQL 16 with PostGIS** on port `5432`

### 2. Run the Java Backend

Requires **Java 21+** and **Maven**:

```bash
cd backend
mvn spring-boot:run
```

The server starts on port `8080`.

---

## 📡 API Reference

### Proximity Radar

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/proximity/ping` | Heartbeat location ping (`latitude`, `longitude`, `ghostMode`) |
| `GET` | `/api/v1/proximity/radar?userId={id}&radiusMeters=1000` | Real-time nearby matches within radius |

### Geofences & Venues

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/geofences/active` | Get all active venue & event geofences |
| `POST` | `/api/v1/geofences/check-in` | Check which geofences a user coordinate is inside |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
