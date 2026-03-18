import ThemeScroller from '@/components/ThemeScroller';
import React, { useContext } from 'react';
import { View, Animated } from 'react-native';
import Section from '@/components/layout/Section';
import { CardScroller } from '@/components/CardScroller';
import Card from '@/components/Card';
import AnimatedView from '@/components/AnimatedView';
import { ScrollContext } from './_layout';
import { isSupabaseConfigured, getStorageUrl } from '@/lib/supabase';

/** Get image: Supabase storage URL if configured, otherwise local asset */
const img = (storagePath: string, localAsset: any): string | any =>
    isSupabaseConfigured ? getStorageUrl('facility-images', storagePath) : localAsset;

const ServicesScreen = () => {
    const scrollY = useContext(ScrollContext);

    return (
        <ThemeScroller
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
        >
            <AnimatedView animation="scaleIn" className='flex-1 mt-4'>

                <Section
                    title="Facilities in Hulhumalé"
                    titleSize="lg"
                >
                    <CardScroller space={15} className='mt-1.5 pb-4'>
                        <Card
                            title="Football"
                            rounded="2xl"
                            description='3 Available'
                            width={100}
                            imageHeight={100}
                            image={img('football/pitch-main.jpg', require('@/assets/img/room-1.avif'))}
                        />
                        <Card
                            title="Cricket"
                            rounded="2xl"
                            description='2 Available'
                            width={100}
                            imageHeight={100}
                            image={img('cricket/ground-main.jpg', require('@/assets/img/room-2.avif'))}
                        />
                        <Card
                            title="Basketball"
                            rounded="2xl"
                            description='2 Available'
                            width={100}
                            imageHeight={100}
                            image={img('basketball/court-main.jpg', require('@/assets/img/room-3.avif'))}
                        />
                        <Card
                            title="Swimming"
                            rounded="2xl"
                            description='2 Available'
                            width={100}
                            imageHeight={100}
                            image={img('swimming/pool-main.jpg', require('@/assets/img/room-7.avif'))}
                        />
                    </CardScroller>
                </Section>

                {[
                    {
                        title: "Phase 1 Facilities",
                        services: [
                            {
                                title: "Hulhumalé Football Ground",
                                image: img('football/pitch-main.jpg', require('@/assets/img/room-1.avif')),
                                price: "MVR 500/slot",
                                badge: "Popular"
                            },
                            {
                                title: "HDC Cricket Ground",
                                image: img('cricket/ground-main.jpg', require('@/assets/img/room-2.avif')),
                                price: "MVR 800/slot"
                            },
                            {
                                title: "Sports Stadium Court",
                                image: img('basketball/court-main.jpg', require('@/assets/img/room-3.avif')),
                                price: "MVR 350/slot"
                            },
                            {
                                title: "HDC Badminton Hall",
                                image: img('badminton/hall-main.jpg', require('@/assets/img/room-4.avif')),
                                price: "MVR 250/slot",
                                badge: "Nearby"
                            }
                        ]
                    },
                    {
                        title: "Phase 2 Facilities",
                        services: [
                            {
                                title: "Hulhumalé Futsal Arena",
                                image: img('football/pitch-aerial.jpg', require('@/assets/img/room-1.avif')),
                                price: "MVR 400/slot",
                                badge: "New"
                            },
                            {
                                title: "Phase 2 Basketball Court",
                                image: img('basketball/court-indoor.jpg', require('@/assets/img/room-3.avif')),
                                price: "MVR 300/slot"
                            },
                            {
                                title: "Phase 2 Volleyball Court",
                                image: img('volleyball/court-main.jpg', require('@/assets/img/room-5.avif')),
                                price: "MVR 250/slot"
                            },
                            {
                                title: "Water Sports Beach Center",
                                image: img('swimming/pool-aerial.jpg', require('@/assets/img/room-7.avif')),
                                price: "MVR 150/slot",
                                badge: "Popular"
                            }
                        ]
                    },
                    {
                        title: "Volleyball Courts",
                        services: [
                            {
                                title: "Hulhumalé Volleyball Court",
                                image: img('volleyball/court-beach.jpg', require('@/assets/img/room-5.avif')),
                                price: "MVR 300/slot",
                                badge: "Top Rated"
                            },
                            {
                                title: "Phase 2 Volleyball Court",
                                image: img('volleyball/court-main.jpg', require('@/assets/img/room-5.avif')),
                                price: "MVR 250/slot"
                            },
                            {
                                title: "Beach Volleyball Area",
                                image: img('volleyball/court-sunset.jpg', require('@/assets/img/room-5.avif')),
                                price: "MVR 200/slot",
                                badge: "New"
                            }
                        ]
                    },
                    {
                        title: "Tennis & Racquet Sports",
                        services: [
                            {
                                title: "HDC Tennis Court",
                                image: img('tennis/court-main.jpg', require('@/assets/img/room-6.avif')),
                                price: "MVR 400/slot",
                                badge: "Popular"
                            },
                            {
                                title: "HDC Badminton Hall",
                                image: img('badminton/court-close.jpg', require('@/assets/img/room-4.avif')),
                                price: "MVR 250/slot"
                            }
                        ]
                    },
                    {
                        title: "Water Sports & Swimming",
                        services: [
                            {
                                title: "Hulhumalé Swimming Pool",
                                image: img('swimming/pool-main.jpg', require('@/assets/img/room-7.avif')),
                                price: "MVR 200/slot",
                                badge: "Popular"
                            },
                            {
                                title: "Water Sports Beach Center",
                                image: img('swimming/pool-lanes.jpg', require('@/assets/img/room-7.avif')),
                                price: "MVR 150/slot"
                            }
                        ]
                    }
                ].map((section, index) => (
                    <Section
                        key={`service-section-${index}`}
                        title={section.title}
                        titleSize="lg"
                        linkText="View all"
                    >
                        <CardScroller space={15} className='mt-1.5 pb-4'>
                            {section.services.map((service, propIndex) => (
                                <Card
                                    key={`service-${index}-${propIndex}`}
                                    title={service.title}
                                    rounded="2xl"
                                    rating={4.8}
                                    price={service.price}
                                    width={160}
                                    imageHeight={160}
                                    image={service.image}
                                    badge={service.badge}
                                />
                            ))}
                        </CardScroller>
                    </Section>
                ))}

            </AnimatedView>
        </ThemeScroller>
    );
}

export default ServicesScreen;
