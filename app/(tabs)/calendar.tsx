import React, { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ThemedText from '@/components/ThemedText';
import { Chip } from '@/components/Chip';
import Icon from '@/components/Icon';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { FACILITIES } from '@/data/facilities';
import { MOCK_OCCUPIED_SLOTS, MOCK_BOOKINGS } from '@/data/mockData';
import { useAuth } from '@/app/contexts/AuthContext';
import useThemeColors from '@/app/contexts/ThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function buildMarkedDates(facilityId: string): Record<string, any> {
  const today = new Date();
  const marks: Record<string, any> = {};

  // Mark dates 30 days out with availability indicators
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const occupiedKey = `${facilityId}__${dateStr}`;
    const occupied = MOCK_OCCUPIED_SLOTS[occupiedKey] ?? [];

    if (occupied.length === 0) {
      marks[dateStr] = { dots: [{ key: 'avail', color: '#16A34A' }] };
    } else if (occupied.length < 8) {
      marks[dateStr] = { dots: [{ key: 'partial', color: '#F59E0B' }] };
    } else {
      marks[dateStr] = { dots: [{ key: 'full', color: '#EF4444' }] };
    }
  }
  return marks;
}

export default function AvailabilityScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { isAdmin, user } = useAuth();

  const [selectedFacilityId, setSelectedFacilityId] = useState(FACILITIES[0]?.id ?? '');
  const [selectedDate, setSelectedDate] = useState('');
  const [slotStart, setSlotStart] = useState('');
  const [slotEnd, setSlotEnd] = useState('');

  const facility = FACILITIES.find((f) => f.id === selectedFacilityId);
  const today = new Date().toISOString().split('T')[0];

  const markedDates = useMemo(
    () => ({
      ...buildMarkedDates(selectedFacilityId),
      ...(selectedDate
        ? { [selectedDate]: { ...(buildMarkedDates(selectedFacilityId)[selectedDate] ?? {}), selected: true, selectedColor: '#16A34A' } }
        : {}),
    }),
    [selectedFacilityId, selectedDate]
  );

  const occupiedStarts = selectedDate
    ? (MOCK_OCCUPIED_SLOTS[`${selectedFacilityId}__${selectedDate}`] ?? []).map((s) => s.start)
    : [];

  // Admin: show all bookings for selected facility + date
  const adminBookings = isAdmin && selectedDate
    ? MOCK_BOOKINGS.filter(
        (b) => b.facilityId === selectedFacilityId && b.date === selectedDate
      )
    : [];

  const handleBook = () => {
    if (!selectedDate) return;
    router.push(
      `/screens/checkout?facilityId=${selectedFacilityId}&date=${selectedDate}`
    );
  };

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <ThemedText className="text-2xl font-bold">
          {isAdmin ? 'Facility Availability' : 'Check Availability'}
        </ThemedText>
        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
          Select a facility and date to view slots
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Facility selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8, paddingTop: 4 }}
        >
          {FACILITIES.filter((f) => f.isActive).map((f) => (
            <Chip
              key={f.id}
              label={f.name.length > 22 ? f.name.slice(0, 20) + '…' : f.name}
              isSelected={selectedFacilityId === f.id}
              onPress={() => {
                setSelectedFacilityId(f.id);
                setSelectedDate('');
                setSlotStart('');
                setSlotEnd('');
              }}
              size="sm"
            />
          ))}
        </ScrollView>

        {/* Selected facility info */}
        {facility && (
          <View className="mx-4 mb-3 flex-row items-center gap-2 bg-light-secondary dark:bg-dark-secondary rounded-xl px-3 py-2">
            <Icon name="MapPin" size={14} color="#16A34A" />
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext flex-1">
              {facility.neighborhoodLabel} · MVR {facility.pricePerHour}/hr
            </ThemedText>
          </View>
        )}

        {/* Legend */}
        <View className="mx-4 mb-3 flex-row gap-4 flex-wrap">
          {[
            { color: '#16A34A', label: 'Available' },
            { color: '#F59E0B', label: 'Partial' },
            { color: '#EF4444', label: 'Fully Booked' },
          ].map(({ color, label }) => (
            <View key={label} className="flex-row items-center gap-1.5">
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
              <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">{label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Calendar */}
        <View className="mx-4">
          <Calendar
            minDate={today}
            markingType="multi-dot"
            markedDates={markedDates}
            onDayPress={(day: { dateString: string }) => {
              setSelectedDate(day.dateString);
              setSlotStart('');
              setSlotEnd('');
            }}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              selectedDayBackgroundColor: '#16A34A',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#16A34A',
              arrowColor: '#16A34A',
              textSectionTitleColor: colors.text,
              dayTextColor: colors.text,
              monthTextColor: colors.text,
            }}
          />
        </View>

        {/* Time slots */}
        {selectedDate && facility && (
          <View className="mx-4 mt-4">
            <Divider />
            <Section title={`Slots — ${selectedDate}`} titleSize="base" className="mt-4 mb-2">
              {isAdmin ? (
                // Admin: show who has booked
                adminBookings.length > 0 ? (
                  adminBookings.map((b) => (
                    <View
                      key={b.id}
                      className="mb-2 bg-light-secondary dark:bg-dark-secondary rounded-xl p-3 flex-row items-center gap-3"
                    >
                      <View className="w-8 h-8 rounded-full bg-hdc-green-bg items-center justify-center">
                        <Icon name="Users" size={14} color="#16A34A" />
                      </View>
                      <View className="flex-1">
                        <ThemedText className="text-sm font-semibold">{b.teamName}</ThemedText>
                        <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
                          {b.startTime} – {b.endTime} · {b.reference}
                        </ThemedText>
                      </View>
                      <ThemedText
                        className={`text-xs font-semibold ${
                          b.status === 'confirmed' ? 'text-hdc-green' : 'text-hdc-amber'
                        }`}
                      >
                        {b.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </ThemedText>
                    </View>
                  ))
                ) : (
                  <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
                    No bookings for this date.
                  </ThemedText>
                )
              ) : (
                // Team rep: interactive slot grid
                <>
                  <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mb-3">
                    Tap a slot to select. Tap again to extend the range.
                  </ThemedText>
                  <TimeSlotGrid
                    facilityId={selectedFacilityId}
                    date={selectedDate}
                    selectedStart={slotStart}
                    selectedEnd={slotEnd}
                    occupiedStarts={occupiedStarts}
                    onSelectRange={(s, e) => { setSlotStart(s); setSlotEnd(e); }}
                  />
                  {slotStart && slotEnd && (
                    <Button
                      title={`Book ${slotStart}–${slotEnd}`}
                      onPress={handleBook}
                      size="large"
                      className="mt-4"
                    />
                  )}
                </>
              )}
            </Section>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
