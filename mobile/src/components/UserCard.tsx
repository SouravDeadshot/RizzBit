import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NearbyUser } from '../api/client';

interface UserCardProps {
  user: NearbyUser;
  onSpark: (user: NearbyUser) => void;
  onPass: (user: NearbyUser) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onSpark, onPass }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {user.displayName.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>
            {user.displayName} {user.age ? `, ${user.age}` : ''}
          </Text>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>📍 {user.distanceBand}</Text>
          </View>
        </View>

        {user.activeVenueName && (
          <Text style={styles.venueText}>🎪 Inside {user.activeVenueName}</Text>
        )}

        <Text style={styles.bio} numberOfLines={2}>
          {user.bio || 'Looking to connect with nearby people!'}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.passButton} onPress={() => onPass(user)}>
            <Text style={styles.passText}>✕ Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sparkButton} onPress={() => onSpark(user)}>
            <Text style={styles.sparkText}>⚡ Spark</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171926',
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2d42',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff4b6e',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  distanceBadge: {
    backgroundColor: 'rgba(255, 75, 110, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  distanceText: {
    color: '#ff4b6e',
    fontSize: 11,
    fontWeight: '600',
  },
  venueText: {
    color: '#00f0ff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  bio: {
    color: '#a0a3bd',
    fontSize: 13,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  passButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#222538',
    alignItems: 'center',
  },
  passText: {
    color: '#8e92a8',
    fontWeight: '600',
    fontSize: 13,
  },
  sparkButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#ff4b6e',
    alignItems: 'center',
  },
  sparkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
