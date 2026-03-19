import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/app/contexts/AuthContext';
import useThemeColors from '@/app/contexts/ThemeColors';
import { Button } from '@/components/Button';
import Header from '@/components/Header';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Checkbox from '@/components/forms/Checkbox';
import Divider from '@/components/layout/Divider';
import { useFacility, useMyTeam, useGuidelines } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import { shadowPresets } from '@/utils/createShadow';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const BookingConfirmScreen = () => {
  const { facilityId, date, startTime, endTime } = useLocalSearchParams<{
    facilityId: string;
    date: string;
    startTime: string;
    endTime: string;
  }>();

  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const { facility, loading: facilityLoading } = useFacility(facilityId);
  const { team, isRepresentative, loading: teamLoading } = useMyTeam();
  const { guideline, loading: guidelinesLoading } = useGuidelines();

  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loading = facilityLoading || teamLoading || guidelinesLoading;

  const handleBooking = async () => {
    if (!user || !team || !facility || !guideline) return;

    if (!isRepresentative) {
      Alert.alert(
        'Not Eligible',
        'You must be a registered team representative to book facilities.'
      );
      return;
    }

    setSubmitting(true);

    try {
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          team_id: team.id,
          facility_id: facilityId,
          booked_by: user.id,
          booking_date: date,
          start_time: startTime,
          end_time: endTime,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create guideline acceptance record
      const { error: acceptanceError } = await supabase.from('guideline_acceptances').insert({
        booking_id: booking.id,
        user_id: user.id,
        guideline_version: guideline.version,
      });

      if (acceptanceError) throw acceptanceError;

      Alert.alert(
        'Booking Submitted',
        `Your booking reference is ${booking.id.slice(0, 8).toUpperCase()}. You will be notified once it is reviewed.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/trips' as any),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Booking Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Confirm Booking" showBackButton />
        <View className="flex-1 items-center justify-center bg-light-primary dark:bg-dark-primary">
          <ActivityIndicator size="large" color={colors.highlight} />
        </View>
      </>
    );
  }

  // Not eligible state
  if (!team || !isRepresentative) {
    return (
      <>
        <Header title="Confirm Booking" showBackButton />
        <View className="flex-1 items-center justify-center bg-light-primary px-global dark:bg-dark-primary">
          <ThemedText className="text-center text-lg text-light-subtext dark:text-dark-subtext">
            You must be a registered team representative to book facilities. Contact HDC to register
            your team.
          </ThemedText>
        </View>
      </>
    );
  }

  return (
    <>
      <Header title="Confirm Booking" showBackButton />
      <ThemedScroller className="flex-1 px-0" keyboardShouldPersistTaps="handled">
        {/* Booking Summary Card */}
        <View className="px-global pt-6">
          <View
            className="overflow-hidden rounded-2xl bg-light-primary dark:bg-dark-secondary"
            style={shadowPresets.large}>
            {/* Facility image from Supabase storage */}
            {facility?.image_urls && facility.image_urls.length > 0 && facility.image_urls[0] ? (
              <Image
                source={{ uri: facility.image_urls[0] }}
                className="h-40 w-full"
                resizeMode="cover"
              />
            ) : null}

            <View className="p-5">
              <ThemedText className="mb-4 text-xl font-bold">{facility?.name}</ThemedText>

              <View className="mb-3 flex-row justify-between">
                <ThemedText className="text-light-subtext dark:text-dark-subtext">Date</ThemedText>
                <ThemedText className="font-medium">{formatDate(date)}</ThemedText>
              </View>

              <View className="mb-3 flex-row justify-between">
                <ThemedText className="text-light-subtext dark:text-dark-subtext">Time</ThemedText>
                <ThemedText className="font-medium">
                  {startTime} - {endTime}
                </ThemedText>
              </View>

              <View className="mb-3 flex-row justify-between">
                <ThemedText className="text-light-subtext dark:text-dark-subtext">Price</ThemedText>
                <ThemedText className="font-medium">MVR {facility?.price_per_slot}</ThemedText>
              </View>

              <Divider className="my-3" />

              <View className="flex-row justify-between">
                <ThemedText className="text-light-subtext dark:text-dark-subtext">Team</ThemedText>
                <ThemedText className="font-medium">{team.name}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Guidelines Section */}
        <View className="px-global pt-6">
          <ThemedText className="mb-3 text-lg font-bold">Facility Usage Guidelines</ThemedText>

          <View className="max-h-64 rounded-xl bg-light-secondary p-4 dark:bg-dark-secondary">
            <ScrollView nestedScrollEnabled>
              <ThemedText className="text-sm leading-6 text-light-subtext dark:text-dark-subtext">
                {guideline?.content || 'No guidelines available.'}
              </ThemedText>
            </ScrollView>
          </View>

          <View className="mt-4">
            <Checkbox
              label={`I have read and accept the facility usage guidelines (v${guideline?.version || '—'})`}
              checked={guidelinesAccepted}
              onChange={setGuidelinesAccepted}
            />
          </View>
        </View>

        {/* Spacer for bottom button */}
        <View className="h-32" />
      </ThemedScroller>

      {/* Book & Pay Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-light-primary px-global pt-global dark:bg-dark-primary"
        style={{ paddingBottom: insets.bottom || 16 }}>
        <Button
          title="Submit Booking Request"
          variant="primary"
          textClassName="text-white"
          disabled={!guidelinesAccepted || submitting}
          loading={submitting}
          onPress={handleBooking}
        />
      </View>
    </>
  );
};

export default BookingConfirmScreen;
