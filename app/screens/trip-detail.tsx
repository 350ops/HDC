import React from 'react';
import { View, ScrollView, Linking, Alert, Share } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { BookingStatus } from '@/types';

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending_payment: 'Pending Payment',
  confirmed: 'Confirmed',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  pending_payment: 'text-hdc-amber',
  confirmed: 'text-hdc-green',
  expired: 'text-light-subtext',
  cancelled: 'text-red-500',
};

const STATUS_BG: Record<BookingStatus, string> = {
  pending_payment: 'bg-hdc-amber-light dark:bg-hdc-amber/10',
  confirmed: 'bg-hdc-green-bg dark:bg-hdc-green/10',
  expired: 'bg-light-secondary dark:bg-dark-secondary',
  cancelled: 'bg-red-50 dark:bg-red-900/10',
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = MOCK_BOOKINGS.find((b) => b.id === id);

  if (!booking) {
    return (
      <>
        <Header showBackButton title="Booking Detail" />
        <View className="flex-1 items-center justify-center bg-light-primary dark:bg-dark-primary">
          <ThemedText>Booking not found.</ThemedText>
        </View>
      </>
    );
  }

  const handlePayNow = async () => {
    const efaasUrl = `https://efaas.gov.mv/pay?ref=${booking.reference}&amount=${booking.priceTotal}&currency=MVR`;
    try {
      await Linking.openURL(efaasUrl);
    } catch {
      Alert.alert('Unable to open eFaas', 'Please visit efaas.gov.mv to complete payment.');
    }
  };

  const handleShare = async () => {
    await Share.share({
      message: `HDC Sports Booking\nRef: ${booking.reference}\nFacility: ${booking.facilityName}\nDate: ${booking.date} · ${booking.startTime}–${booking.endTime}\nTeam: ${booking.teamName}`,
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Cancellation fees may apply.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // TODO: call bookingService.cancelBooking(booking.id)
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
            router.back();
          },
        },
      ]
    );
  };

  const statusCfg = {
    label: STATUS_LABELS[booking.status],
    color: STATUS_COLOR[booking.status],
    bg: STATUS_BG[booking.status],
  };

  const durationH =
    parseInt(booking.endTime.split(':')[0], 10) - parseInt(booking.startTime.split(':')[0], 10);

  return (
    <>
      <Header
        showBackButton
        title="Booking Detail"
        rightComponents={[
          <Icon key="share" name="Share2" size={22} onPress={handleShare} />,
        ]}
      />
      <ScrollView
        className="flex-1 bg-light-primary dark:bg-dark-primary"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status banner */}
        <View className={`rounded-2xl p-4 mb-4 flex-row items-center gap-3 ${statusCfg.bg}`}>
          <Icon
            name={
              booking.status === 'confirmed'
                ? 'CheckCircle'
                : booking.status === 'pending_payment'
                ? 'Clock'
                : booking.status === 'cancelled'
                ? 'Ban'
                : 'XCircle'
            }
            size={24}
            color={
              booking.status === 'confirmed'
                ? '#16A34A'
                : booking.status === 'pending_payment'
                ? '#F59E0B'
                : '#94A3B8'
            }
          />
          <View>
            <ThemedText className={`text-base font-bold ${statusCfg.color}`}>
              {statusCfg.label}
            </ThemedText>
            {booking.status === 'pending_payment' && booking.paymentDeadline && (
              <ThemedText className="text-xs text-hdc-amber">
                Pay by {new Date(booking.paymentDeadline).toLocaleString()}
              </ThemedText>
            )}
          </View>
        </View>

        {/* Reference */}
        <View className="bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4 items-center mb-4">
          <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mb-1">
            Booking Reference
          </ThemedText>
          <ThemedText className="text-lg font-mono font-bold">{booking.reference}</ThemedText>
        </View>

        {/* Details */}
        <View className="bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4 gap-4 mb-4">
          {[
            { icon: 'MapPin', label: 'Facility', value: booking.facilityName },
            { icon: 'Users', label: 'Team', value: booking.teamName },
            { icon: 'CalendarDays', label: 'Date', value: booking.date },
            { icon: 'Clock', label: 'Time', value: `${booking.startTime} – ${booking.endTime} (${durationH}h)` },
          ].map(({ icon, label, value }) => (
            <View key={label} className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-hdc-green-bg dark:bg-hdc-green/20 items-center justify-center">
                <Icon name={icon as any} size={15} color="#16A34A" />
              </View>
              <View>
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">{label}</ThemedText>
                <ThemedText className="text-sm font-semibold">{value}</ThemedText>
              </View>
            </View>
          ))}

          <Divider />

          <View className="flex-row justify-between items-center">
            <ThemedText className="text-base font-bold">Total</ThemedText>
            <ThemedText className="text-xl font-bold text-hdc-green">MVR {booking.priceTotal}</ThemedText>
          </View>
        </View>

        {/* Guidelines acceptance */}
        {booking.guidelinesAcceptance && (
          <View className="bg-hdc-green-bg dark:bg-hdc-green/10 rounded-2xl p-4 flex-row gap-3 mb-4">
            <Icon name="FileCheck" size={18} color="#16A34A" />
            <View>
              <ThemedText className="text-sm font-semibold text-hdc-green">
                Guidelines Accepted
              </ThemedText>
              <ThemedText className="text-xs text-hdc-green/70">
                Version {booking.guidelinesAcceptance.guidelineVersion} ·{' '}
                {new Date(booking.guidelinesAcceptance.timestamp).toLocaleString()}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Actions */}
        {booking.status === 'pending_payment' && (
          <Button
            title="Pay Now via eFaas"
            onPress={handlePayNow}
            size="large"
            className="mb-3"
          />
        )}

        {(booking.status === 'pending_payment' || booking.status === 'confirmed') && (
          <Button
            title="Cancel Booking"
            onPress={handleCancel}
            variant="outline"
            size="large"
            className="mb-3"
          />
        )}

        <Button
          title="Back to My Bookings"
          onPress={() => router.back()}
          variant="ghost"
          size="large"
        />
      </ScrollView>
    </>
  );
}
