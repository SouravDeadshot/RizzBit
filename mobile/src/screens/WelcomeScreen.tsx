import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from 'react-native';

export interface Country {
  name: string;
  code: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿' },
];

interface WelcomeScreenProps {
  onAuthSuccess?: (token: string, isNewUser: boolean) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAuthSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAgeVerified, setIsAgeVerified] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);

  // Filter countries by name or dial code
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery)
  );

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, resendTimer]);

  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.trim().length < 7) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile phone number.');
      return;
    }
    if (!isAgeVerified) {
      Alert.alert('Age Verification', 'You must be at least 18 years old to join RizzBit.');
      return;
    }

    // In production, this calls Spring Boot backend /api/v1/auth/otp/send
    setIsOtpSent(true);
    setResendTimer(30);
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto verify if 6 digits are typed
    if (index === 5 && value !== '') {
      const fullCode = newOtp.join('');
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };

  const verifyCode = (code: string) => {
    // In production, verify against backend
    if (code === '123456' || code.length === 6) {
      Alert.alert('Success', 'Phone number verified! Let’s set up your profile.');
      onAuthSuccess?.('sample-jwt-token', true);
    } else {
      Alert.alert('Invalid Code', 'The verification code you entered is incorrect. Try 123456 for testing.');
    }
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    Alert.alert(provider, `${provider} Sign-In initiated...`);
    onAuthSuccess?.('sample-social-jwt', true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>⚡</Text>
            </View>
            <Text style={styles.brandTitle}>RizzBit</Text>
            <Text style={styles.brandTagline}>REAL DATES IN REAL PLACES</Text>
            <Text style={styles.subtitle}>
              Matches only unlock when you physically step inside an active mall or venue geofence.
            </Text>
          </View>

          {!isOtpSent ? (
            /* ================= STEP 1: PHONE NUMBER INPUT ================= */
            <View style={styles.formCard}>
              <Text style={styles.label}>Enter your mobile phone number</Text>
              
              <View style={styles.phoneInputRow}>
                <TouchableOpacity
                  style={styles.countryPicker}
                  onPress={() => {
                    setSearchQuery('');
                    setIsCountryModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="(555) 000-0000"
                  placeholderTextColor="#555870"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoFocus
                />
              </View>

              {/* Age Verification Checkbox */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsAgeVerified(!isAgeVerified)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, isAgeVerified && styles.checkboxChecked]}>
                  {isAgeVerified && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  I confirm I am <Text style={styles.boldText}>18 years of age or older</Text> and accept the{' '}
                  <Text style={styles.linkText}>Terms</Text> & <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              {/* Continue Button */}
              <TouchableOpacity style={styles.primaryButton} onPress={handleSendCode}>
                <Text style={styles.primaryButtonText}>Send Verification Code →</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialAuth('Google')}>
                  <Text style={styles.socialIcon}>G</Text>
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialAuth('Apple')}>
                  <Text style={styles.socialIcon}></Text>
                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */
            <View style={styles.formCard}>
              <TouchableOpacity onPress={() => setIsOtpSent(false)} style={styles.backLink}>
                <Text style={styles.backLinkText}>← Change Number ({selectedCountry.code} {phoneNumber})</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Enter the 6-digit verification code</Text>
              <Text style={styles.subLabel}>We sent an SMS to your mobile phone.</Text>

              {/* 6 Digit Input Boxes */}
              <View style={styles.otpRow}>
                {otpCode.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v, idx)}
                    textAlign="center"
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => verifyCode(otpCode.join(''))}
              >
                <Text style={styles.primaryButtonText}>Verify & Continue →</Text>
              </TouchableOpacity>

              {/* Resend Link */}
              <View style={styles.resendContainer}>
                {resendTimer > 0 ? (
                  <Text style={styles.resendTimerText}>Resend code in {resendTimer}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleSendCode}>
                    <Text style={styles.resendActionText}>Didn’t receive code? Resend SMS</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Privacy Note */}
          <Text style={styles.footerNote}>
            🔒 Your phone number is never shared with other users.
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* Country Code Dropdown Modal */}
      <Modal
        visible={isCountryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCountryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Country Code</Text>
                <Text style={styles.modalSubtitle}>Choose your phone number prefix</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsCountryModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Box */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or dial code (e.g. +91, +1)..."
                placeholderTextColor="#6c6f85"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                  <Text style={styles.clearSearchText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => `${item.name}-${item.code}`}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.countryList}
              renderItem={({ item }) => {
                const isSelected =
                  selectedCountry.name === item.name && selectedCountry.code === item.code;
                return (
                  <TouchableOpacity
                    style={[styles.countryRow, isSelected && styles.countryRowSelected]}
                    onPress={() => {
                      setSelectedCountry(item);
                      setIsCountryModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.countryFlagText}>{item.flag}</Text>
                    <Text style={styles.countryNameText}>{item.name}</Text>
                    <Text style={styles.countryCodeBadge}>{item.code}</Text>
                    {isSelected && <Text style={styles.countryCheckmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
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
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: '#ff4b6e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4b6e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 34,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ff4b6e',
    letterSpacing: 2,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8b8e9f',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#171926',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 12,
    color: '#8b8e9f',
    marginBottom: 16,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202334',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCodeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  dropdownArrow: {
    color: '#8b8e9f',
    fontSize: 10,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#202334',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#555870',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#ff4b6e',
    borderColor: '#ff4b6e',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    color: '#8b8e9f',
    fontSize: 12,
    lineHeight: 18,
  },
  boldText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  linkText: {
    color: '#ff4b6e',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#ff4b6e',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ff4b6e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    color: '#6c6f85',
    fontSize: 11,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202334',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  socialIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  backLink: {
    marginBottom: 14,
  },
  backLinkText: {
    color: '#ff4b6e',
    fontSize: 12,
    fontWeight: '700',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#202334',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  otpBoxFilled: {
    borderColor: '#ff4b6e',
    backgroundColor: '#292534',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendTimerText: {
    color: '#6c6f85',
    fontSize: 12,
    fontWeight: '600',
  },
  resendActionText: {
    color: '#ff4b6e',
    fontSize: 12,
    fontWeight: '700',
  },
  footerNote: {
    textAlign: 'center',
    color: '#555870',
    fontSize: 11,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#171926',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '82%',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#8b8e9f',
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#202334',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202334',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    color: '#8b8e9f',
    fontSize: 12,
    fontWeight: '700',
  },
  countryList: {
    paddingBottom: 20,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  countryRowSelected: {
    backgroundColor: 'rgba(255, 75, 110, 0.12)',
  },
  countryFlagText: {
    fontSize: 22,
    marginRight: 12,
  },
  countryNameText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  countryCodeBadge: {
    color: '#a0a3bd',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  countryCheckmark: {
    color: '#ff4b6e',
    fontSize: 16,
    fontWeight: '900',
  },
});
