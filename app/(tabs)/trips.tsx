import React, { useState } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { router } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import BookingCard from '@/components/BookingCard';
import { Chip } from '@/components/Chip';
import Icon from '@/components/Icon';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking, BookingStatus } from '@/types';
import { useAuth } from '@/app/contexts/AuthContext';
import useThemeColors from '@/app/contexts/ThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Filter = 'all' | 'confirmed' | 'pending_payment' | 'expired' | 'cancelled';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'pending_payment', label: 'Pending' },
  { id: 'expired', label: 'Expired' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function MyBookingsScreen() {
  const { user } = useAuth();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  // Show only current user's bookings
  const userBookings = MOCK_BOOKINGS.filter(
    (b) => user?.team ? b.teamId === user.team!.id : true
  );

  const filtered =
    activeFilter === 'all'
      ? userBookings
      : userBookings.filter((b) => b.status === activeFilter);

  const openBooking = (booking: Booking) => {
    router.push(`/screens/trip-detail?id=${booking.id}`);
  };

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <ThemedText className="text-2xl font-bold">My Bookings</ThemedText>
        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
          {user?.team?.name ?? 'Your team'} · {userBookings.length} total
        </ThemedText>
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

      {/* List */}
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
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-1 text-center">
              {activeFilter === 'all'
                ? 'You have no bookings yet. Browse facilities to make your first booking.'
                : `No ${activeFilter.replace('_', ' ')} bookings.`}
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}
