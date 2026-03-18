import React, { useState, useMemo } from 'react';
import { View, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import Header, { HeaderIcon } from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import ThemedScroller from '@/components/ThemeScroller';
import ImageCarousel from '@/components/ImageCarousel';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import Icon, { IconName } from '@/components/Icon';
import { Button } from '@/components/Button';
import { useFacility, useFacilitySlots } from '@/lib/hooks';
import useThemeColors from '@/app/contexts/ThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import type { TimeSlot } from '@/lib/types';

const placeholderImages = [
  require('@/assets/img/room-1.avif'),
  require('@/assets/img/room-2.avif'),
  require('@/assets/img/room-3.avif'),
  require('@/assets/img/room-4.avif'),
];

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getNext7Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${suffix}`;
}

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

const FacilityDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { facility, loading: facilityLoading } = useFacility(id || '');
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(true);

  const days = useMemo(() => getNext7Days(), []);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(days[0]));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const { slots, loading: slotsLoading } = useFacilitySlots(id || '', selectedDate);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  const handleShare = async () => {
    if (!facility) return;
    try {
      await Share.share({
        message: `Check out ${facility.name} - MVR ${facility.price_per_slot} per slot`,
        title: facility.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookNow = () => {
    if (!selectedSlot || !facility) return;
    router.push(
      `/screens/booking-confirm?facilityId=${id}&date=${selectedDate}&startTime=${selectedSlot.start_time}&endTime=${selectedSlot.end_time}`
    );
  };

  const rightComponents = [
    <HeaderIcon key="share" icon="Share2" onPress={handleShare} isWhite href="0" />,
  ];

  if (facilityLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-primary dark:bg-dark-primary">
        <ActivityIndicator size="large" color={colors.highlight} />
      </View>
    );
  }

  if (!facility) {
    return (
      <View className="flex-1 items-center justify-center bg-light-primary dark:bg-dark-primary">
        <ThemedText className="text-lg">Facility not found</ThemedText>
      </View>
    );
  }

  return (
    <>
      {isFocused && <StatusBar style="light" translucent />}
      <Header variant="transparent" title="" rightComponents={rightComponents} showBackButton />
      <ThemedScroller className="px-0 bg-light-primary dark:bg-dark-primary">
        <ImageCarousel
          images={placeholderImages}
          height={400}
          paginationStyle="dots"
        />

        <View
          style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
          className="p-global bg-light-primary dark:bg-dark-primary -mt-[30px]"
        >
          {/* Facility Name */}
          <ThemedText className="text-3xl text-center font-semibold">
            {facility.name}
          </ThemedText>

          {/* Sport Type + Neighborhood Chips */}
          <View className="flex-row items-center justify-center mt-4 gap-2">
            <View className="bg-light-secondary dark:bg-dark-secondary px-3 py-1 rounded-full">
              <ThemedText className="text-sm font-medium">{facility.sport_type}</ThemedText>
            </View>
            {facility.neighborhood && (
              <View className="bg-light-secondary dark:bg-dark-secondary px-3 py-1 rounded-full">
                <ThemedText className="text-sm font-medium">{facility.neighborhood}</ThemedText>
              </View>
            )}
          </View>

          {/* Price */}
          <ThemedText className="text-center mt-4 text-lg font-semibold text-highlight">
            MVR {facility.price_per_slot} per slot ({facility.slot_duration_min} min)
          </ThemedText>

          <Divider className="my-6" />

          {/* Description */}
          {facility.description && (
            <>
              <ThemedText className="text-base leading-6">{facility.description}</ThemedText>
              <Divider className="my-6" />
            </>
          )}

          {/* Facility Details */}
          <Section title="Facility Details" titleSize="lg" className="mb-2 mt-2">
            <View className="mt-3">
              <FeatureItem
                icon="Users"
                label="Capacity"
                value={`${facility.capacity ?? '-'} players`}
              />
              <FeatureItem
                icon="Clock"
                label="Duration"
                value={`${facility.slot_duration_min} minutes`}
              />
              <FeatureItem
                icon="Sun"
                label="Hours"
                value={`${facility.operating_start} - ${facility.operating_end}`}
              />
            </View>
          </Section>

          <Divider className="my-4" />

          {/* Availability Section */}
          <Section title="Availability" titleSize="lg" className="mb-6 mt-2">
            {/* Date Picker */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4 mb-4"
            >
              {days.map((day) => {
                const dateStr = formatDate(day);
                const isSelected = dateStr === selectedDate;
                return (
                  <Pressable
                    key={dateStr}
                    onPress={() => {
                      setSelectedDate(dateStr);
                      setSelectedSlot(null);
                    }}
                    className={`items-center justify-center mr-3 px-4 py-3 rounded-xl ${
                      isSelected
                        ? 'bg-highlight'
                        : 'bg-light-secondary dark:bg-dark-secondary'
                    }`}
                  >
                    <ThemedText
                      className={`text-xs font-medium ${
                        isSelected ? 'text-white' : ''
                      }`}
                    >
                      {getDayLabel(day)}
                    </ThemedText>
                    <ThemedText
                      className={`text-lg font-bold mt-1 ${
                        isSelected ? 'text-white' : ''
                      }`}
                    >
                      {day.getDate()}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Time Slots Grid */}
            {slotsLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="small" color={colors.highlight} />
              </View>
            ) : slots.length === 0 ? (
              <View className="items-center py-8">
                <ThemedText className="text-light-subtext dark:text-dark-subtext">
                  No slots available for this date
                </ThemedText>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {slots.map((slot) => {
                  const isSelected =
                    selectedSlot?.start_time === slot.start_time &&
                    selectedSlot?.end_time === slot.end_time;
                  return (
                    <Pressable
                      key={slot.start_time}
                      disabled={!slot.available}
                      onPress={() => setSelectedSlot(slot)}
                      className={`w-[48%] mb-3 px-3 py-3 rounded-lg items-center ${
                        !slot.available
                          ? 'bg-neutral-200 dark:bg-neutral-700 opacity-50'
                          : isSelected
                          ? 'bg-highlight'
                          : 'bg-light-secondary dark:bg-dark-secondary'
                      }`}
                    >
                      <ThemedText
                        className={`text-sm font-medium ${
                          isSelected ? 'text-white' : ''
                        } ${!slot.available ? 'text-neutral-400 dark:text-neutral-500' : ''}`}
                      >
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Section>
        </View>
      </ThemedScroller>

      {/* Bottom Sticky Bar */}
      <View
        style={{ paddingBottom: insets.bottom }}
        className="flex-row items-center justify-start px-global pt-4 border-t border-neutral-200 dark:border-dark-secondary"
      >
        <View className="flex-1">
          {selectedSlot ? (
            <>
              <ThemedText className="text-base font-bold">
                {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
              </ThemedText>
              <ThemedText className="text-xs opacity-60">
                {selectedDate}
              </ThemedText>
            </>
          ) : (
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
              Select a time slot
            </ThemedText>
          )}
        </View>
        <Button
          title="Book Now"
          className="bg-highlight ml-6 px-6"
          textClassName="text-white"
          size="medium"
          rounded="lg"
          disabled={!selectedSlot}
          onPress={handleBookNow}
        />
      </View>
    </>
  );
};

export default FacilityDetail;
