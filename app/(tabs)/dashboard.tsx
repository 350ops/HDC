import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import BookingCard from '@/components/BookingCard';
import { Button } from '@/components/Button';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Compute stats from mock bookings
const today = new Date().toISOString().split('T')[0];
const bookingsToday = MOCK_BOOKINGS.filter((b) => b.date === today).length;
const pendingPayment = MOCK_BOOKINGS.filter((b) => b.status === 'pending_payment').length;
const confirmedToday = MOCK_BOOKINGS.filter((b) => b.date === today && b.status === 'confirmed').length;
const revenueThisMonth = MOCK_BOOKINGS.filter((b) => b.status === 'confirmed').reduce(
  (sum, b) => sum + b.priceTotal,
  0
);

const STATS = [
  { label: 'Today\'s Bookings', value: String(bookingsToday), icon: 'CalendarDays', color: '#16A34A' },
  { label: 'Pending Payment', value: String(pendingPayment), icon: 'Clock', color: '#F59E0B' },
  { label: 'Confirmed Today', value: String(confirmedToday), icon: 'CheckCircle', color: '#0D9488' },
  { label: 'Revenue (Month)', value: `MVR ${revenueThisMonth}`, icon: 'Banknote', color: '#16A34A' },
];

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const recentBookings = MOCK_BOOKINGS.slice(0, 5);

  return (
    <ScrollView
      className="flex-1 bg-light-primary dark:bg-dark-primary"
      style={{ paddingTop: insets.top }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-4 pt-4 pb-4 flex-row items-center justify-between">
        <View>
          <ThemedText className="text-2xl font-bold">Dashboard</ThemedText>
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
            CSR Sports Facilities Unit · {user?.fullName}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/screens/notifications')}
          className="w-10 h-10 rounded-full bg-light-secondary dark:bg-dark-secondary items-center justify-center"
        >
          <Icon name="Bell" size={20} />
        </TouchableOpacity>
      </View>

      {/* Stats grid */}
      <View className="px-4 mb-4 flex-row flex-wrap gap-3">
        {STATS.map(({ label, value, icon, color }) => (
          <View
            key={label}
            className="flex-1 min-w-[44%] bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4"
          >
            <View
              style={{ backgroundColor: color + '20' }}
              className="w-10 h-10 rounded-full items-center justify-center mb-3"
            >
              <Icon name={icon as any} size={20} color={color} />
            </View>
            <ThemedText className="text-xl font-bold mb-0.5">{value}</ThemedText>
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">{label}</ThemedText>
          </View>
        ))}
      </View>

      <Divider className="mx-4" />

      {/* Quick actions */}
      <Section title="Quick Actions" titleSize="lg" className="px-4 mt-4 mb-2">
        <View className="flex-row gap-3">
          {[
            { label: 'All Bookings', icon: 'CalendarCheck', route: '/(tabs)/admin-bookings' },
            { label: 'Facilities', icon: 'Building2', route: '/(tabs)/listings' },
            { label: 'Reports', icon: 'BarChart2', route: '/(tabs)/reports' },
          ].map(({ label, icon, route }) => (
            <TouchableOpacity
              key={label}
              onPress={() => router.push(route as any)}
              className="flex-1 bg-light-secondary dark:bg-dark-secondary rounded-2xl p-3 items-center gap-2"
            >
              <Icon name={icon as any} size={22} color="#16A34A" />
              <ThemedText className="text-xs text-center font-medium">{label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </Section>

      <Divider className="mx-4 mt-2" />

      {/* Recent bookings */}
      <Section title="Recent Bookings" titleSize="lg" className="px-4 mt-4 mb-2">
        {recentBookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            onPress={() => router.push(`/screens/trip-detail?id=${b.id}`)}
          />
        ))}
        <Button
          title="View All Bookings"
          variant="outline"
          size="medium"
          onPress={() => router.push('/(tabs)/admin-bookings')}
          className="mt-1"
        />
      </Section>
    </ScrollView>
  );
}
