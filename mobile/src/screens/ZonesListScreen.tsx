import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { CandidateProfile } from './InsideZoneScreen';

export interface DatingZone {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  onlineCount: number;
  popularSpots: string;
  latitude: number;
  longitude: number;
}

const DEFAULT_MATCHES: CandidateProfile[] = [
  {
    id: 'user-rhea',
    name: 'Rhea',
    age: 23,
    bio: 'Waiting for friends to finish shopping. Let’s grab an iced latte right now ☕.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    ],
    avatarColor: '#ff4b6e',
    avatarLetter: 'R',
    hasLikedYou: true,
    matchedZoneName: 'Nexus Grand Mall',
    lastMessage: 'Awesome, see you there! Look for me in the terrace lounge 👋',
    lastMessageTime: '5m ago',
  },
];

const ALL_MOCK_ZONES: DatingZone[] = [
  {
    id: 'zone-1',
    name: 'Nexus Grand Mall',
    type: 'Shopping & Dining Zone',
    distanceKm: 1.2,
    onlineCount: 42,
    popularSpots: 'Starbucks, Food Court & Central Atrium',
    latitude: 12.9352,
    longitude: 77.6245,
  },
  {
    id: 'zone-2',
    name: 'Phoenix Marketcity',
    type: 'Lifestyle & Entertainment Zone',
    distanceKm: 3.8,
    onlineCount: 31,
    popularSpots: 'Rooftop Cafes, Cineplex & Courtyard',
    latitude: 12.9961,
    longitude: 77.6963,
  },
  {
    id: 'zone-3',
    name: 'Forum South Galleria',
    type: 'Boutique Promenade',
    distanceKm: 8.4,
    onlineCount: 24,
    popularSpots: 'Boba Bars & Fashion Walk',
    latitude: 12.8715,
    longitude: 77.5458,
  },
  {
    id: 'zone-4',
    name: 'Indiranagar Social Street',
    type: 'Nightlife & Cafe Zone',
    distanceKm: 14.5,
    onlineCount: 56,
    popularSpots: '12th Main Cafes & Brewpubs',
    latitude: 12.9719,
    longitude: 77.6412,
  },
  {
    id: 'zone-5',
    name: 'Cyber City Hub',
    type: 'Campus & Food Promenade',
    distanceKm: 28.0,
    onlineCount: 68,
    popularSpots: 'Open Amphitheatre & Food Walk',
    latitude: 12.8452,
    longitude: 77.6602,
  },
  {
    id: 'zone-6',
    name: 'Airport Leisure Boulevard',
    type: 'Transit & Lounge Zone',
    distanceKm: 42.0,
    onlineCount: 37,
    popularSpots: 'Garden Pavilions & Coffee Terraces',
    latitude: 13.1986,
    longitude: 77.7066,
  },
  {
    id: 'zone-7',
    name: 'Hilltop Weekend Valley',
    type: 'Resort & Getaway Zone',
    distanceKm: 78.0,
    onlineCount: 19,
    popularSpots: 'Valley Overlook & Campfire Cafe',
    latitude: 13.3702,
    longitude: 77.6835,
  },
];

const PERIMETER_OPTIONS = [10, 20, 50, 100];

interface ZonesListScreenProps {
  onEnterZone?: (zone: DatingZone) => void;
  matches?: CandidateProfile[];
  onOpenChat?: (matchedUser: CandidateProfile) => void;
  initialTab?: 'zones' | 'chats';
}

