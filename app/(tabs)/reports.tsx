import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import { Button } from '@/components/Button';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { FACILITIES } from '@/data/facilities';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Compute report data from mock bookings
const confirmedBookings = MOCK_BOOKINGS.filter((b) => b.status === 'confirmed');
const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.priceTotal, 0);
const totalBookings = MOCK_BOOKINGS.length;
const pendingCount = MOCK_BOOKINGS.filter((b) => b.status === 'pending_payment').length;
const expiredCount = MOCK_BOOKINGS.filter((b) => b.status === 'expired').length;

// Per-facility stats
const facilityStats = FACILITIES.map((f) => {
  const fBookings = MOCK_BOOKINGS.filter((b) => b.facilityId === f.id && b.status === 'confirmed');
  return {
    id: f.id,
    name: f.name,
    bookings: fBookings.length,
    revenue: fBookings.reduce((sum, b) => sum + b.priceTotal, 0),
  };
}).sort((a, b) => b.bookings - a.bookings);

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();

  const handleExport = () => {
    Alert.alert('Export', 'Full report export via expo-sharing will be available in production.');
  };

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
          <ThemedText className="text-2xl font-bold">Reports</ThemedText>
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
            Revenue & utilization summary
          </ThemedText>
        </View>
        <Button title="Export" variant="outline" size="small" onPress={handleExport} />
      </View>

      {/* Summary cards */}
      <View className="px-4 mb-4 flex-row flex-wrap gap-3">
        {[
          { label: 'Total Revenue', value: `MVR ${totalRevenue}`, icon: 'Banknote', color: '#16A34A' },
          { label: 'Total Bookings', value: String(totalBookings), icon: 'CalendarDays', color: '#0D9488' },
          { label: 'Conversion Rate', value: `${Math.round((confirmedBookings.length / totalBookings) * 100)}%`, icon: 'TrendingUp', color: '#16A34A' },
          { label: 'Expired/Lost', value: String(expiredCount), icon: 'XCircle', color: '#F59E0B' },
        ].map(({ label, value, icon, color }) => (
          <View
            key={label}
            className="flex-1 min-w-[44%] bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4"
          >
            <View
              style={{ backgroundColor: color + '20' }}
              className="w-9 h-9 rounded-full items-center justify-center mb-2"
            >
              <Icon name={icon as any} size={18} color={color} />
            </View>
            <ThemedText className="text-lg font-bold">{value}</ThemedText>
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mt-0.5">{label}</ThemedText>
          </View>
        ))}
      </View>

      <Divider className="mx-4" />

      {/* Booking status breakdown */}
      <Section title="Status Breakdown" titleSize="base" className="px-4 mt-4 mb-2">
        {[
          { label: 'Confirmed', count: confirmedBookings.length, color: '#16A34A' },
          { label: 'Pending Payment', count: pendingCount, color: '#F59E0B' },
          { label: 'Expired', count: expiredCount, color: '#94A3B8' },
          { label: 'Cancelled', count: MOCK_BOOKINGS.filter((b) => b.status === 'cancelled').length, color: '#EF4444' },
        ].map(({ label, count, color }) => {
          const pct = totalBookings > 0 ? (count / totalBookings) * 100 : 0;
          return (
            <View key={label} className="mb-3">
              <View className="flex-row justify-between mb-1">
                <ThemedText className="text-sm">{label}</ThemedText>
                <ThemedText className="text-sm font-semibold">{count} ({Math.round(pct)}%)</ThemedText>
              </View>
              <View className="h-2 bg-light-secondary dark:bg-dark-secondary rounded-full overflow-hidden">
                <View
                  style={{ width: `${pct}%`, backgroundColor: color }}
                  className="h-full rounded-full"
                />
              </View>
            </View>
          );
        })}
      </Section>

      <Divider className="mx-4" />

      {/* Per-facility breakdown */}
      <Section title="Facility Performance" titleSize="base" className="px-4 mt-4 mb-2">
        {facilityStats.filter((f) => f.bookings > 0).map((f, i) => (
          <View key={f.id} className="flex-row items-center gap-3 mb-3">
            <View className="w-7 h-7 rounded-full bg-hdc-green items-center justify-center">
              <ThemedText className="text-white text-xs font-bold">{i + 1}</ThemedText>
            </View>
            <View className="flex-1">
              <ThemedText className="text-sm font-semibold" numberOfLines={1}>{f.name}</ThemedText>
              <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
                {f.bookings} bookings · MVR {f.revenue}
              </ThemedText>
            </View>
          </View>
        ))}
        {facilityStats.every((f) => f.bookings === 0) && (
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
            No confirmed bookings yet.
          </ThemedText>
        )}
      </Section>
    </ScrollView>
  );
}
