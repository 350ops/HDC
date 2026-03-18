import React from 'react';
import { View, Pressable } from 'react-native';
import ThemedText from '@/components/ThemedText';
import ThemeScroller from '@/components/ThemeScroller';
import AnimatedView from '@/components/AnimatedView';
import Header from '@/components/Header';
import { useCollapsibleTitle } from '@/app/hooks/useCollapsibleTitle';
import { router } from 'expo-router';
import Icon from '@/components/Icon';

const BookingsScreen = () => {
    const { scrollY, scrollHandler, scrollEventThrottle } = useCollapsibleTitle();

    return (
        <View className="flex-1 bg-light-primary dark:bg-dark-primary">
            <Header
                title="My Bookings"
                variant="collapsibleTitle"
                scrollY={scrollY}
            />
            <AnimatedView animation="scaleIn" className="flex-1">
                <ThemeScroller
                    className="pt-4"
                    onScroll={scrollHandler}
                    scrollEventThrottle={scrollEventThrottle}
                >
                    <View className="flex-1 items-center justify-center px-6 pt-32">
                        <Icon name="CalendarCheck" size={48} strokeWidth={1} className="mb-4 opacity-30" />
                        <ThemedText className="text-lg font-bold mb-2">
                            No bookings yet
                        </ThemedText>
                        <ThemedText className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                            Browse facilities to make your first booking
                        </ThemedText>
                        <Pressable
                            onPress={() => router.push('/(tabs)')}
                            className="bg-highlight px-6 py-3 rounded-xl active:opacity-80"
                        >
                            <ThemedText className="text-white font-semibold text-sm">
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
