import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RadarScreen } from './src/screens/RadarScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RadarScreen />
    </SafeAreaProvider>
  );
}
