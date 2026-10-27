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
  const [chatReturnStep, setChatReturnStep] = useState<AppStep>('zones_list');

  // Pre-seeded with Rhea so the user can immediately test chatting outside the zone!
  const [matchedUsers, setMatchedUsers] = useState<CandidateProfile[]>([
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
  ]);

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

  const handleOpenChatFromZones = (matchedUser: CandidateProfile) => {
    setActiveChatUser(matchedUser);
    setChatReturnStep('zones_list');
    setCurrentStep('chat');
  };

  const handleMutualMatchInsideZone = (matchedUser: CandidateProfile) => {
    // Add to matched list if not already present
    setMatchedUsers((prev) => {
      if (prev.some((u) => u.id === matchedUser.id)) return prev;
      return [
        {
          ...matchedUser,
          matchedZoneName: activeZone?.name || 'Nexus Grand Mall',
          lastMessage: 'Mutual match! Say hi 👋',
          lastMessageTime: 'Just now',
        },
        ...prev,
      ];
    });
    setActiveChatUser(matchedUser);
    setChatReturnStep('inside_zone');
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
        <ZonesListScreen
          onEnterZone={handleEnterZone}
          matches={matchedUsers}
          onOpenChat={handleOpenChatFromZones}
        />
      )}
      {currentStep === 'inside_zone' && activeZone && (
        <InsideZoneScreen
          zone={activeZone}
          matchedCount={matchedUsers.length}
          onOpenChat={handleMutualMatchInsideZone}
          onViewAllChats={() => setCurrentStep('zones_list')}
          onExitZone={() => setCurrentStep('zones_list')}
        />
      )}
      {currentStep === 'chat' && activeChatUser && (
        <ChatScreen
          matchedUser={activeChatUser}
          zoneName={activeChatUser.matchedZoneName || activeZone?.name || 'Nexus Grand Mall'}
          isOutsideZone={chatReturnStep === 'zones_list'}
          onBack={() => setCurrentStep(chatReturnStep)}
        />
      )}
    </SafeAreaProvider>
  );
}
