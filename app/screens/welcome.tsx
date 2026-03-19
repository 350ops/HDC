import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Pressable, SafeAreaView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useThemeColors from '../contexts/ThemeColors';

import { useAuth } from '@/app/contexts/AuthContext';
import Icon from '@/components/Icon';
import ThemeToggle from '@/components/ThemeToggle';
import ThemedText from '@/components/ThemedText';

export default function WelcomeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoadingProvider('google');
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Sign-In Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoadingProvider('apple');
      await signInWithApple();
    } catch (error: any) {
      if (error?.code === 'ERR_REQUEST_CANCELED') return;
      Alert.alert('Sign-In Error', error.message || 'Failed to sign in with Apple');
    } finally {
      setLoadingProvider(null);
    }
  };

  const isLoading = loadingProvider !== null;

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-light-primary dark:bg-dark-primary">
      <View className="relative flex-1 bg-light-primary dark:bg-dark-primary">
        <View className="w-full flex-row justify-end px-4 pt-2">
          <ThemeToggle />
        </View>

        <View className="flex w-full flex-1 flex-col items-start justify-center gap-2 px-global pb-20">
          {/* Logo / Brand */}
          <View className="mb-8">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-highlight">
              <Icon name="Trophy" size={32} strokeWidth={1.8} className="text-white" />
            </View>
            <ThemedText className="text-4xl font-bold">HDC Sports</ThemedText>
            <ThemedText className="mt-1 text-base text-light-subtext dark:text-dark-subtext">
              Book sports facilities across Hulhumalé
            </ThemedText>
          </View>

          {/* Google Sign-In */}
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            className={`flex w-full flex-row items-center justify-center rounded-2xl border border-light-subtext/30 py-4 dark:border-dark-subtext/30 ${isLoading ? 'opacity-50' : ''}`}>
            <View className="top-4.5 absolute left-4">
              {loadingProvider === 'google' ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <AntDesign name="google" size={22} color={colors.text} />
              )}
            </View>
            <ThemedText className="pr-2 text-base font-medium">Continue with Google</ThemedText>
          </Pressable>

          {/* Apple Sign-In (iOS only) */}
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleAppleSignIn}
              disabled={isLoading}
              className={`flex w-full flex-row items-center justify-center rounded-2xl border border-light-subtext/30 py-4 dark:border-dark-subtext/30 ${isLoading ? 'opacity-50' : ''}`}>
              <View className="top-4.5 absolute left-4">
                {loadingProvider === 'apple' ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <AntDesign name="apple" size={22} color={colors.text} />
                )}
              </View>
              <ThemedText className="pr-2 text-base font-medium">Continue with Apple</ThemedText>
            </Pressable>
          )}

          {/* Skip for now (dev bypass) */}
          <Pressable
            onPress={() => router.replace('/(tabs)/(home)')}
            className="mt-2 w-full items-center py-3">
            <ThemedText className="text-sm font-medium text-highlight">
              Continue as guest
            </ThemedText>
          </Pressable>

          <View className="mt-4 px-2">
            <ThemedText className="text-center text-xs text-light-subtext dark:text-dark-subtext">
              By continuing, you agree to HDC's Terms of Service and Privacy Policy. Only registered
              sports teams can book facilities.
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
