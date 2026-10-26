import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { RadarView } from '../components/RadarView';
import { UserCard } from '../components/UserCard';
import { api, NearbyUser } from '../api/client';

// Demo current user ID (in real app, retrieved from auth session/JWT)
const CURRENT_USER_ID = 'demo-user-123';

const RADIUS_OPTIONS = [
  { label: '100m', value: 100 },
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '5km', value: 5000 },
];

export const RadarScreen: React.FC = () => {
  const { location, errorMsg, ghostMode, toggleGhostMode } = useLocation(CURRENT_USER_ID);
  const [radiusMeters, setRadiusMeters] = useState<number>(1000);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Poll or refresh radar matches
  const refreshRadar = async () => {
    if (ghostMode) {
      setNearbyUsers([]);
      return;
    }

    setLoading(true);
    const users = await api.getNearbyUsers(CURRENT_USER_ID, radiusMeters);

    // Provide mock fallback data if backend is not yet started locally
    if (users.length === 0) {
      setNearbyUsers([
        {
          userId: 'user-1',
          displayName: 'Maya',
          age: 24,
          distanceMeters: 85,
          distanceBand: 'In Your Vicinity (< 150m)',
          bio: 'Coffee lover ☕ at the cafe near the quad.',
          activeVenueName: 'Campus Coffee Hub',
        },
        {
          userId: 'user-2',
          displayName: 'Lucas',
          age: 26,
          distanceMeters: 320,
          distanceBand: 'A Short Walk (< 500m)',
          bio: 'Indie music, photography & weekend hikes 🎸',
        },
        {
          userId: 'user-3',
          displayName: 'Chloe',
          age: 23,
          distanceMeters: 780,
          distanceBand: 'Within 1 km',
          bio: 'Here for the festival weekend! Let’s vibe.',
          activeVenueName: 'Main Stage Pavilion',
        },
      ]);
    } else {
      setNearbyUsers(users);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshRadar();
  }, [radiusMeters, ghostMode]);

  const handleSpark = (user: NearbyUser) => {
    Alert.alert('⚡ Spark Sent!', `You signaled interest in ${user.displayName}. If mutual, you'll enter the proximity lounge!`);
  };

  const handlePass = (user: NearbyUser) => {
    setNearbyUsers((prev) => prev.filter((u) => u.userId !== user.userId));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>RizzBit ⚡</Text>
          <Text style={styles.subtitle}>PROXIMITY RADAR</Text>
        </View>

        {/* Ghost Mode Button */}
        <TouchableOpacity
          style={[styles.ghostButton, ghostMode && styles.ghostActiveButton]}
          onPress={toggleGhostMode}
        >
          <Text style={[styles.ghostText, ghostMode && styles.ghostActiveText]}>
            {ghostMode ? '👻 Ghost: ON' : '👁️ Public'}
          </Text>
        </TouchableOpacity>
      </View>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        </View>
      ) : null}

      {/* Radius Selector */}
      <View style={styles.radiusRow}>
        {RADIUS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.label}
            style={[styles.radiusPill, radiusMeters === opt.value && styles.radiusPillActive]}
            onPress={() => setRadiusMeters(opt.value)}
          >
            <Text
              style={[
                styles.radiusPillText,
                radiusMeters === opt.value && styles.radiusPillTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Animated Radar Centerpiece */}
      <View style={styles.radarWrapper}>
        <RadarView nearbyUsers={nearbyUsers} radiusMeters={radiusMeters} ghostMode={ghostMode} />
      </View>

      {/* Nearby Matches Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {ghostMode
            ? 'Radar Disabled (Ghost Mode)'
            : `People In Range (${nearbyUsers.length})`}
        </Text>
        {loading && <ActivityIndicator size="small" color="#ff4b6e" />}
      </View>

      {/* Nearby User Cards List */}
      <FlatList
        data={ghostMode ? [] : nearbyUsers}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <UserCard user={item} onSpark={handleSpark} onPass={handlePass} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {ghostMode
                ? 'Turn off Ghost Mode to discover and be discovered by nearby people.'
                : 'No one detected in this radius right now. Try expanding your range!'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0e15',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ff4b6e',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#656a84',
    letterSpacing: 1.5,
  },
  ghostButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1b1d2a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ghostActiveButton: {
    backgroundColor: 'rgba(150, 150, 160, 0.25)',
    borderColor: '#9696a0',
  },
  ghostText: {
    color: '#a0a3bd',
    fontWeight: '700',
    fontSize: 12,
  },
  ghostActiveText: {
    color: '#fff',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 100, 100, 0.15)',
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    color: '#ff6464',
    fontSize: 12,
  },
  radiusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  radiusPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#171926',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  radiusPillActive: {
    backgroundColor: '#ff4b6e',
    borderColor: '#ff4b6e',
  },
  radiusPillText: {
    color: '#8e92a8',
    fontSize: 12,
    fontWeight: '600',
  },
  radiusPillTextActive: {
    color: '#fff',
  },
  radarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#656a84',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
  },
});
