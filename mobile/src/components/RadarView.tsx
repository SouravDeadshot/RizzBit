import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import { NearbyUser } from '../api/client';

const { width } = Dimensions.get('window');
const RADAR_SIZE = width * 0.75;

interface RadarViewProps {
  nearbyUsers: NearbyUser[];
  radiusMeters: number;
  ghostMode: boolean;
}

export const RadarView: React.FC<RadarViewProps> = ({ nearbyUsers, radiusMeters, ghostMode }) => {
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (ghostMode) return;

    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const pulse1 = createPulse(pulseAnim1, 0);
    const pulse2 = createPulse(pulseAnim2, 1200);

    pulse1.start();
    pulse2.start();

    return () => {
      pulse1.stop();
      pulse2.stop();
    };
  }, [pulseAnim1, pulseAnim2, ghostMode]);

  return (
    <View style={styles.container}>
      {/* Outer boundary ring */}
      <View style={[styles.ring, styles.outerRing]} />

      {/* Middle range ring */}
      <View style={[styles.ring, styles.midRing]} />

      {/* Close proximity ring */}
      <View style={[styles.ring, styles.innerRing]} />

      {/* Animated Pulse Waves */}
      {!ghostMode && (
        <>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [
                  {
                    scale: pulseAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1],
                    }),
                  },
                ],
                opacity: pulseAnim1.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [0.8, 0.4, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [
                  {
                    scale: pulseAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1],
                    }),
                  },
                ],
                opacity: pulseAnim2.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [0.8, 0.4, 0],
                }),
              },
            ]}
          />
        </>
      )}

      {/* Center user dot (You) */}
      <View style={[styles.centerDot, ghostMode && styles.ghostCenterDot]}>
        <View style={styles.centerDotCore} />
      </View>

      {/* Nearby candidate blips */}
      {!ghostMode &&
        nearbyUsers.slice(0, 8).map((user, index) => {
          // Normalize position on radar based on distance
          const distanceRatio = Math.min(1, Math.max(0.15, user.distanceMeters / radiusMeters));
          const angle = (index * (360 / Math.min(nearbyUsers.length, 8)) * Math.PI) / 180;
          const radius = (RADAR_SIZE / 2 - 20) * distanceRatio;

          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <View
              key={user.userId}
              style={[
                styles.blip,
                {
                  transform: [{ translateX: x }, { translateY: y }],
                },
              ]}
            >
              <View style={styles.blipCore} />
            </View>
          );
        })}

      {/* Radius Label */}
      <Text style={styles.radiusLabel}>
        {ghostMode ? '👻 GHOST MODE ON' : `Radar: ${(radiusMeters / 1000).toFixed(1)} km`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  ring: {
    position: 'absolute',
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 110, 0.15)',
  },
  outerRing: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderColor: 'rgba(255, 75, 110, 0.35)',
  },
  midRing: {
    width: RADAR_SIZE * 0.66,
    height: RADAR_SIZE * 0.66,
  },
  innerRing: {
    width: RADAR_SIZE * 0.33,
    height: RADAR_SIZE * 0.33,
  },
  pulseRing: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ff4b6e',
    backgroundColor: 'rgba(255, 75, 110, 0.08)',
  },
  centerDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 75, 110, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  ghostCenterDot: {
    backgroundColor: 'rgba(150, 150, 160, 0.3)',
  },
  centerDotCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4b6e',
  },
  blip: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 240, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blipCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00f0ff',
  },
  radiusLabel: {
    position: 'absolute',
    bottom: -15,
    color: '#8e92a8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
});
