import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

interface ProfileSetupScreenProps {
  onProfileComplete?: (profileData: UserProfileData) => void;
  onBack?: () => void;
}

export interface UserProfileData {
  displayName: string;
  birthDate: string;
  gender: string;
  interestedIn: string;
  bio: string;
  photos: string[];
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  onProfileComplete,
  onBack,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [birthDate, setBirthDate] = useState('2001-05-18');
  const [gender, setGender] = useState<'Woman' | 'Man' | 'Non-binary'>('Woman');
  const [interestedIn, setInterestedIn] = useState<'Men' | 'Women' | 'Everyone'>('Everyone');
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  ]);

  const handleAddPhoto = (slotIndex: number) => {
    // In production, launches expo-image-picker
    Alert.alert(
      'Photo Upload',
      'Upload a clear face photo so your matches can recognize you at the mall venue.',
      [
        {
          text: 'Use Sample Photo',
          onPress: () => {
            const samplePhotos = [
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
              'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
            ];
            const nextPhoto = samplePhotos[photos.length % samplePhotos.length];
            setPhotos((prev) => [...prev, nextPhoto]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (!displayName.trim()) {
      Alert.alert('Name Required', 'Please enter your first name.');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Photo Required', 'Please upload at least 1 photo so daters can recognize you.');
      return;
    }

    const profile: UserProfileData = {
      displayName: displayName.trim(),
      birthDate,
      gender,
      interestedIn,
      bio: bio.trim(),
      photos,
    };

    onProfileComplete?.(profile);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.headerTitle}>Create Your Profile</Text>
          <Text style={styles.headerSubtitle}>Daters in the mall will see this info</Text>
        </View>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 2</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Photos (At least 1 required)</Text>
            <Text style={styles.sectionHint}>Clear face photo is best</Text>
          </View>

          <View style={styles.photosGrid}>
            {/* Slot 1: Main Photo */}
            <TouchableOpacity
              style={[styles.photoSlot, styles.mainPhotoSlot]}
              onPress={() => (photos[0] ? handleRemovePhoto(0) : handleAddPhoto(0))}
              activeOpacity={0.8}
            >
              {photos[0] ? (
                <View style={styles.photoContainer}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarLetter}>{displayName.charAt(0) || '👤'}</Text>
                  </View>
                  <View style={styles.mainBadge}>
                    <Text style={styles.mainBadgeText}>Main Face Photo</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeBadge}
                    onPress={() => handleRemovePhoto(0)}
                  >
                    <Text style={styles.removeBadgeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.emptySlotContent}>
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadText}>+ Add Main Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Slot 2 & Slot 3 */}
            <View style={styles.sidePhotosColumn}>
              {[1, 2].map((slotIdx) => (
                <TouchableOpacity
                  key={slotIdx}
                  style={styles.smallPhotoSlot}
                  onPress={() =>
                    photos[slotIdx]
                      ? handleRemovePhoto(slotIdx)
                      : handleAddPhoto(slotIdx)
                  }
                  activeOpacity={0.8}
                >
                  {photos[slotIdx] ? (
                    <View style={styles.photoContainer}>
                      <View style={styles.smallAvatarPlaceholder}>
                        <Text style={styles.smallAvatarLetter}>✓</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeBadge}
                        onPress={() => handleRemovePhoto(slotIdx)}
                      >
                        <Text style={styles.removeBadgeText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.emptySlotContent}>
                      <Text style={styles.smallUploadIcon}>+</Text>
                      <Text style={styles.smallUploadText}>Photo {slotIdx + 1}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Section 2: First Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Jordan"
            placeholderTextColor="#555870"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        {/* Section 3: Birthday / Age */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date of Birth (Must be 18+)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#555870"
            value={birthDate}
            onChangeText={setBirthDate}
          />
          <Text style={styles.fieldNote}>Your exact birthday is private; only your age is shown.</Text>
        </View>

        {/* Section 4: Gender Identity */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>I identify as</Text>
          <View style={styles.pillRow}>
            {(['Woman', 'Man', 'Non-binary'] as const).map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.pill, gender === item && styles.pillActive]}
                onPress={() => setGender(item)}
              >
                <Text style={[styles.pillText, gender === item && styles.pillTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 5: Whom to show */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Looking to match with</Text>
          <View style={styles.pillRow}>
            {(['Women', 'Men', 'Everyone'] as const).map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.pill, interestedIn === item && styles.pillActive]}
                onPress={() => setInterestedIn(item)}
              >
                <Text
                  style={[styles.pillText, interestedIn === item && styles.pillTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section 6: Bio / Hangout Vibe */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mall Hangout Vibe (Short Bio)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Grabbing iced lattes at Starbucks, checking out sneakers, or up for a quick arcade game ☕🎳"
            placeholderTextColor="#555870"
            multiline
            numberOfLines={3}
            value={bio}
            onChangeText={setBio}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Find Nearby Zones →</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    paddingRight: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#8b8e9f',
    fontSize: 12,
    marginTop: 2,
  },
  stepBadge: {
    backgroundColor: 'rgba(255, 75, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepBadgeText: {
    color: '#ff4b6e',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionHint: {
    color: '#8b8e9f',
    fontSize: 11,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  photoSlot: {
    backgroundColor: '#171926',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  mainPhotoSlot: {
    flex: 2,
    height: 180,
    borderColor: 'rgba(255, 75, 110, 0.4)',
    backgroundColor: 'rgba(255, 75, 110, 0.05)',
  },
  sidePhotosColumn: {
    flex: 1,
    gap: 12,
  },
  smallPhotoSlot: {
    flex: 1,
    backgroundColor: '#171926',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#222538',
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff4b6e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  smallAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2e324c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarLetter: {
    color: '#00f0ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mainBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  removeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptySlotContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  uploadText: {
    color: '#ff4b6e',
    fontSize: 12,
    fontWeight: '700',
  },
  smallUploadIcon: {
    color: '#8b8e9f',
    fontSize: 20,
    fontWeight: 'bold',
  },
  smallUploadText: {
    color: '#8b8e9f',
    fontSize: 10,
  },
  input: {
    backgroundColor: '#171926',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  fieldNote: {
    color: '#656a84',
    fontSize: 11,
    marginTop: 6,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#171926',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pillActive: {
    backgroundColor: '#ff4b6e',
    borderColor: '#ff4b6e',
  },
  pillText: {
    color: '#8b8e9f',
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: '#ff4b6e',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#ff4b6e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
