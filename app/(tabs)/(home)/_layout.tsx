import React, { useRef, createContext } from 'react';
import { View, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Share scrollY for collapsible header animation
export const ScrollContext = createContext<Animated.Value>(new Animated.Value(0));

export default function HomeLayout() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <ScrollContext.Provider value={scrollY}>
      <View
        className="flex-1 bg-light-primary dark:bg-dark-primary"
        style={{ paddingTop: insets.top }}
      >
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
      </View>
    </ScrollContext.Provider>
  );
}
