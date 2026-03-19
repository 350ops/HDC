import { router } from 'expo-router';
import React from 'react';
import { View, Pressable } from 'react-native';

import { useCollapsibleTitle } from '@/app/hooks/useCollapsibleTitle';
import AnimatedView from '@/components/AnimatedView';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import ThemeScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';

const BookingsScreen = () => {
  const { scrollY, scrollHandler, scrollEventThrottle } = useCollapsibleTitle();

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary">
      <Header title="My Bookings" variant="collapsibleTitle" scrollY={scrollY} />
      <AnimatedView animation="scaleIn" className="flex-1">
        <ThemeScroller
          className="pt-4"
          onScroll={scrollHandler}
          scrollEventThrottle={scrollEventThrottle}>
          <View className="flex-1 items-center justify-center px-6 pt-32">
            <Icon name="CalendarCheck" size={48} strokeWidth={1} className="mb-4 opacity-30" />
            <ThemedText className="mb-2 text-lg font-bold">No bookings yet</ThemedText>
            <ThemedText className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Browse facilities to make your first booking
            </ThemedText>
            <Pressable
              onPress={() => router.push('/(tabs)')}
              className="rounded-xl bg-highlight px-6 py-3 active:opacity-80">
              <ThemedText className="text-sm font-semibold text-white">
                Browse Facilities
              </ThemedText>
            </Pressable>
          </View>
        </ThemeScroller>
      </AnimatedView>
    </View>
  );
};

export default BookingsScreen;
