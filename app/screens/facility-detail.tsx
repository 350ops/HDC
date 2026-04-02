import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import Header from '@/components/Header';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import { Chip } from '@/components/Chip';
import { FACILITIES, SPORT_LABELS } from '@/data/facilities';
import { MOCK_OCCUPIED_SLOTS } from '@/data/mockData';
import useThemeColors from '@/app/contexts/ThemeColors';
import { Calendar } from 'react-native-calendars';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function generateTimeSlots(open: string, close: string) {
  const slots: string[] = [];
  const [openH] = open.split(':').map(Number);
  const [closeH] = close.split(':').map(Number);
  for (let h = openH; h < closeH; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
}

export default function FacilityDetailScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  const facility = FACILITIES.find((f) => f.id === id);

  const [selectedDate, setSelectedDate] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  if (!facility) {
    return (
      <View className="flex-1 items-center justify-center bg-light-primary dark:bg-dark-primary">
        <Header showBackButton />
        <Icon name="AlertCircle" size={40} color={colors.placeholder} />
        <ThemedText className="mt-4 text-base">Facility not found</ThemedText>
      </View>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const occupiedSlots = selectedDate
    ? (MOCK_OCCUPIED_SLOTS[`${facility.id}__${selectedDate}`] ?? []).map((s) => s.start)
    : [];
  const timeSlots = generateTimeSlots(facility.operatingHours.open, facility.operatingHours.close);

  const handleBook = () => {
    router.push(
      `/screens/checkout?facilityId=${facility.id}&date=${selectedDate}`
    );
  };

  return (
    <>
      <Header showBackButton title={facility.name} />
      <ScrollView
        className="flex-1 bg-light-primary dark:bg-dark-primary"
        showsVerticalScrollIndicator={false}
      >
        {/* Image carousel */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImage(idx);
            }}
            scrollEventThrottle={200}
          >
            {facility.images.map((img, idx) => (
              <Image
                key={idx}
                source={img}
                style={{ width: SCREEN_WIDTH, height: 240 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Dot indicators */}
          {facility.images.length > 1 && (
            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1.5">
              {facility.images.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-1.5 rounded-full ${idx === activeImage ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </View>
          )}
          {/* Neighborhood badge */}
          <View className="absolute top-3 left-3 bg-black/50 rounded-full px-3 py-1">
            <ThemedText className="text-xs text-white font-medium">
              {facility.neighborhood}
            </ThemedText>
          </View>
        </View>

        <View className="p-4">
          {/* Title + sport */}
          <View className="flex-row items-start justify-between mb-1">
            <ThemedText className="text-xl font-bold flex-1 mr-2">{facility.name}</ThemedText>
            <View className="bg-hdc-green-bg dark:bg-hdc-green/20 rounded-full px-3 py-1 flex-row items-center gap-1">
              <Icon name="Dumbbell" size={11} color="#3AB24E" />
              <ThemedText className="text-xs font-semibold text-hdc-green">
                {SPORT_LABELS[facility.sport]}
              </ThemedText>
            </View>
          </View>
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mb-4">
            {facility.neighborhoodLabel}
          </ThemedText>

          {/* Key info row */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-light-secondary dark:bg-dark-secondary rounded-xl p-3 items-center gap-1">
              <Icon name="Clock" size={18} color="#3AB24E" />
              <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Hours</ThemedText>
              <ThemedText className="text-xs font-semibold text-center">
                {facility.operatingHours.open}–{facility.operatingHours.close}
              </ThemedText>
            </View>
            <View className="flex-1 bg-light-secondary dark:bg-dark-secondary rounded-xl p-3 items-center gap-1">
              <Icon name="Banknote" size={18} color="#3AB24E" />
              <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Rate</ThemedText>
              <ThemedText className="text-xs font-semibold">MVR {facility.pricePerHour}/hr</ThemedText>
            </View>
            {facility.capacity && (
              <View className="flex-1 bg-light-secondary dark:bg-dark-secondary rounded-xl p-3 items-center gap-1">
                <Icon name="Users" size={18} color="#3AB24E" />
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Capacity</ThemedText>
                <ThemedText className="text-xs font-semibold">{facility.capacity}</ThemedText>
              </View>
            )}
          </View>

          <Divider />

          {/* Description */}
          <Section title="About" titleSize="lg" className="mt-4 mb-2">
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext leading-relaxed">
              {facility.description}
            </ThemedText>
          </Section>

          {/* Amenities */}
          {facility.amenities && facility.amenities.length > 0 && (
            <Section title="Amenities" titleSize="lg" className="mt-4 mb-2">
              <View className="flex-row flex-wrap gap-2">
                {facility.amenities.map((a) => (
                  <View
                    key={a}
                    className="flex-row items-center gap-1.5 bg-light-secondary dark:bg-dark-secondary rounded-full px-3 py-1.5"
                  >
                    <Icon name="CheckCircle" size={13} color="#3AB24E" />
                    <ThemedText className="text-sm">{a}</ThemedText>
                  </View>
                ))}
              </View>
            </Section>
          )}

          <Divider className="mt-4" />

          {/* Availability calendar */}
          <Section title="Check Availability" titleSize="lg" className="mt-4 mb-2">
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mb-3">
              Select a date to see available time slots (06:00–23:00)
            </ThemedText>
            <Calendar
              minDate={today}
              onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
              markedDates={
                selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#3AB24E' } } : {}
              }
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                selectedDayBackgroundColor: '#3AB24E',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3AB24E',
                arrowColor: '#3AB24E',
                textSectionTitleColor: colors.text,
                dayTextColor: colors.text,
                monthTextColor: colors.text,
              }}
            />

            {/* Time slots */}
            {selectedDate && (
              <View className="mt-4">
                <ThemedText className="text-sm font-semibold mb-3">
                  Slots for {selectedDate}
                </ThemedText>
                <View className="flex-row flex-wrap gap-2">
                  {timeSlots.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    return (
                      <View
                        key={slot}
                        className={`px-3 py-1.5 rounded-lg border ${
                          isOccupied
                            ? 'border-light-secondary dark:border-dark-secondary bg-light-secondary dark:bg-dark-secondary'
                            : 'border-hdc-green bg-hdc-green-bg dark:bg-hdc-green/10'
                        }`}
                      >
                        <ThemedText
                          className={`text-xs font-medium ${
                            isOccupied
                              ? 'text-light-subtext dark:text-dark-subtext line-through'
                              : 'text-hdc-green'
                          }`}
                        >
                          {slot}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
                <View className="flex-row gap-4 mt-3">
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-3 h-3 rounded-sm bg-hdc-green-bg dark:bg-hdc-green/10 border border-hdc-green" />
                    <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Available</ThemedText>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-3 h-3 rounded-sm bg-light-secondary dark:bg-dark-secondary border border-light-secondary" />
                    <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Occupied</ThemedText>
                  </View>
                </View>
              </View>
            )}
          </Section>
        </View>

        {/* Bottom padding for sticky button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Book button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-light-primary dark:bg-dark-primary border-t border-light-secondary dark:border-dark-secondary px-4 py-3"
      >
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Price per hour</ThemedText>
            <ThemedText className="text-lg font-bold text-hdc-green">
              MVR {facility.pricePerHour}
            </ThemedText>
          </View>
          <Button
            title={selectedDate ? 'Book This Facility' : 'Select a Date First'}
            onPress={handleBook}
            size="medium"
            disabled={!selectedDate}
            className="flex-1 ml-4"
          />
        </View>
      </View>
    </>
  );
}
