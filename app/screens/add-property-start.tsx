import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Divider from '@/components/layout/Divider';

export default function AddPropertyStart() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Header showBackButton />
      <View className=" flex h-full  flex-1 justify-start bg-light-primary px-6 dark:bg-dark-primary">
        <View className="mt-4 pb-6">
          <ThemedText className="mb-8 text-4xl font-semibold">
            It's easy to get started on Propia
          </ThemedText>
        </View>

        <IntroStep
          number="1"
          title="Add your property"
          description="Share your property with the world."
          image={require('@/assets/img/bed.png')}
        />
        <Divider className="my-4" />
        <IntroStep
          number="2"
          title="Make it stand out"
          description="Add photos, a description, and amenities to make your property stand out."
          image={require('@/assets/img/sofa.png')}
        />
        <Divider className="my-4" />
        <IntroStep
          number="3"
          title="Finish up and publish"
          description="Choose price, availability, and publish your property."
          image={require('@/assets/img/door.png')}
        />

        <View className=" mt-auto pb-2" style={{ paddingBottom: insets.bottom }}>
          <Button
            size="large"
            className="bg-highlight"
            textClassName="text-white"
            rounded="full"
            title="Let's go"
            href="/screens/add-property"
          />
        </View>
      </View>
    </>
  );
}

const IntroStep = (props: { number: string; title: string; description: string; image: any }) => {
  return (
    <View className="flex-row items-start py-4">
      <ThemedText className="mr-4 text-lg font-semibold">{props.number}</ThemedText>
      <View className="mr-6 flex-1">
        <ThemedText className="text-lg font-semibold">{props.title}</ThemedText>
        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
          {props.description}
        </ThemedText>
      </View>
      <Image source={props.image} className="ml-auto h-16 w-16" />
    </View>
  );
};
