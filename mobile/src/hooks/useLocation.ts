import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { api } from '../api/client';

export function useLocation(userId: string) {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ghostMode, setGhostMode] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Toggle Ghost Mode
  const toggleGhostMode = async () => {
    const nextState = !ghostMode;
    setGhostMode(nextState);

    if (location) {
      await api.pingLocation({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
        ghostMode: nextState,
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function startLocationService() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) setErrorMsg('Location permission was denied. RizzBit requires location to find nearby dates.');
          return;
        }

        // Get initial fix
        const currentLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) return;
        setLocation(currentLoc.coords);
        setIsTracking(true);

        // Send initial heartbeat
        await api.pingLocation({
          userId,
          latitude: currentLoc.coords.latitude,
          longitude: currentLoc.coords.longitude,
          accuracyMeters: currentLoc.coords.accuracy ?? undefined,
          ghostMode,
        });

        // Watch location with adaptive distance filter (battery-friendly: only fires if moved > 15m)
        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 15, // Only trigger if user moves 15 meters
            timeInterval: 10000,   // Check at most every 10 seconds
          },
          async (newLoc) => {
            if (!isMounted) return;
            setLocation(newLoc.coords);
            await api.pingLocation({
              userId,
              latitude: newLoc.coords.latitude,
              longitude: newLoc.coords.longitude,
              accuracyMeters: newLoc.coords.accuracy ?? undefined,
              ghostMode,
            });
          }
        );
      } catch (err: any) {
        if (isMounted) setErrorMsg(err.message || 'Error acquiring location');
      }
    }

    startLocationService();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, [userId, ghostMode]);

  return { location, errorMsg, ghostMode, toggleGhostMode, isTracking };
}
