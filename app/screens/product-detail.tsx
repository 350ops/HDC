import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { View, Text, Image, Pressable, Share } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { CardScroller } from '@/components/CardScroller';
import Favorite from '@/components/Favorite';
import Header, { HeaderIcon } from '@/components/Header';
import Icon, { IconName } from '@/components/Icon';
import ImageCarousel from '@/components/ImageCarousel';
import ShowRating from '@/components/ShowRating';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Switch from '@/components/forms/Switch';
import Divider from '@/components/layout/Divider';
import Section from '@/components/layout/Section';

const property = {
  id: 1,
  title: 'Luxury Penthouse with Central Park View',
  description:
    'Stunning penthouse apartment with breathtaking views of Central Park. This luxurious 3-bedroom home features floor-to-ceiling windows, a gourmet kitchen, and a private terrace. Perfect for families or groups looking for an upscale NYC experience.',
  price: '$850',
  features: {
    guests: '6 guests',
    bedrooms: '3 bedrooms',
    bathrooms: '2.5 bathrooms',
    size: '2,200 sq ft',
  },
  ratings: {
    overall: 4.9,
    cleanliness: 4.8,
    location: 5.0,
    value: 4.7,
    reviews: 284,
  },
  host: {
    id: 101,
    name: 'John Doe',
    avatar: require('@/assets/img/user-3.jpg'),
    location: 'Upper East Side, Manhattan, New York',
    joinedDate: 'January 2018',
  },
  images: [
    require('@/assets/img/room-2.avif'),
    require('@/assets/img/room-3.avif'),
    require('@/assets/img/room-5.avif'),
    require('@/assets/img/room-4.avif'),
  ],
};

const reviewsData = [
  {
    rating: 5,
    description:
      'Amazing views and perfect location. The apartment was spotless and Sarah was very responsive throughout our stay.',
    date: 'June 2023',
    username: 'John D.',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
  },
  {
    rating: 5,
    description:
      'Luxurious apartment with everything you need. We especially loved the terrace and the Central Park views!',
    date: 'May 2023',
    username: 'Maria S.',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    rating: 4,
    description:
      'Great experience overall. The kitchen was well-equipped and the beds were very comfortable. Highly recommend!',
    date: 'April 2023',
    username: 'David L.',
    avatar: 'https://randomuser.me/api/portraits/men/63.jpg',
  },
  {
    rating: 5,
    description:
      'Perfect location for exploring NYC. The apartment exceeded our expectations and Sarah was an excellent host.',
    date: 'March 2023',
    username: 'Jennifer K.',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
  },
];

