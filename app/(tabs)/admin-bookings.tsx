import React, { useState } from 'react';
import { View, FlatList, ScrollView, Alert } from 'react-native';
import ThemedText from '@/components/ThemedText';
import BookingCard from '@/components/BookingCard';
import { Chip } from '@/components/Chip';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking, BookingStatus } from '@/types';
import useThemeColors from '@/app/contexts/ThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Filter = 'all' | BookingStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending_payment', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'expired', label: 'Expired' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function AdminBookingsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const filtered =
    activeFilter === 'all' ? bookings : bookings.filter((b) => b.status === activeFilter);

  const handleExport = () => {
    Alert.alert('Export', 'CSV export will be implemented with expo-sharing in production.');
  };

  const openBooking = (b: Booking) => {
    router.push(`/screens/trip-detail?id=${b.id}`);
  };

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <ThemedText className="text-2xl font-bold">All Bookings</ThemedText>
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
            {filtered.length} {activeFilter === 'all' ? 'total' : activeFilter.replace('_', ' ')}
          </ThemedText>
        </View>
        <Button title="Export" variant="outline" size="small" onPress={handleExport} />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8, paddingTop: 4 }}
      >
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            isSelected={activeFilter === f.id}
            onPress={() => setActiveFilter(f.id)}
            size="sm"
          />
        ))}
      </ScrollView>

      {/* Bookings list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BookingCard booking={item} onPress={() => openBooking(item)} />
        )}
        ListEmptyComponent={
          <View className="mt-20 items-center px-4">
            <Icon name="CalendarX" size={44} color={colors.placeholder} />
            <ThemedText className="text-base font-semibold mt-4 text-center">No bookings</ThemedText>
          </View>
        }
      />
    </View>
  );
}
