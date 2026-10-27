import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { DatingZone } from './ZonesListScreen';

export interface CandidateProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[]; // 3 photos
  avatarColor: string;
  hasLikedYou: boolean; // Simulates backend mutual match check
}

const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 'user-rhea',
    name: 'Rhea',
    age: 23,
    bio: 'Waiting for friends to finish shopping. Let’s grab an iced latte right now ☕. Big fan of indie music and design.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    ],
    avatarColor: '#ff4b6e',
    hasLikedYou: true,
  },
  {
    id: 'user-sid',
    name: 'Sid',
    age: 25,
    bio: 'Playing air hockey & basketball hoops. Need a fun player 2 to challenge! 🎳 Winner gets gelato.',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
    ],
    avatarColor: '#00f0ff',
    hasLikedYou: false,
  },
  {
    id: 'user-tanya',
    name: 'Tanya',
    age: 24,
    bio: 'Shoe shopping & grabbed some boba. Free to hang out and grab a quick bite! 🧋',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
    ],
    avatarColor: '#a855f7',
    hasLikedYou: true,
  },
];

interface InsideZoneScreenProps {
  zone: DatingZone;
  onOpenChat?: (matchedUser: CandidateProfile) => void;
}

export const InsideZoneScreen: React.FC<InsideZoneScreenProps> = ({ zone, onOpenChat }) => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [isGhostMode, setIsGhostMode] = useState<boolean>(false);
  const [passedUserIds, setPassedUserIds] = useState<Set<string>>(new Set());

  const currentProfile = candidates[currentIndex];

  /**
   * Cycle photos (3 photos per user)
   */
  const handleNextPhoto = () => {
    if (!currentProfile) return;
    if (currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex((prev) => prev + 1);
    } else {
      setCurrentPhotoIndex(0);
    }
  };

  const handlePrevPhoto = () => {
    if (!currentProfile) return;
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prev) => prev - 1);
    }
  };

  /**
   * PASS: Permanently removes this account from the user's list forever
   */
  const handlePass = () => {
    if (!currentProfile) return;

    const updatedPassed = new Set(passedUserIds);
    updatedPassed.add(currentProfile.id);
    setPassedUserIds(updatedPassed);

    setCandidates((prev) => prev.filter((c) => c.id !== currentProfile.id));
    setCurrentPhotoIndex(0);
  };

  /**
   * LIKE: App stays silent unless mutual match!
   */
  const handleLike = () => {
    if (!currentProfile) return;

    const likedPerson = currentProfile;

    if (likedPerson.hasLikedYou) {
      Alert.alert(
        "🎉 It's a Mutual Match!",
        `You and ${likedPerson.name} both liked each other in ${zone.name}!\n\nOpening your live chat now...`,
        [
          {
            text: 'Open Chat 💬',
            onPress: () => onOpenChat?.(likedPerson),
          },
        ]
      );
    } else {
      setCurrentIndex((prev) => prev + 1);
      setCurrentPhotoIndex(0);
    }
  };

  const toggleGhostMode = () => {
    const nextState = !isGhostMode;
    setIsGhostMode(nextState);
    Alert.alert(
      nextState ? '👻 Ghost Mode ON' : '👁️ Visible Mode',
      nextState
        ? 'You are now invisible to others in this zone. You can still browse and like daters!'
        : 'Your profile is now visible to other daters inside this zone.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.liveBeacon} />
            <Text style={styles.liveBeaconText}>YOU ARE ONLINE</Text>
          </View>
          <Text style={styles.zoneTitle}>{zone.name}</Text>
        </View>

        {/* Ghost Mode Toggle */}
        <TouchableOpacity
          style={[styles.ghostButton, isGhostMode && styles.ghostButtonActive]}
          onPress={toggleGhostMode}
        >
          <Text style={styles.ghostIcon}>{isGhostMode ? '👻' : '👁️'}</Text>
          <Text style={[styles.ghostText, isGhostMode && styles.ghostTextActive]}>
            {isGhostMode ? 'Ghost: ON' : 'Visible'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ghost Mode Active Notice */}
      {isGhostMode && (
        <View style={styles.ghostNotice}>
          <Text style={styles.ghostNoticeText}>
            👻 <Text style={styles.boldWhite}>Ghost Mode Active:</Text> You are invisible in this zone, but you can still view & like profiles!
          </Text>
        </View>
      )}

      {/* View One Full Profile at a Time */}
      {currentProfile ? (
        <View style={styles.profileContainer}>
          <ScrollView
            style={styles.profileScroll}
            contentContainerStyle={styles.profileScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Multi-Photo Carousel Card with Segmented Story Bars (Zero Text On Photo) */}
            <View style={styles.photoWrapper}>
              {/* 3 Segmented Photo Progress Bars */}
              <View style={styles.photoStoryBars}>
                {currentProfile.photos.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.photoBarSegment,
                      idx === currentPhotoIndex ? styles.photoBarActive : styles.photoBarInactive,
                    ]}
                  />
                ))}
              </View>

              {/* Clean Photo Display (No text description) */}
              <View
                style={[styles.photoFallback, { backgroundColor: currentProfile.avatarColor }]}
              >
                <Text style={styles.avatarLetter}>
                  {currentProfile.name.charAt(0)}
                </Text>
              </View>

              {/* Left / Right Tap zones to cycle photos */}
              <TouchableOpacity
                style={styles.tapZoneLeft}
                onPress={handlePrevPhoto}
                activeOpacity={1}
              />
              <TouchableOpacity
                style={styles.tapZoneRight}
                onPress={handleNextPhoto}
                activeOpacity={1}
              />
            </View>

            {/* Profile Info Details (Clean: Name, Age & Bio only) */}
            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>
                  {currentProfile.name}, <Text style={styles.profileAge}>{currentProfile.age}</Text>
                </Text>
              </View>

              {/* Bio */}
              <View style={styles.bioCard}>
                <Text style={styles.bioText}>{currentProfile.bio}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Footer: ✕ Pass vs ❤️ Like */}
          <View style={styles.actionFooter}>
            <TouchableOpacity style={styles.passButton} onPress={handlePass}>
              <Text style={styles.passIcon}>✕</Text>
              <Text style={styles.passLabel}>Pass</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
              <Text style={styles.likeIcon}>❤️</Text>
              <Text style={styles.likeLabel}>Like</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={styles.emptyTitle}>You've seen everyone in this zone!</Text>
          <Text style={styles.emptySub}>
            New singles entering {zone.name} will appear here automatically.
          </Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Text style={styles.navIcon}>⚡</Text>
          <Text style={styles.navLabelActive}>In-Zone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Chats</Text>
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
    backgroundColor: '#0c0715',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 75, 110, 0.15)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveBeacon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  liveBeaconText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  zoneTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b122c',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
  },
  ghostButtonActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.25)',
    borderColor: '#a855f7',
  },
  ghostIcon: {
    fontSize: 13,
  },
  ghostText: {
    color: '#a0a3bd',
    fontSize: 12,
    fontWeight: '700',
  },
  ghostTextActive: {
    color: '#e9d5ff',
  },
  ghostNotice: {
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168, 85, 247, 0.3)',
  },
  ghostNoticeText: {
    color: '#d8b4fe',
    fontSize: 11,
    lineHeight: 15,
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: '700',
  },
  profileContainer: {
    flex: 1,
  },
  profileScroll: {
    flex: 1,
  },
  profileScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  photoWrapper: {
    height: 400,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 75, 110, 0.35)',
  },
  photoStoryBars: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
    zIndex: 20,
  },
  photoBarSegment: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
  },
  photoBarActive: {
    backgroundColor: '#ffffff',
  },
  photoBarInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  photoFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 90,
    fontWeight: '900',
  },
  tapZoneLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '40%',
    zIndex: 10,
  },
  tapZoneRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '60%',
    zIndex: 10,
  },
  profileDetails: {
    marginTop: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
  },
  profileAge: {
    color: '#cbd5e1',
    fontWeight: '500',
  },
  bioCard: {
    backgroundColor: '#180e28',
    borderRadius: 18,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bioText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  actionFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#120822',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 75, 110, 0.15)',
    gap: 16,
    alignItems: 'center',
  },
  passButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#241436',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  passIcon: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '900',
  },
  passLabel: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '800',
  },
  likeButton: {
    flex: 1.5,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#ff4b6e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ff4b6e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  likeIcon: {
    fontSize: 18,
  },
  likeLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#10091d',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 75, 110, 0.2)',
  },
  navItem: {
    alignItems: 'center',
  },
  navItemActive: {
    alignItems: 'center',
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
    fontWeight: '800',
    marginTop: 2,
  },
});