const similarProperties = [
  {
    id: 2,
    title: 'Modern Loft in SoHo',
    price: '$650/night',
    image:
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 3,
    title: 'Brooklyn Heights Apartment',
    price: '$450/night',
    image:
      'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 4,
    title: 'Midtown Studio',
    price: '$380/night',
    image:
      'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 5,
    title: 'Chelsea Townhouse',
    price: '$950/night',
    image:
      'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const PropertyDetail = () => {
  const [instantBook, setInstantBook] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const totalPrice = property.price;

  // Manage status bar based on screen focus
  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing property: ${property.title}\nPrice: ${property.price} per night`,
        title: property.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  const rightComponents = [
    <Favorite productName={property.title} size={25} isWhite />,
    <HeaderIcon icon="Share2" onPress={handleShare} isWhite href="0" />,
  ];

  return (
    <>
      {isFocused && <StatusBar style="light" translucent />}
      <Header variant="transparent" title="" rightComponents={rightComponents} showBackButton />
      <ThemedScroller className="bg-light-primary px-0 dark:bg-dark-primary">
        <ImageCarousel images={property.images} height={500} paginationStyle="dots" />

        <View
          style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
          className="-mt-[30px] bg-light-primary p-global dark:bg-dark-primary">
          <View className="">
            <ThemedText className="text-center text-3xl font-semibold">{property.title}</ThemedText>
            <View className="mt-4 flex-row items-center justify-center">
              <ShowRating
                rating={property.ratings.overall}
                size="lg"
                className="border-r border-neutral-200 px-4 py-2 dark:border-dark-secondary"
              />
              <ThemedText className="px-4 text-base">234 Reviews</ThemedText>
            </View>
          </View>

          <View className="mb-8 mt-8 flex-row items-center border-y border-neutral-200 py-global dark:border-dark-secondary">
            <Avatar
              size="md"
              src={property.host.avatar}
              className="mr-4"
              link="/screens/user-profile"
            />
            <View className="ml-0">
              <ThemedText className="text-base font-semibold">
                Hosted by {property.host.name}
              </ThemedText>
              <View className="flex-row items-center">
                <Icon name="MapPin" size={12} className="mr-1" />
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
                  {property.host.location}
                </ThemedText>
              </View>
            </View>
          </View>

          <ThemedText className="text-base">{property.description}</ThemedText>

          <Divider className="mb-4 mt-8" />

          {/* Property Features */}
          <Section title="Property Details" titleSize="lg" className="mb-6 mt-2">
            <View className="mt-3">
              <FeatureItem icon="Users" label="Guests" value={property.features.guests} />
              <FeatureItem icon="BedDouble" label="Bedrooms" value={property.features.bedrooms} />
              <FeatureItem icon="Bath" label="Bathrooms" value={property.features.bathrooms} />
              <FeatureItem icon="PencilRuler" label="Size" value={property.features.size} />
            </View>
          </Section>

          <Divider className="my-4" />

          {/* Instant Book Option */}
          <View className="flex-row items-center justify-between">
            <Switch
              icon="Zap"
              label="Instant Book Available"
              description="Book immediately without waiting for host approval"
              value={instantBook}
              onChange={setInstantBook}
              className="flex-1 py-3"
            />
          </View>

          <Divider className="my-4" />

          {/* Ratings & Reviews */}
          <Section
            title="Guest Reviews"
            titleSize="lg"
            subtitle={`${property.ratings.reviews} reviews`}
            className="mb-6">
            <View className="mt-4 rounded-lg bg-light-secondary p-4 dark:bg-dark-secondary">
              <View className="mb-4 flex-row items-center">
                <ShowRating rating={property.ratings.overall} size="lg" />
                <ThemedText className="ml-2 text-light-subtext dark:text-dark-subtext">
                  ({property.ratings.reviews})
                </ThemedText>
              </View>

              <View className="space-y-2">
                <RatingItem label="Cleanliness" rating={property.ratings.cleanliness} />
                <RatingItem label="Location" rating={property.ratings.location} />
                <RatingItem label="Value for Money" rating={property.ratings.value} />
              </View>
            </View>

            <ThemedText className="mb-3 mt-6 text-lg font-semibold">Guest Reviews</ThemedText>
            <CardScroller className="mt-1" space={10}>
              {reviewsData.map((review, index) => (
                <View
                  key={index}
                  className="w-[280px] rounded-lg bg-light-secondary p-4 dark:bg-dark-secondary">
                  <View className="mb-2 flex-row items-center">
                    <Image
                      source={{ uri: review.avatar }}
                      className="mr-2 h-10 w-10 rounded-full"
                    />
                    <View>
                      <ThemedText className="font-medium">{review.username}</ThemedText>
                      <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
                        {review.date}
                      </ThemedText>
                    </View>
                  </View>
                  <ShowRating rating={review.rating} size="sm" className="mb-2" />
                  <ThemedText className="text-sm">{review.description}</ThemedText>
                </View>
              ))}
            </CardScroller>
          </Section>
        </View>
      </ThemedScroller>

      {/* Bottom Booking Bar */}

      <View
        style={{ paddingBottom: insets.bottom }}
        className=" flex-row items-center justify-start border-t border-neutral-200 px-global pt-4 dark:border-dark-secondary">
        <View>
          <ThemedText className="text-xl font-bold">{totalPrice} night</ThemedText>
          <ThemedText className="text-xs opacity-60">5 - 12 June</ThemedText>
        </View>
        <View className="ml-auto flex-row items-center">
          <Button
            title="Reserve"
            className="ml-6 bg-highlight px-6"
            textClassName="text-white"
            size="medium"
            href="/screens/order-detail?id=1"
            rounded="lg"
          />
        </View>
      </View>
    </>
  );
};

// Feature Item Component
interface FeatureItemProps {
  icon: IconName;
  label: string;
  value: string;
}

const FeatureItem = ({ icon, label, value }: FeatureItemProps) => (
  <View className="flex-row items-center py-4">
    <Icon name={icon} size={24} strokeWidth={1.5} className="mr-3" />
    <ThemedText className="flex-1">{label}</ThemedText>
    <ThemedText className="font-medium">{value}</ThemedText>
  </View>
);

// Rating Item Component
interface RatingItemProps {
  label: string;
  rating: number;
}

const RatingItem = ({ label, rating }: RatingItemProps) => (
  <View className="flex-row items-center justify-between py-2">
    <ThemedText className="text-sm">{label}</ThemedText>
    <View className="flex-row items-center">
      <ShowRating rating={rating} size="sm" />
    </View>
  </View>
);

export default PropertyDetail;
