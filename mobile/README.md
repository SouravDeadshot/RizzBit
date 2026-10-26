# RizzBit Mobile (Expo / React Native) 📱⚡

The cross-platform mobile client for RizzBit, built with **React Native**, **Expo**, and **TypeScript**.

---

## 🌟 Features Included

- **📍 Real-Time Proximity Radar:**
  - Dynamic radar range selector (`100m`, `500m`, `1km`, `5km`).
  - Animated pulsing radar canvas displaying candidate blips relative to distance.
- **🛡️ Privacy & Safety:**
  - One-tap **Ghost Mode** toggle that instantly removes your location from the Redis index.
  - Distances categorized into privacy bands (`< 50m`, `< 150m`, `Within 1 km`) to prevent exact triangulation.
- **⚡ Proximity Sparks:**
  - Signal instant mutual interest to nearby users.
- **🔋 Battery-Adaptive GPS:**
  - Uses `expo-location` with distance filtering (`15m` delta) so battery isn't drained while stationary.

---

## 🚀 Running Locally

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Start the Expo Dev Server

```bash
npm start
```

### 3. Test on a Device

- **Physical Device:** Install **Expo Go** from the App Store (iOS) or Google Play (Android), and scan the QR code displayed in your terminal.
- **iOS Simulator:** Press `i` in the terminal (macOS only).
- **Android Emulator:** Press `a` in the terminal.
- **Web Browser:** Press `w` in the terminal.

---

## 🔗 Connecting to the Backend

By default:
- Android emulators connect to: `http://10.0.2.2:8080`
- iOS simulators connect to: `http://localhost:8080`
- Physical devices: Set `EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:8080` in `mobile/.env`.
