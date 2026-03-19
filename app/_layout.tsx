import '../global.css';
import { Stack } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './contexts/AuthContext';
import { BusinessModeProvider } from './contexts/BusinesModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import useThemedNavigation from './hooks/useThemedNavigation';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

function AuthGate({ children }: { children: React.ReactNode }) {
  // TODO: Re-enable auth gate when Google/Apple Sign-In is configured
  // For now, bypass authentication to allow development of the app UI
  return <>{children}</>;
}

function ThemedLayout() {
  const { ThemedStatusBar, screenOptions } = useThemedNavigation();

  return (
    <>
      <ThemedStatusBar />
      <AuthGate>
        <Stack screenOptions={screenOptions} />
      </AuthGate>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      className={`bg-light-primary dark:bg-dark-primary ${Platform.OS === 'ios' ? 'pb-0 ' : ''}`}
      style={{ flex: 1 }}>
      <AuthProvider>
        <BusinessModeProvider>
          <ThemeProvider>
            <ThemedLayout />
          </ThemeProvider>
        </BusinessModeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
