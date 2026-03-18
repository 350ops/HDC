import '../global.css';
import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';
import { ThemeProvider } from './contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useThemedNavigation from './hooks/useThemedNavigation';
import { Platform, View, ActivityIndicator } from 'react-native';
import { BusinessModeProvider } from './contexts/BusinesModeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthScreen =
      segments[0] === 'screens' &&
      (segments[1] === 'welcome' || segments[1] === 'login' || segments[1] === 'signup');

    if (!session && !inAuthScreen) {
      // Not signed in — redirect to welcome
      router.replace('/screens/welcome');
    } else if (session && inAuthScreen) {
      // Signed in — redirect to home
      router.replace('/(tabs)/(home)');
    }
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-primary dark:bg-dark-primary">
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
