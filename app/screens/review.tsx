import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import useThemeColors from '@/app/contexts/ThemeColors';
import { Button } from '@/components/Button';
import Header from '@/components/Header';
import ThemedFooter from '@/components/ThemeFooter';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Input from '@/components/forms/Input';

interface ReviewScreenProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  const colors = useThemeColors();

  const handlePress = (starIndex: number) => {
    const newRating = starIndex + 1;
    setRating(newRating === rating ? 0 : newRating);
  };

  return (
    <View className="my-6 flex-row justify-center">
      {[0, 1, 2, 3, 4].map((starIndex) => (
        <TouchableOpacity
          key={starIndex}
          onPress={() => handlePress(starIndex)}
          className="h-10 w-10 items-center justify-center">
          <FontAwesome
            name={rating > starIndex ? 'star' : 'star-o'}
            size={30}
            color={rating > starIndex ? colors.icon : colors.text}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const colors = useThemeColors();

  // Mock product data (replace with actual data)
  const product = {
    id: 1,
    name: 'Luxury Beachfront Villa',
    date: `12 - 16 July, 2025`,
    image: require('@/assets/img/room-1.avif'),
  };

  const handleSubmit = () => {
    // Implement review submission logic
    console.log({ rating, review });
    router.back();
  };

  return (
    <>
      <Header title="Write a Review" showBackButton />
      <ThemedScroller className="flex-1 pt-8" keyboardShouldPersistTaps="handled">
        {/* Product Information */}
        <View className="mb-0 flex-col items-center">
          <Image
            source={product.image}
            className="h-32 w-32 rounded-lg bg-light-secondary dark:bg-dark-secondary"
          />
          <View className="flex-1 items-center justify-center">
            <ThemedText className="mt-global text-base font-bold">{product.name}</ThemedText>
            <ThemedText className="text-light-subtext dark:text-dark-subtext">
              {product.date}
            </ThemedText>
          </View>
        </View>

        {/* Star Rating */}
        <StarRating rating={rating} setRating={setRating} />

        {/* Review Input */}
        <Input
          label="Write your review"
          isMultiline
          style={{
            textAlignVertical: 'top',
            height: 120,
          }}
          value={review}
          onChangeText={setReview}
        />
      </ThemedScroller>
      <ThemedFooter>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          disabled={rating === 0 || !review.trim()}
        />
      </ThemedFooter>
    </>
  );
};

export default ReviewScreen;
