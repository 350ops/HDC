import { View, Pressable, SafeAreaView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import ThemedText from '@/components/ThemedText';
import { StatusBar } from 'expo-status-bar';
import ThemeToggle from '@/components/ThemeToggle';
import { AntDesign } from '@expo/vector-icons';
import useThemeColors from '../contexts/ThemeColors';
import React from 'react';
import Icon from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/app/contexts/AuthContext';
import { ActivityIndicator } from 'react-native';

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
      <View className="flex-1 relative bg-light-primary dark:bg-dark-primary">
        <View className="w-full flex-row justify-end px-4 pt-2">
          <ThemeToggle />
        </View>

        <View className="flex flex-col items-start w-full justify-center gap-2 flex-1 px-global pb-20">
          <View className="mb-8">
            <ThemedText className="text-4xl font-bold">HDC Sports</ThemedText>
            <ThemedText className="text-base text-light-subtext dark:text-dark-subtext">
              Book sports facilities across Hulhumalé
            </ThemedText>
          </View>

          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full border border-black dark:border-white rounded-2xl flex flex-row items-center justify-center py-4 ${isLoading ? 'opacity-50' : ''}`}>
            <View className="absolute left-4 top-4.5">
              {loadingProvider === 'google' ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <AntDesign name="google" size={22} color={colors.text} />
              )}
            </View>
            <ThemedText className="text-base font-medium pr-2">
              Continue with Google
            </ThemedText>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleAppleSignIn}
              disabled={isLoading}
              className={`w-full border border-black dark:border-white rounded-2xl flex flex-row items-center justify-center py-4 ${isLoading ? 'opacity-50' : ''}`}>
              <View className="absolute left-4 top-4.5">
                {loadingProvider === 'apple' ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <AntDesign name="apple1" size={22} color={colors.text} />
                )}
              </View>
              <ThemedText className="text-base font-medium pr-2">
                Continue with Apple
              </ThemedText>
            </Pressable>
          )}

          <View className="mt-6 px-2">
            <ThemedText className="text-xs text-center text-light-subtext dark:text-dark-subtext">
              By continuing, you agree to HDC's Terms of Service and Privacy Policy.
              Only registered sports teams can book facilities.
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
