import React, { useContext } from 'react';
import { View, Animated } from 'react-native';

import { ScrollContext } from './_layout';

import AnimatedView from '@/components/AnimatedView';
import Card from '@/components/Card';
import { CardScroller } from '@/components/CardScroller';
import ThemeScroller from '@/components/ThemeScroller';
import Section from '@/components/layout/Section';
import { isSupabaseConfigured, getStorageUrl } from '@/lib/supabase';

const img = (storagePath: string, localAsset: any): string | any =>
  isSupabaseConfigured ? getStorageUrl('facility-images', storagePath) : localAsset;

const ExperienceScreen = () => {
  const scrollY = useContext(ScrollContext);

  return (
    <ThemeScroller
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      })}
      scrollEventThrottle={16}>
      <AnimatedView animation="scaleIn" className="mt-4 flex-1">
        {[
          {
            title: 'Popular in Phase 1',
            experiences: [
              {
                title: 'Hulhumalé Football Ground',
                image: img('football/pitch-main.jpg', require('@/assets/img/room-1.avif')),
                price: 'MVR 500/slot',
                rating: 4.9,
                badge: 'Popular',
              },
              {
                title: 'HDC Cricket Ground',
                image: img('cricket/ground-main.jpg', require('@/assets/img/room-2.avif')),
                price: 'MVR 800/slot',
                rating: 4.8,
              },
              {
                title: 'Sports Stadium Court',
                image: img('basketball/court-main.jpg', require('@/assets/img/room-3.avif')),
                price: 'MVR 350/slot',
                rating: 4.7,
              },
              {
                title: 'HDC Badminton Hall',
                image: img('badminton/hall-main.jpg', require('@/assets/img/room-4.avif')),
                price: 'MVR 250/slot',
                rating: 4.8,
              },
            ],
          },
          {
            title: 'Popular in Phase 2',
            experiences: [
              {
                title: 'Hulhumalé Futsal Arena',
                image: img('football/pitch-aerial.jpg', require('@/assets/img/room-1.avif')),
                price: 'MVR 400/slot',
                rating: 4.9,
                badge: 'New',
              },
              {
                title: 'Phase 2 Basketball Court',
                image: img('basketball/court-indoor.jpg', require('@/assets/img/room-3.avif')),
                price: 'MVR 300/slot',
                rating: 4.7,
              },
              {
                title: 'Phase 2 Volleyball Court',
                image: img('volleyball/court-main.jpg', require('@/assets/img/room-5.avif')),
                price: 'MVR 250/slot',
                rating: 4.6,
              },
              {
                title: 'Water Sports Beach Center',
                image: img('swimming/pool-aerial.jpg', require('@/assets/img/room-7.avif')),
                price: 'MVR 150/slot',
                rating: 4.8,
                badge: 'Popular',
              },
            ],
          },
          {
            title: 'Water Sports & Recreation',
            experiences: [
              {
                title: 'Hulhumalé Swimming Pool',
                image: img('swimming/pool-main.jpg', require('@/assets/img/room-7.avif')),
                price: 'MVR 200/slot',
                rating: 4.8,
                badge: 'Popular',
              },
              {
                title: 'Water Sports Beach Center',
                image: img('swimming/pool-lanes.jpg', require('@/assets/img/room-7.avif')),
                price: 'MVR 150/slot',
                rating: 4.7,
              },
              {
                title: 'Beach Volleyball Court',
                image: img('volleyball/court-beach.jpg', require('@/assets/img/room-5.avif')),
                price: 'MVR 300/slot',
                rating: 4.9,
                badge: 'Top Rated',
              },
              {
                title: 'HDC Tennis Court',
                image: img('tennis/court-main.jpg', require('@/assets/img/room-6.avif')),
                price: 'MVR 400/slot',
                rating: 4.6,
              },
            ],
          },
          {
            title: 'Team Sports',
            experiences: [
              {
                title: 'Hulhumalé Football Ground',
                image: img('football/pitch-night.jpg', require('@/assets/img/room-1.avif')),
                price: 'MVR 500/slot',
                rating: 4.9,
              },
              {
                title: 'HDC Cricket Ground',
                image: img('cricket/nets-practice.jpg', require('@/assets/img/room-2.avif')),
                price: 'MVR 800/slot',
                rating: 4.8,
                badge: 'Top Rated',
              },
              {
                title: 'Hulhumalé Volleyball Court',
                image: img('volleyball/court-sunset.jpg', require('@/assets/img/room-5.avif')),
                price: 'MVR 300/slot',
                rating: 4.7,
              },
              {
                title: 'Sports Stadium Court',
                image: img('basketball/court-night.jpg', require('@/assets/img/room-3.avif')),
                price: 'MVR 350/slot',
                rating: 4.8,
              },
            ],
          },
        ].map((section, index) => (
          <Section
            key={`popular-section-${index}`}
            title={section.title}
            titleSize="lg"
            linkText="View all">
            <CardScroller space={15} className="mt-1.5 pb-4">
              {section.experiences.map((experience, propIndex) => (
                <Card
                  key={`experience-${index}-${propIndex}`}
                  title={experience.title}
                  rounded="2xl"
                  rating={experience.rating}
                  price={experience.price}
                  width={160}
                  imageHeight={160}
                  image={experience.image}
                  badge={experience.badge}
                />
              ))}
            </CardScroller>
          </Section>
        ))}
      </AnimatedView>
    </ThemeScroller>
  );
};

export default ExperienceScreen;
