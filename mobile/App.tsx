import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { ProfileSetupScreen, UserProfileData } from './src/screens/ProfileSetupScreen';
import { ZonesListScreen, DatingZone } from './src/screens/ZonesListScreen';
import { InsideZoneScreen, CandidateProfile } from './src/screens/InsideZoneScreen';
import { ChatScreen } from './src/screens/ChatScreen';

type AppStep = 'welcome' | 'profile_setup' | 'zones_list' | 'inside_zone' | 'chat';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [activeZone, setActiveZone] = useState<DatingZone | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<CandidateProfile | null>(null);

  const handleAuthSuccess = (token: string, isNewUser: boolean) => {
    setCurrentStep('profile_setup');
  };

  const handleProfileComplete = (profileData: UserProfileData) => {
    setUserProfile(profileData);
    setCurrentStep('zones_list');
  };

  const handleEnterZone = (zone: DatingZone) => {
    setActiveZone(zone);
    setCurrentStep('inside_zone');
  };

  const handleOpenChat = (matchedUser: CandidateProfile) => {
    setActiveChatUser(matchedUser);
    setCurrentStep('chat');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {currentStep === 'welcome' && (
        <WelcomeScreen onAuthSuccess={handleAuthSuccess} />
      )}
      {currentStep === 'profile_setup' && (
        <ProfileSetupScreen
          onProfileComplete={handleProfileComplete}
          onBack={() => setCurrentStep('welcome')}
        />
      )}
      {currentStep === 'zones_list' && (
        <ZonesListScreen onEnterZone={handleEnterZone} />
      )}
      {currentStep === 'inside_zone' && activeZone && (
        <InsideZoneScreen
          zone={activeZone}
          onOpenChat={handleOpenChat}
        />
      )}
      {currentStep === 'chat' && activeChatUser && activeZone && (
        <ChatScreen
          matchedUser={activeChatUser}
          zoneName={activeZone.name}
          onBack={() => setCurrentStep('inside_zone')}
        />
      )}
    </SafeAreaProvider>
  );
}
