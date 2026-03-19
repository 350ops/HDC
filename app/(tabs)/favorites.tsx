import React from 'react';
import { View, Pressable, Image } from 'react-native';

import { useCollapsibleTitle } from '@/app/hooks/useCollapsibleTitle';
import AnimatedView from '@/components/AnimatedView';
import Card from '@/components/Card';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import { Placeholder } from '@/components/Placeholder';
import ThemeScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Grid from '@/components/layout/Grid';

const savedFacilities = [
  {
    id: 1,
    title: 'Football Pitches',
    description: '3 saved',
    image: require('@/assets/img/room-1.avif'),
    sport: 'Football',
  },
  {
    id: 2,
    title: 'Cricket Grounds',
    description: '2 saved',
    image: require('@/assets/img/room-2.avif'),
    sport: 'Cricket',
  },
  {
    id: 3,
    title: 'Basketball Courts',
    description: '1 saved',
    image: require('@/assets/img/room-3.avif'),
    sport: 'Basketball',
  },
  {
    id: 4,
    title: 'Badminton Courts',
    description: '2 saved',
    image: require('@/assets/img/room-4.avif'),
    sport: 'Badminton',
  },
];

const FavoritesScreen = () => {
  const { scrollY, scrollHandler, scrollEventThrottle } = useCollapsibleTitle();

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary">
      <AnimatedView animation="scaleIn" className="flex-1">
        <Header title="Saved" variant="collapsibleTitle" scrollY={scrollY} />
        <ThemeScroller
          onScroll={scrollHandler}
          scrollEventThrottle={scrollEventThrottle}
          className="pt-4">
          {savedFacilities.length > 0 ? (
            <Grid className="mt-2" columns={2} spacing={20}>
              {savedFacilities.map((item) => (
                <Card
                  href="/screens/facility-detail"
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  description={item.description}
                  imageHeight={180}
                  rounded="2xl"
                  badge={item.sport}
                />
              ))}
            </Grid>
          ) : (
            <Placeholder
              title="No saved facilities"
              subtitle="Browse facilities and tap the heart to save your favorites"
            />
          )}
        </ThemeScroller>
      </AnimatedView>
    </View>
  );
};

export default FavoritesScreen;
