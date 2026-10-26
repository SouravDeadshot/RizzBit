import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2, iOS simulator uses localhost, real device uses LAN IP
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST;

export interface LocationPingPayload {
  userId: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  ghostMode: boolean;
}

export interface NearbyUser {
  userId: string;
  displayName: string;
  age?: number;
  avatarUrl?: string;
  bio?: string;
  distanceMeters: number;
  distanceBand: string;
  activeVenueName?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  description?: string;
  zoneType: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  active: boolean;
}

export const api = {
  /**
   * Send periodic GPS heartbeat to backend (Redis GEO)
   */
  async pingLocation(payload: LocationPingPayload): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/proximity/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      console.warn('[RizzBit API] Ping failed (server offline or unreachable):', err);
      return false;
    }
  },

  /**
   * Fetch nearby candidates on radar within radius (meters)
   */
  async getNearbyUsers(userId: string, radiusMeters: number): Promise<NearbyUser[]> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/proximity/radar?userId=${encodeURIComponent(userId)}&radiusMeters=${radiusMeters}`
      );
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.warn('[RizzBit API] Radar fetch failed:', err);
      return [];
    }
  },

  /**
   * Fetch active geofenced hotspots
   */
  async getActiveGeofences(): Promise<GeofenceZone[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/geofences/active`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.warn('[RizzBit API] Geofences fetch failed:', err);
      return [];
    }
  },
};
