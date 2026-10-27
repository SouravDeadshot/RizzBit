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
  Modal,
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
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [isSourceModalVisible, setIsSourceModalVisible] = useState<boolean>(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState<boolean>(false);
  const [capturedPhotoPreview, setCapturedPhotoPreview] = useState<string | null>(null);

  const sampleLibraryPhotos = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
  ];

  const sampleCameraPhotos = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
  ];

  const handleOpenPhotoOptions = (slotIndex: number) => {
    setActiveSlot(slotIndex);
    setIsSourceModalVisible(true);
  };

  const handleSelectCamera = () => {
    setIsSourceModalVisible(false);
    setCapturedPhotoPreview(null);
    setIsCameraModalVisible(true);
  };

  const handleSnapPhoto = () => {
    const nextPhoto = sampleCameraPhotos[photos.length % sampleCameraPhotos.length];
    setCapturedPhotoPreview(nextPhoto);
  };

  const handleUseCapturedPhoto = () => {
    if (capturedPhotoPreview) {
      setPhotos((prev) => {
        const next = [...prev];
        next[activeSlot] = capturedPhotoPreview;
        return next;
      });
      setIsCameraModalVisible(false);
      setCapturedPhotoPreview(null);
    }
  };

  const handleSelectGallery = () => {
    setIsSourceModalVisible(false);
    const chosen = sampleLibraryPhotos[photos.length % sampleLibraryPhotos.length];
    setPhotos((prev) => {
      const next = [...prev];
      next[activeSlot] = chosen;
      return next;
    });
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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Create Your Profile</Text>
          <Text style={styles.headerSubtitle}>Daters in the zone will see this info</Text>
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
            <Text style={styles.sectionHint}>Camera or gallery</Text>
          </View>

          <View style={styles.photosGrid}>
            {/* Slot 1: Main Photo */}
            <TouchableOpacity
              style={[styles.photoSlot, styles.mainPhotoSlot]}
              onPress={() => (photos[0] ? handleRemovePhoto(0) : handleOpenPhotoOptions(0))}
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
                      : handleOpenPhotoOptions(slotIdx)
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
          <Text style={styles.sectionLabel}>About You (Short Bio)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Grabbing iced lattes, checking out sneakers, or up for a quick arcade game ☕🎳"
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

      {/* Photo Options Modal (Camera vs Gallery) */}
      <Modal
        visible={isSourceModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSourceModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalSheetTitle}>Add Profile Photo</Text>
            <Text style={styles.modalSheetSubtitle}>
              Take a fresh picture with your camera or select from library
            </Text>

            <TouchableOpacity style={styles.modalOptionBtn} onPress={handleSelectCamera}>
              <Text style={styles.modalOptionIcon}>📷</Text>
              <View>
                <Text style={styles.modalOptionTitle}>Take Photo with Camera</Text>
                <Text style={styles.modalOptionSub}>Use front or rear camera</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOptionBtn} onPress={handleSelectGallery}>
              <Text style={styles.modalOptionIcon}>🖼️</Text>
              <View>
                <Text style={styles.modalOptionTitle}>Choose from Photo Library</Text>
                <Text style={styles.modalOptionSub}>Select existing picture</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsSourceModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Camera Capture Modal */}
      <Modal
        visible={isCameraModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setIsCameraModalVisible(false)}
      >
        <SafeAreaView style={styles.cameraContainer}>
          {/* Camera Top Bar */}
          <View style={styles.cameraTopBar}>
            <TouchableOpacity
              style={styles.cameraCloseBtn}
              onPress={() => setIsCameraModalVisible(false)}
            >
              <Text style={styles.cameraCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Camera</Text>
            <Text style={styles.cameraFlashIcon}>⚡</Text>
          </View>

          {/* Camera Viewfinder */}
          <View style={styles.viewfinder}>
            {capturedPhotoPreview ? (
              <View style={styles.capturedPreviewBox}>
                <View style={styles.capturedPhotoCanvas}>
                  <Text style={styles.capturedPhotoEmoji}>📸</Text>
                  <Text style={styles.capturedPhotoText}>Photo Captured!</Text>
                </View>
              </View>
            ) : (
              <View style={styles.liveViewfinderBox}>
                {/* Viewfinder Target / Guides */}
                <View style={styles.viewfinderGrid}>
                  <View style={styles.focusFrame}>
                    <Text style={styles.focusFaceHint}>Position your face inside frame</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Camera Bottom Controls */}
          <View style={styles.cameraBottomBar}>
            {capturedPhotoPreview ? (
              <View style={styles.cameraActionsRow}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={() => setCapturedPhotoPreview(null)}
                >
                  <Text style={styles.retakeBtnText}>↺ Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.usePhotoBtn}
                  onPress={handleUseCapturedPhoto}
                >
                  <Text style={styles.usePhotoBtnText}>Use Photo ✓</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.shutterRow}>
                <View style={{ width: 44 }} />
                <TouchableOpacity style={styles.shutterButton} onPress={handleSnapPhoto}>
                  <View style={styles.shutterInner} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.flipBtn}>
                  <Text style={styles.flipText}>🔄</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
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
  headerInfo: {
    flex: 1,
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
  /* Action Sheet Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#171926',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#373a4d',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalSheetTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  modalSheetSubtitle: {
    color: '#8b8e9f',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
  },
  modalOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202334',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  modalOptionIcon: {
    fontSize: 24,
  },
  modalOptionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOptionSub: {
    color: '#8b8e9f',
    fontSize: 11,
    marginTop: 1,
  },
  modalCancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 6,
  },
  modalCancelText: {
    color: '#8b8e9f',
    fontSize: 14,
    fontWeight: '700',
  },
  /* Camera Viewfinder Modal */
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cameraCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cameraFlashIcon: {
    color: '#fbbf24',
    fontSize: 18,
  },
  viewfinder: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#12131a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  liveViewfinderBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderGrid: {
    width: '80%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  focusFrame: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  focusFaceHint: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  capturedPreviewBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedPhotoCanvas: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedPhotoEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  capturedPhotoText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
  },
  cameraBottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 16,
  },
  shutterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shutterButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4b6e',
  },
  flipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    fontSize: 20,
  },
  cameraActionsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: '#202334',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  retakeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  usePhotoBtn: {
    flex: 1,
    backgroundColor: '#ff4b6e',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  usePhotoBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