export const ZonesListScreen: React.FC<ZonesListScreenProps> = ({
  onEnterZone,
  matches = DEFAULT_MATCHES,
  onOpenChat,
  initialTab = 'zones',
}) => {
  const [activeTab, setActiveTab] = useState<'zones' | 'chats'>(initialTab);
  const [selectedPerimeter, setSelectedPerimeter] = useState<number>(20);

  // Filter zones within selected perimeter
  const filteredZones = ALL_MOCK_ZONES.filter(
    (zone) => zone.distanceKm <= selectedPerimeter
  );

  /**
   * Launch default Apple Maps or Google Maps directly for turn-by-turn navigation
   */
  const handleOpenMaps = (zone: DatingZone) => {
    const latLng = `${zone.latitude},${zone.longitude}`;
    const label = encodeURIComponent(zone.name);

    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latLng}`,
    });

    Linking.canOpenURL(url || '')
      .then((supported) => {
        if (supported && url) {
          Linking.openURL(url);
        } else {
          Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latLng}`);
        }
      })
      .catch(() => {
        Alert.alert('Navigation', `Opening navigation to ${zone.name}...`);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Offline Theme */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>RizzBit ⚡</Text>
          <Text style={styles.subtitle}>
            {activeTab === 'zones' ? 'NEAREST DATING ZONES' : 'ACTIVE CHATS & MATCHES'}
          </Text>
        </View>

        {/* Offline Status Badge */}
        <View style={styles.offlineStatusBadge}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineStatusText}>Outside Zone • Offline</Text>
        </View>
      </View>

      {activeTab === 'zones' ? (
        /* ================= TAB 1: DATING ZONES LIST ================= */
        <View style={styles.tabContent}>
          {/* Explanatory Banner */}
          <View style={styles.offlineInfoBanner}>
            <View style={styles.bannerHeader}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.bannerTitle}>Matches are locked</Text>
            </View>
            <Text style={styles.bannerText}>
              Travel to any zone below. When you physically cross into the perimeter, your profile turns{' '}
              <Text style={styles.boldText}>Online</Text> and matching unlocks!
            </Text>
          </View>

          {/* Perimeter Range Filter Selector (10km / 20km / 50km / 100km) */}
          <View style={styles.perimeterContainer}>
            <Text style={styles.perimeterTitle}>SEARCH PERIMETER:</Text>
            <View style={styles.perimeterPillsRow}>
              {PERIMETER_OPTIONS.map((km) => (
                <TouchableOpacity
                  key={km}
                  style={[
                    styles.perimeterPill,
                    selectedPerimeter === km && styles.perimeterPillActive,
                  ]}
                  onPress={() => setSelectedPerimeter(km)}
                >
                  <Text
                    style={[
                      styles.perimeterPillText,
                      selectedPerimeter === km && styles.perimeterPillTextActive,
                    ]}
                  >
                    Within {km} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Nearest Dating Zones ({filteredZones.length})
            </Text>
            <Text style={styles.cityPill}>📍 In Range</Text>
          </View>

          {/* Zones List */}
          <FlatList
            data={filteredZones}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.zoneCard}>
                <View style={styles.zoneTopRow}>
                  <View style={styles.zoneInfo}>
                    <Text style={styles.zoneType}>{item.type.toUpperCase()}</Text>
                    <Text style={styles.zoneName}>{item.name}</Text>
                    <Text style={styles.popularSpotsText}>✨ {item.popularSpots}</Text>
                  </View>

                  {/* Only shows KM. Tapping launches maps directly */}
                  <TouchableOpacity
                    style={styles.distanceBox}
                    onPress={() => handleOpenMaps(item)}
                  >
                    <Text style={styles.distanceKmText}>{item.distanceKm} km</Text>
                    <Text style={styles.navMapIcon}>🗺️ Navigate</Text>
                  </TouchableOpacity>
                </View>

                {/* Card Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlinePulseDot} />
                    <Text style={styles.onlineCountText}>
                      {item.onlineCount} singles online
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.enterButton}
                    onPress={() => onEnterZone?.(item)}
                  >
                    <Text style={styles.enterButtonText}>Arrive Here →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        /* ================= TAB 2: ACTIVE MATCHED CHATS ================= */
        <View style={styles.tabContent}>
          {/* Chats Banner */}
          <View style={styles.chatInfoBanner}>
            <View style={styles.bannerHeader}>
              <Text style={styles.lockIcon}>💬</Text>
              <Text style={styles.bannerTitle}>Matched Chats Stay Active Anywhere</Text>
            </View>
            <Text style={styles.bannerText}>
              Even outside dating zones, all your matched conversations remain live so you can continue chatting and plan in-person dates!
            </Text>
          </View>

          <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.matchesListContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.matchCard}
                onPress={() => onOpenChat?.(item)}
                activeOpacity={0.7}
              >
                {/* Avatar with status */}
                <View style={[styles.matchAvatar, { backgroundColor: item.avatarColor }]}>
                  <Text style={styles.matchAvatarLetter}>
                    {item.avatarLetter || item.name.charAt(0)}
                  </Text>
                  <View style={styles.matchOnlineDot} />
                </View>

                {/* Match Information */}
                <View style={styles.matchInfoCol}>
                  <View style={styles.matchNameRow}>
                    <Text style={styles.matchName}>{item.name}, {item.age}</Text>
                    <Text style={styles.matchTimeText}>{item.lastMessageTime || 'Just now'}</Text>
                  </View>

                  <Text style={styles.matchZoneTag}>
                    📍 Met at {item.matchedZoneName || 'Nexus Grand Mall'}
                  </Text>

                  <Text style={styles.matchSnippet} numberOfLines={1}>
                    {item.lastMessage || 'Say hi and continue chatting! 👋'}
                  </Text>
                </View>

                {/* Open Chat Pill */}
                <View style={styles.openChatPill}>
                  <Text style={styles.openChatPillText}>Chat →</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyChatsBox}>
                <Text style={styles.emptyChatsIcon}>💬</Text>
                <Text style={styles.emptyChatsTitle}>No Matched Chats Yet</Text>
                <Text style={styles.emptyChatsDesc}>
                  Travel to a nearby Dating Zone, browse active profiles, and mutually like someone to start chatting!
                </Text>
                <TouchableOpacity
                  style={styles.browseZonesBtn}
                  onPress={() => setActiveTab('zones')}
                >
                  <Text style={styles.browseZonesBtnText}>Explore Nearest Zones →</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={activeTab === 'zones' ? styles.navItemActive : styles.navItem}
          onPress={() => setActiveTab('zones')}
        >
          <Text style={styles.navIcon}>🏬</Text>
          <Text style={activeTab === 'zones' ? styles.navLabelActive : styles.navLabel}>
            Zones
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={activeTab === 'chats' ? styles.navItemActive : styles.navItem}
          onPress={() => setActiveTab('chats')}
        >
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>💬</Text>
            {matches.length > 0 && (
              <View style={styles.navCountBadge}>
                <Text style={styles.navCountBadgeText}>{matches.length}</Text>
              </View>
            )}
          </View>
          <Text style={activeTab === 'chats' ? styles.navLabelActive : styles.navLabel}>
            Chats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 10,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ff4b6e',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#656a84',
    letterSpacing: 1.5,
  },
  tabContent: {
    flex: 1,
  },
  offlineStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1d2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8e92a8',
  },
  offlineStatusText: {
    color: '#a0a3bd',
    fontSize: 11,
    fontWeight: '700',
  },
  offlineInfoBanner: {
    backgroundColor: '#171926',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  lockIcon: {
    fontSize: 14,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bannerText: {
    color: '#8e92a8',
    fontSize: 12,
    lineHeight: 17,
  },
  boldText: {
    color: '#10b981',
    fontWeight: '700',
  },
  perimeterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  perimeterTitle: {
    color: '#656a84',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  perimeterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  perimeterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#171926',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  perimeterPillActive: {
    backgroundColor: '#ff4b6e',
    borderColor: '#ff4b6e',
  },
  perimeterPillText: {
    color: '#8e92a8',
    fontSize: 11,
    fontWeight: '700',
  },
  perimeterPillTextActive: {
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  cityPill: {
    color: '#8e92a8',
    fontSize: 11,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  zoneCard: {
    backgroundColor: '#171926',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  zoneTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  zoneInfo: {
    flex: 1,
    paddingRight: 10,
  },
  zoneType: {
    color: '#ff4b6e',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  zoneName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  popularSpotsText: {
    color: '#a0a3bd',
    fontSize: 12,
    marginTop: 4,
  },
  distanceBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  distanceKmText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  navMapIcon: {
    color: '#00f0ff',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlinePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  onlineCountText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  enterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ff4b6e',
  },
  enterButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#11131c',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  navItem: {
    alignItems: 'center',
  },
  navItemActive: {
    alignItems: 'center',
  },
  navIconContainer: {
    position: 'relative',
  },
  navCountBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ff4b6e',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCountBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  navIcon: {
    fontSize: 18,
  },
  navLabel: {
    color: '#656a84',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#ff4b6e',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  /* Chats Tab Styles */
  chatInfoBanner: {
    backgroundColor: '#171926',
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 110, 0.2)',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
  },
  matchesListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171926',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  matchAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  matchAvatarLetter: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  matchOnlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#171926',
  },
  matchInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  matchNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  matchTimeText: {
    color: '#656a84',
    fontSize: 11,
    fontWeight: '600',
  },
  matchZoneTag: {
    color: '#ff4b6e',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  matchSnippet: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  openChatPill: {
    backgroundColor: '#ff4b6e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  openChatPillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyChatsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyChatsIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyChatsTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyChatsDesc: {
    color: '#8e92a8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  browseZonesBtn: {
    backgroundColor: '#ff4b6e',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  browseZonesBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
