import Header, { HeaderIcon } from '@/components/Header';
import ThemeScroller from '@/components/ThemeScroller';
import React, { useRef, useEffect, useContext } from 'react';
import { View, Text, Pressable, Image, Animated } from 'react-native';
import Section from '@/components/layout/Section';
import { CardScroller } from '@/components/CardScroller';
import Card from '@/components/Card';
import AnimatedView from '@/components/AnimatedView';
import { ScrollContext } from './_layout';
import ThemedText from '@/components/ThemedText';
import useShadow, { shadowPresets } from '@/utils/useShadow';
import { router } from 'expo-router';
import { useFacilities } from '@/lib/hooks';
import SkeletonLoader from '@/components/SkeletonLoader';

const sportImageMap: Record<string, any> = {
    Football: require('@/assets/img/room-1.avif'),
    Cricket: require('@/assets/img/room-2.avif'),
    Basketball: require('@/assets/img/room-3.avif'),
    Badminton: require('@/assets/img/room-4.avif'),
    Volleyball: require('@/assets/img/room-5.avif'),
    Tennis: require('@/assets/img/room-6.avif'),
    Swimming: require('@/assets/img/room-7.avif'),
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
            <AnimatedView animation="scaleIn" className='flex-1 mt-4'>
                <View style={{ ...shadowPresets.large }} className='p-5 mb-8 rounded-2xl bg-light-primary dark:bg-dark-secondary'>
                    <ThemedText className='text-xl font-bold'>
                        Book a facility
                    </ThemedText>
                    <ThemedText className='text-sm mt-1 text-gray-500 dark:text-gray-400'>
                        Sports facilities across Hulhumalé
                    </ThemedText>
                </View>

                {loading && (
                    <SkeletonLoader variant="grid" count={4} />
                )}

                {error && (
                    <View className='p-5 mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20'>
                        <ThemedText className='text-red-600 dark:text-red-400 text-sm'>
                            Failed to load facilities: {error}
                        </ThemedText>
                    </View>
                )}

                {!loading && !error && Object.entries(grouped).map(([sportType, sportFacilities], index) => (
                    <Section
                        key={`sport-section-${index}`}
                        title={sportType}
                        titleSize="lg"
                        linkText="View all"
                    >
                        <CardScroller space={15} className='mt-1.5 pb-4'>
                            {sportFacilities.map((facility, facIndex) => (
                                <Card
                                    key={`facility-${facility.id}`}
                                    title={facility.name}
                                    description={facility.neighborhood || ''}
                                    rounded="2xl"
                                    badge={facility.sport_type}
                                    href={`/screens/facility-detail?id=${facility.id}`}
                                    price={`MVR ${facility.price_per_slot}/slot`}
                                    width={160}
                                    imageHeight={160}
                                    image={getFacilityImage(facility.sport_type)}
                                />
                            ))}
                        </CardScroller>
                    </Section>
                ))}

            </AnimatedView>
        </ThemeScroller>
    );
}


export default HomeScreen;
