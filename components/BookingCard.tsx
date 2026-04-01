import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Booking, BookingStatus } from '@/types';
import ThemedText from './ThemedText';
import Icon from './Icon';
import { shadowPresets } from '@/utils/useShadow';

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bgClass: string; textClass: string; iconName: string; iconColor: string }
> = {
  pending_payment: {
    label: 'Pending Payment',
    bgClass: 'bg-hdc-amber-light dark:bg-hdc-amber/10',
    textClass: 'text-hdc-amber',
    iconName: 'Clock',
    iconColor: '#F59E0B',
  },
  confirmed: {
    label: 'Confirmed',
    bgClass: 'bg-hdc-green-bg dark:bg-hdc-green/10',
    textClass: 'text-hdc-green',
    iconName: 'CheckCircle',
    iconColor: '#16A34A',
  },
  expired: {
    label: 'Expired',
    bgClass: 'bg-light-secondary dark:bg-dark-secondary',
    textClass: 'text-light-subtext dark:text-dark-subtext',
    iconName: 'XCircle',
    iconColor: '#94A3B8',
  },
  cancelled: {
    label: 'Cancelled',
    bgClass: 'bg-red-50 dark:bg-red-900/10',
    textClass: 'text-red-500',
    iconName: 'Ban',
    iconColor: '#EF4444',
  },
};

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={shadowPresets.small}
      className="mb-3 rounded-2xl overflow-hidden bg-light-primary dark:bg-dark-secondary"
    >
      {/* Status bar accent */}
      <View
        className={`h-1 w-full ${
          booking.status === 'confirmed'
            ? 'bg-hdc-green'
            : booking.status === 'pending_payment'
            ? 'bg-hdc-amber'
            : booking.status === 'cancelled'
            ? 'bg-red-500'
            : 'bg-light-secondary dark:bg-dark-primary'
        }`}
      />

      <View className="p-4">
        {/* Top row: facility + status badge */}
        <View className="flex-row items-start justify-between mb-2">
          <ThemedText className="text-base font-bold flex-1 mr-2" numberOfLines={1}>
            {booking.facilityName}
          </ThemedText>
          <View className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${cfg.bgClass}`}>
            <Icon name={cfg.iconName as any} size={11} color={cfg.iconColor} />
            <ThemedText className={`text-xs font-semibold ${cfg.textClass}`}>{cfg.label}</ThemedText>
          </View>
        </View>

        {/* Date & time */}
        <View className="flex-row items-center gap-1.5 mb-1">
          <Icon name="CalendarDays" size={13} color="#16A34A" />
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
            {booking.date} · {booking.startTime} – {booking.endTime}
          </ThemedText>
        </View>

        {/* Team */}
        <View className="flex-row items-center gap-1.5 mb-3">
          <Icon name="Users" size={13} color="#16A34A" />
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">
            {booking.teamName}
          </ThemedText>
        </View>

        {/* Footer: ref + price */}
        <View className="flex-row items-center justify-between pt-3 border-t border-light-secondary dark:border-dark-primary">
          <ThemedText className="text-xs font-mono text-light-subtext dark:text-dark-subtext">
            {booking.reference}
          </ThemedText>
          <ThemedText className="text-sm font-bold text-hdc-green">
            MVR {booking.priceTotal}
          </ThemedText>
        </View>

        {/* Payment deadline warning */}
        {booking.status === 'pending_payment' && booking.paymentDeadline && (
          <View className="mt-2 flex-row items-center gap-1.5">
            <Icon name="AlertCircle" size={12} color="#F59E0B" />
            <ThemedText className="text-xs text-hdc-amber">
              Pay by {new Date(booking.paymentDeadline).toLocaleString()}
            </ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
