import React from 'react';
import { View, Pressable, SafeAreaView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#15803D', '#0D9488']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {/* Top decoration */}
        <View className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-white" style={{ transform: [{ translateX: 40 }, { translateY: -40 }] }} />
        <View className="absolute bottom-32 left-0 w-48 h-48 rounded-full opacity-10 bg-white" style={{ transform: [{ translateX: -24 }] }} />

        <View className="flex-1 px-6 justify-between">
          {/* Header */}
          <View className="pt-8">
            <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center mb-6">
              <Icon name="Trophy" size={32} color="white" />
            </View>
            <ThemedText className="text-white text-3xl font-bold leading-tight mb-2">
              HDC Sports
            </ThemedText>
            <ThemedText className="text-white/80 text-base">
              CSR Facilities Booking
            </ThemedText>
          </View>

          {/* Tagline */}
          <View className="items-center py-8">
            <View className="bg-white/10 rounded-3xl px-6 py-8 w-full">
              <ThemedText className="text-white text-2xl font-bold text-center mb-3">
                Book Sports Facilities in Hulhumalé
              </ThemedText>
              <ThemedText className="text-white/70 text-center text-sm leading-relaxed">
                HDC-registered sports teams can reserve courts, pay securely via eFaas, and manage bookings — all in one place.
              </ThemedText>

              <View className="mt-6 gap-3">
                {[
                  { icon: 'MapPin', text: '15+ facilities across 4 neighborhoods' },
                  { icon: 'Shield', text: 'Team-verified bookings only' },
                  { icon: 'Zap', text: 'Instant eFaas payment confirmation' },
                ].map(({ icon, text }) => (
                  <View key={icon} className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                      <Icon name={icon as any} size={14} color="white" />
                    </View>
                    <ThemedText className="text-white/80 text-sm flex-1">{text}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="pb-6 gap-3">
            <Pressable
              onPress={() => router.push('/screens/login')}
              className="w-full bg-white rounded-2xl py-4 items-center"
            >
              <ThemedText className="text-hdc-green font-bold text-base">
                Login with Team ID
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.push('/screens/signup')}
              className="w-full border border-white/50 rounded-2xl py-4 items-center"
            >
              <ThemedText className="text-white font-semibold text-base">
                Register Your Team
              </ThemedText>
            </Pressable>

            <Pressable onPress={() => router.replace('/(tabs)/(home)')} className="py-2 items-center">
              <ThemedText className="text-white/60 text-sm underline">
                Skip for now (demo mode)
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
