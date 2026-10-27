# RizzBit API Contract (Frontend ↔ Backend) 🤝

This document is the **contract and source of truth** between the **Mobile Frontend (React Native Expo)** and the **Backend (Java Spring Boot 3 + Redis GEO + PostGIS)**.

---

## 🌐 Base URL & Environments

- **Local Backend (Host Machine / iOS Sim):** `http://localhost:8080`
- **Local Backend (Android Emulator):** `http://10.0.2.2:8080`
- **LAN / Wi-Fi Device:** `http://<DEV_MACHINE_IP>:8080`
- **WebSocket Gateway:** `ws://<HOST>:8080/ws/proximity`

---

## 📍 1. Proximity Radar APIs

### `POST /api/v1/proximity/ping`
Sent periodically by the mobile device as an adaptive GPS heartbeat (every 10s or when user moves > 15m).

#### Request Body
```json
{
  "userId": "string (UUID or auth ID)",
  "latitude": 37.774929,
  "longitude": -122.419416,
  "accuracyMeters": 8.5,
  "ghostMode": false
}
```

#### Behavior
- If `ghostMode` is `false`: Updates user position in Redis Geospatial index (`GEOADD rizzbit:active_locations <lon> <lat> <userId>`).
- If `ghostMode` is `true`: Immediately evicts user from Redis geospatial set (`ZREM rizzbit:active_locations <userId>`).

#### Response `200 OK`
```json
{
  "status": "success",
  "message": "Location updated",
  "timestamp": 1729950000000
}
```

---

### `GET /api/v1/proximity/radar`
Queries all active users within the caller's radius.

#### Query Parameters
- `userId`: String (required) - caller's user ID (excluded from results)
- `radiusMeters`: Double (optional, defaults to `1000.0`, max `10000.0`)

#### Response `200 OK`
```json
[
  {
    "userId": "usr_99812",
    "displayName": "Maya",
    "age": 24,
    "avatarUrl": "https://cdn.rizzbit.app/avatars/maya.jpg",
    "bio": "Coffee lover ☕ at the quad.",
    "distanceMeters": 85.4,
    "distanceBand": "In Your Vicinity (< 150m)",
    "activeVenueName": "Campus Coffee Hub",
    "lastSeenTimestamp": 1729950012000
  }
]
```

> **Privacy Rule:** Real GPS coordinates of other users must **never** be exposed in this response. Only obfuscated `distanceMeters` and `distanceBand`.

---

## 🎪 2. Geofence & Hotspot APIs

### `GET /api/v1/geofences/active`
Retrieves all currently active verified venues, campuses, and event geofences.

#### Response `200 OK`
```json
[
  {
    "id": "geo_stanford_01",
    "name": "Stanford Campus",
    "description": "University social circle",
    "zoneType": "CAMPUS",
    "centerLatitude": 37.4275,
    "centerLongitude": -122.1697,
    "radiusMeters": 1500.0,
    "active": true,
    "expiresAt": null
  }
]
```

---

### `POST /api/v1/geofences/check-in`
Checks which geofenced zones the user is currently inside.

#### Request Body
```json
{
  "userId": "string",
  "latitude": 37.4275,
  "longitude": -122.1697
}
```

#### Response `200 OK`
```json
{
  "userId": "string",
  "insideGeofencesCount": 1,
  "matchedZones": [
    {
      "id": "geo_stanford_01",
      "name": "Stanford Campus",
      "zoneType": "CAMPUS",
      "radiusMeters": 1500.0
    }
  ]
}
```

---

## 💬 3. Planned Next-Phase Endpoints

- `POST /api/v1/auth/signup` & `POST /api/v1/auth/login` (JWT Bearer Token)
- `POST /api/v1/matches/spark` (Signal mutual interest)
- `GET /api/v1/matches/active` (Mutual matches lounge)
- `WS /ws/proximity` STOMP subscription for real-time radar ping updates
