import Header, { HeaderIcon } from '@/components/Header';
import ThemeScroller from '@/components/ThemeScroller';
import React, { useContext } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import Section from '@/components/layout/Section';
import { CardScroller } from '@/components/CardScroller';
import Card from '@/components/Card';
import AnimatedView from '@/components/AnimatedView';
import { ScrollContext } from './_layout';
import ThemedText from '@/components/ThemedText';
import { shadowPresets } from '@/utils/useShadow';
import { router } from 'expo-router';
import { useFacilities } from '@/lib/hooks';
import SkeletonLoader from '@/components/SkeletonLoader';
import Icon from '@/components/Icon';

const sportImageMap: Record<string, any> = {
    Football: require('@/assets/img/room-1.avif'),
    Cricket: require('@/assets/img/room-2.avif'),
    Basketball: require('@/assets/img/room-3.avif'),
    Badminton: require('@/assets/img/room-4.avif'),
    Volleyball: require('@/assets/img/room-5.avif'),
    Tennis: require('@/assets/img/room-6.avif'),
    Swimming: require('@/assets/img/room-7.avif'),
};

const sportIcons: Record<string, string> = {
    Football: '\u26BD',
    Cricket: '\uD83C\uDFCF',
    Basketball: '\uD83C\uDFC0',
    Badminton: '\uD83C\uDFF8',
    Volleyball: '\uD83C\uDFD0',
    Tennis: '\uD83C\uDFBE',
    Swimming: '\uD83C\uDFCA',
};

const getFacilityImage = (sportType: string) => {
    return sportImageMap[sportType] || require('@/assets/img/room-1.avif');
};

const HomeScreen = () => {
    const scrollY = useContext(ScrollContext);
    const { facilities, grouped, loading, error } = useFacilities();

    return (
        <ThemeScroller
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
        >
            <AnimatedView animation="scaleIn" className="flex-1 mt-2">
                {/* Welcome Banner */}
                <View
                    style={shadowPresets.large}
                    className="p-5 mb-6 rounded-2xl bg-highlight/10 dark:bg-highlight/20 border border-highlight/20"
                >
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <ThemedText className="text-xl font-bold">
                                HDC Sports
                            </ThemedText>
                            <ThemedText className="text-sm mt-1 text-light-subtext dark:text-dark-subtext">
                                Book sports facilities across Hulhumalé
                            </ThemedText>
                        </View>
                        <View className="w-12 h-12 rounded-full bg-highlight/20 items-center justify-center">
                            <Icon name="Trophy" size={24} strokeWidth={1.5} />
                        </View>
                    </View>
                </View>

                {/* Quick Sport Chips */}
                <CardScroller space={10} className="mb-4 pb-1">
                    {Object.keys(sportImageMap).map((sport) => (
                        <Pressable
                            key={sport}
                            className="items-center justify-center px-4 py-2.5 rounded-full bg-light-secondary dark:bg-dark-secondary"
                        >
                            <ThemedText className="text-xs font-medium">
                                {sportIcons[sport]} {sport}
                            </ThemedText>
                        </Pressable>
                    ))}
                </CardScroller>

                {loading && (
                    <SkeletonLoader variant="grid" count={4} />
                )}

                {error && (
                    <View className="p-5 mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20">
                        <ThemedText className="text-red-600 dark:text-red-400 text-sm">
                            Failed to load facilities: {error}
                        </ThemedText>
                    </View>
                )}

                {!loading && !error && Object.entries(grouped).map(([sportType, sportFacilities], index) => (
                    <Section
                        key={`sport-section-${index}`}
                        title={`${sportIcons[sportType] || ''} ${sportType}`}
                        titleSize="lg"
                        linkText="View all"
                    >
                        <CardScroller space={15} className="mt-1.5 pb-4">
                            {sportFacilities.map((facility) => (
                                <Card
                                    key={`facility-${facility.id}`}
                                    title={facility.name}
                                    description={facility.neighborhood || ''}
                                    rounded="2xl"
                                    badge={facility.sport_type}
                                    href={`/screens/facility-detail?id=${facility.id}`}
                                    price={`MVR ${facility.price_per_slot}/slot`}
                                    width={170}
                                    imageHeight={170}
                                    image={getFacilityImage(facility.sport_type)}
                                />
                            ))}
                        </CardScroller>
                    </Section>
                ))}

                {/* Empty state when no facilities loaded and no error */}
                {!loading && !error && facilities.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <Icon name="MapPin" size={48} strokeWidth={1} className="mb-4 opacity-30" />
                        <ThemedText className="text-lg font-bold mb-2">No facilities found</ThemedText>
                        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext text-center px-8">
                            Sports facilities will appear here once they are added to the system
                        </ThemedText>
                    </View>
                )}
            </AnimatedView>
        </ThemeScroller>
    );
}

export default HomeScreen;
