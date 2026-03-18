import ThemeScroller from '@/components/ThemeScroller';
import React, { useContext, useMemo } from 'react';
import { View, Pressable, Animated } from 'react-native';
import Section from '@/components/layout/Section';
import { CardScroller } from '@/components/CardScroller';
import Card from '@/components/Card';
import AnimatedView from '@/components/AnimatedView';
import { ScrollContext } from './_layout';
import ThemedText from '@/components/ThemedText';
import { shadowPresets } from '@/utils/useShadow';
import Icon from '@/components/Icon';
import type { Facility } from '@/lib/types';
import { isSupabaseConfigured, getFacilityImageUrls } from '@/lib/supabase';

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

/**
 * Get the display image for a facility.
 * Prefers Supabase storage URLs from image_urls, falls back to local assets.
 */
const getFacilityImage = (facility: Facility): string | any => {
    if (facility.image_urls && facility.image_urls.length > 0 && facility.image_urls[0]) {
        return facility.image_urls[0];
    }
    return sportImageMap[facility.sport_type] || require('@/assets/img/room-1.avif');
};

// Local facilities based on Hulhumalé Sports & Recreation Zone
// image_urls are populated from Supabase storage when configured
const LOCAL_FACILITIES: Facility[] = [
    {
        id: 'facility-1', name: 'Hulhumalé Football Ground', neighborhood: 'Phase 1', sport_type: 'Football',
        description: 'Full-size football pitch with floodlights', capacity: 22,
        image_urls: getFacilityImageUrls('Football'),
        slot_duration_min: 60, price_per_slot: 500, operating_start: '06:00', operating_end: '22:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-2', name: 'Hulhumalé Futsal Arena', neighborhood: 'Phase 2', sport_type: 'Football',
        description: 'Indoor futsal court', capacity: 10,
        image_urls: getFacilityImageUrls('Football'),
        slot_duration_min: 60, price_per_slot: 400, operating_start: '06:00', operating_end: '23:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-3', name: 'HDC Cricket Ground', neighborhood: 'Phase 1', sport_type: 'Cricket',
        description: 'Cricket ground with practice nets', capacity: 22,
        image_urls: getFacilityImageUrls('Cricket'),
        slot_duration_min: 120, price_per_slot: 800, operating_start: '06:00', operating_end: '18:00',
        requires_approval: true, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-4', name: 'Hulhumalé Cricket Nets', neighborhood: 'Phase 2', sport_type: 'Cricket',
        description: 'Practice nets for cricket training', capacity: 6,
        image_urls: getFacilityImageUrls('Cricket'),
        slot_duration_min: 60, price_per_slot: 300, operating_start: '06:00', operating_end: '20:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-5', name: 'Sports Stadium Court', neighborhood: 'Phase 1', sport_type: 'Basketball',
        description: 'Outdoor basketball court at the stadium', capacity: 10,
        image_urls: getFacilityImageUrls('Basketball'),
        slot_duration_min: 60, price_per_slot: 350, operating_start: '06:00', operating_end: '22:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-6', name: 'Phase 2 Basketball Court', neighborhood: 'Phase 2', sport_type: 'Basketball',
        description: 'Community basketball court', capacity: 10,
        image_urls: getFacilityImageUrls('Basketball'),
        slot_duration_min: 60, price_per_slot: 300, operating_start: '06:00', operating_end: '21:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-7', name: 'HDC Badminton Hall', neighborhood: 'Phase 1', sport_type: 'Badminton',
        description: 'Indoor badminton courts', capacity: 4,
        image_urls: getFacilityImageUrls('Badminton'),
        slot_duration_min: 60, price_per_slot: 250, operating_start: '06:00', operating_end: '22:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-8', name: 'Hulhumalé Volleyball Court', neighborhood: 'Phase 1', sport_type: 'Volleyball',
        description: 'Beach volleyball court near the waterfront', capacity: 12,
        image_urls: getFacilityImageUrls('Volleyball'),
        slot_duration_min: 60, price_per_slot: 300, operating_start: '06:00', operating_end: '20:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-9', name: 'Phase 2 Volleyball Court', neighborhood: 'Phase 2', sport_type: 'Volleyball',
        description: 'Community volleyball court', capacity: 12,
        image_urls: getFacilityImageUrls('Volleyball'),
        slot_duration_min: 60, price_per_slot: 250, operating_start: '06:00', operating_end: '20:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-10', name: 'HDC Tennis Court', neighborhood: 'Phase 1', sport_type: 'Tennis',
        description: 'Hard court tennis facility', capacity: 4,
        image_urls: getFacilityImageUrls('Tennis'),
        slot_duration_min: 60, price_per_slot: 400, operating_start: '06:00', operating_end: '21:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-11', name: 'Hulhumalé Swimming Pool', neighborhood: 'Phase 1', sport_type: 'Swimming',
        description: 'Olympic-size swimming pool', capacity: 30,
        image_urls: getFacilityImageUrls('Swimming'),
        slot_duration_min: 60, price_per_slot: 200, operating_start: '06:00', operating_end: '20:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
    {
        id: 'facility-12', name: 'Water Sports Beach Center', neighborhood: 'Phase 2', sport_type: 'Swimming',
        description: 'Beach water sports and swimming area', capacity: 20,
        image_urls: getFacilityImageUrls('Swimming'),
        slot_duration_min: 60, price_per_slot: 150, operating_start: '07:00', operating_end: '18:00',
        requires_approval: false, status: 'active', created_at: '', updated_at: '',
    },
];

const grouped = LOCAL_FACILITIES.reduce<Record<string, Facility[]>>((acc, f) => {
    if (!acc[f.sport_type]) acc[f.sport_type] = [];
    acc[f.sport_type].push(f);
    return acc;
}, {});

const HomeScreen = () => {
    const scrollY = useContext(ScrollContext);

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

                {Object.entries(grouped).map(([sportType, sportFacilities], index) => (
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
                                    price={`MVR ${facility.price_per_slot}/slot`}
                                    width={170}
                                    imageHeight={170}
                                    image={getFacilityImage(facility)}
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
