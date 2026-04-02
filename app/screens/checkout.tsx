import React, { useState, useRef } from 'react';
import { View, ScrollView, Linking, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import MultiStep, { Step } from '@/components/MultiStep';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import Icon from '@/components/Icon';
import Checkbox from '@/components/forms/Checkbox';
import TimeSlotGrid from '@/components/TimeSlotGrid';
import { Calendar } from 'react-native-calendars';
import { FACILITIES } from '@/data/facilities';
import { MOCK_OCCUPIED_SLOTS, FACILITY_GUIDELINES } from '@/data/mockData';
import { useAuth } from '@/app/contexts/AuthContext';
import useThemeColors from '@/app/contexts/ThemeColors';

// ─── Step 1: Date & Time Slot ─────────────────────────────────────────────────

function DateTimeStep({
  facilityId,
  selectedDate,
  startTime,
  endTime,
  onDateChange,
  onRangeChange,
}: {
  facilityId: string;
  selectedDate: string;
  startTime: string;
  endTime: string;
  onDateChange: (date: string) => void;
  onRangeChange: (start: string, end: string) => void;
}) {
  const colors = useThemeColors();
  const today = new Date().toISOString().split('T')[0];
  const occupiedStarts = selectedDate
    ? (MOCK_OCCUPIED_SLOTS[`${facilityId}__${selectedDate}`] ?? []).map((s) => s.start)
    : [];

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <Section title="Select Date" titleSize="lg" className="mt-4 mb-2">
        <Calendar
          minDate={today}
          onDayPress={(day: { dateString: string }) => {
            onDateChange(day.dateString);
            onRangeChange('', ''); // reset time on date change
          }}
          markedDates={
            selectedDate
              ? { [selectedDate]: { selected: true, selectedColor: '#16A34A' } }
              : {}
          }
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
      </Section>

      {selectedDate && (
        <Section title="Select Time Slot" titleSize="lg" className="mt-2 mb-2">
          <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mb-3">
            Tap a start time, then tap an end time to select a range. Operating hours: 06:00–23:00.
          </ThemedText>
          <TimeSlotGrid
            facilityId={facilityId}
            date={selectedDate}
            selectedStart={startTime}
            selectedEnd={endTime}
            occupiedStarts={occupiedStarts}
            onSelectRange={onRangeChange}
          />
        </Section>
      )}

      {startTime && endTime && (
        <View className="mt-4 bg-hdc-green-bg dark:bg-hdc-green/10 rounded-2xl p-4 flex-row items-center gap-3 mb-6">
          <Icon name="CheckCircle" size={20} color="#16A34A" />
          <View>
            <ThemedText className="text-sm font-semibold text-hdc-green">Slot selected</ThemedText>
            <ThemedText className="text-xs text-hdc-green">
              {selectedDate} · {startTime} – {endTime}
            </ThemedText>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Step 2: Confirm & Guidelines ─────────────────────────────────────────────

function GuidelinesStep({
  facilityName,
  teamName,
  date,
  startTime,
  endTime,
  priceTotal,
  accepted,
  onAcceptChange,
}: {
  facilityName: string;
  teamName: string;
  date: string;
  startTime: string;
  endTime: string;
  priceTotal: number;
  accepted: boolean;
  onAcceptChange: (v: boolean) => void;
}) {
  const durationH =
    parseInt(endTime.split(':')[0], 10) - parseInt(startTime.split(':')[0], 10);

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      {/* Booking summary */}
      <Section title="Booking Summary" titleSize="lg" className="mt-4 mb-2">
        <View className="bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4 gap-3">
          {[
            { label: 'Facility', value: facilityName },
            { label: 'Team', value: teamName },
            { label: 'Date', value: date },
            { label: 'Time', value: `${startTime} – ${endTime} (${durationH}h)` },
            { label: 'Total', value: `MVR ${priceTotal}`, highlight: true },
          ].map(({ label, value, highlight }) => (
            <View key={label} className="flex-row justify-between items-center">
              <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">{label}</ThemedText>
              <ThemedText className={`text-sm font-semibold ${highlight ? 'text-hdc-green' : ''}`}>
                {value}
              </ThemedText>
            </View>
          ))}
        </View>
      </Section>

      <Divider />

      {/* Guidelines */}
      <Section title="Facility Usage Guidelines" titleSize="lg" className="mt-4 mb-2">
        <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mb-3">
          Version {FACILITY_GUIDELINES.version} · Updated {FACILITY_GUIDELINES.lastUpdated}
        </ThemedText>
        {FACILITY_GUIDELINES.sections.map((s) => (
          <View key={s.heading} className="mb-4">
            <ThemedText className="text-sm font-semibold mb-1">{s.heading}</ThemedText>
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext leading-relaxed">
              {s.body}
            </ThemedText>
          </View>
        ))}
      </Section>

      {/* Acceptance checkbox */}
      <View className="mt-2 mb-8 bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4">
        <Checkbox
          label={`I have read and accept the HDC Facility Usage Guidelines (${FACILITY_GUIDELINES.version})`}
          checked={accepted}
          onChange={onAcceptChange}
        />
      </View>
    </ScrollView>
  );
}

// ─── Step 3: Payment via eFaas ────────────────────────────────────────────────

function PaymentStep({
  facilityName,
  date,
  startTime,
  endTime,
  priceTotal,
  bookingRef,
  onPaymentAttempted,
}: {
  facilityName: string;
  date: string;
  startTime: string;
  endTime: string;
  priceTotal: number;
  bookingRef: string;
  onPaymentAttempted: () => void;
}) {
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    // TODO: call paymentService.initiatePayment(bookingRef, priceTotal)
    // For now, open eFaas mock URL
    const efaasUrl = `https://efaas.gov.mv/pay?ref=${bookingRef}&amount=${priceTotal}&currency=MVR`;
    try {
      await Linking.openURL(efaasUrl);
    } catch {
      Alert.alert('Unable to open eFaas', 'Please visit efaas.gov.mv to complete payment.');
    }
    onPaymentAttempted();
    setPaying(false);
  };

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <Section title="Complete Payment" titleSize="lg" className="mt-4 mb-2">
        {/* Slot blocked notice */}
        <View className="bg-hdc-amber-light dark:bg-hdc-amber/10 border border-hdc-amber rounded-2xl p-4 flex-row gap-3 mb-4">
          <Icon name="Clock" size={20} color="#F59E0B" />
          <View className="flex-1">
            <ThemedText className="text-sm font-semibold text-hdc-amber">Slot Reserved — Pay Within 24 Hours</ThemedText>
            <ThemedText className="text-xs text-hdc-amber mt-1 leading-relaxed">
              Your slot has been temporarily blocked. It will be released automatically if payment is not received within 24 hours.
            </ThemedText>
          </View>
        </View>

        {/* Summary */}
        <View className="bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4 gap-3 mb-4">
          <View className="flex-row justify-between">
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">Booking Ref</ThemedText>
            <ThemedText className="text-sm font-mono font-semibold">{bookingRef}</ThemedText>
          </View>
          <View className="flex-row justify-between">
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">Facility</ThemedText>
            <ThemedText className="text-sm font-semibold" numberOfLines={1} style={{ maxWidth: 180 }}>{facilityName}</ThemedText>
          </View>
          <View className="flex-row justify-between">
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">Date & Time</ThemedText>
            <ThemedText className="text-sm font-semibold">{date} · {startTime}–{endTime}</ThemedText>
          </View>
          <Divider />
          <View className="flex-row justify-between items-center">
            <ThemedText className="text-base font-bold">Total</ThemedText>
            <ThemedText className="text-xl font-bold text-hdc-green">MVR {priceTotal}</ThemedText>
          </View>
        </View>

        {/* Pay button */}
        <Button
          title="Proceed to eFaas Payment"
          onPress={handlePay}
          loading={paying}
          size="large"
          className="mb-3"
        />

        <View className="flex-row items-center justify-center gap-2 mb-6">
          <Icon name="Shield" size={14} color="#16A34A" />
          <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
            Secured by eFaas · Maldives Government Payment Gateway
          </ThemedText>
        </View>

        {/* eFaas info */}
        <View className="bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4">
          <ThemedText className="text-sm font-semibold mb-2">How it works</ThemedText>
          {[
            'Tap "Proceed to eFaas Payment" to open the payment gateway.',
            'Complete payment using your eFaas account.',
            'Return to the app — your booking will be confirmed automatically.',
          ].map((step, i) => (
            <View key={i} className="flex-row gap-2 mb-2">
              <View className="w-5 h-5 rounded-full bg-hdc-green items-center justify-center mt-0.5">
                <ThemedText className="text-white text-xs font-bold">{i + 1}</ThemedText>
              </View>
              <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext flex-1 leading-relaxed">
                {step}
              </ThemedText>
            </View>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

// ─── Main checkout screen ─────────────────────────────────────────────────────

export default function CheckoutScreen() {
  const { facilityId, date: preselectedDate } = useLocalSearchParams<{
    facilityId: string;
    date?: string;
  }>();
  const { user } = useAuth();

  const facility = FACILITIES.find((f) => f.id === facilityId);

  const [selectedDate, setSelectedDate] = useState(preselectedDate ?? '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [paymentAttempted, setPaymentAttempted] = useState(false);

  // Generate a booking reference
  const bookingRef = useRef(
    `HDC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
  ).current;

  if (!facility) {
    return (
      <View className="flex-1 items-center justify-center bg-light-primary dark:bg-dark-primary">
        <ThemedText>Facility not found. Please go back and try again.</ThemedText>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const durationH = startTime && endTime
    ? parseInt(endTime.split(':')[0], 10) - parseInt(startTime.split(':')[0], 10)
    : 0;
  const priceTotal = durationH * facility.pricePerHour;

  const handleStepChange = (nextStep: number): boolean => {
    if (nextStep === 1) {
      // Validating step 0: need date + time range
      if (!selectedDate || !startTime || !endTime) {
        Alert.alert('Incomplete', 'Please select a date and time slot before continuing.');
        return false;
      }
    }
    if (nextStep === 2) {
      // Validating step 1: guidelines must be accepted
      if (!guidelinesAccepted) {
        Alert.alert('Guidelines Required', 'You must accept the usage guidelines to proceed.');
        return false;
      }
    }
    return true;
  };

  const handleComplete = () => {
    // Navigate to confirmation
    router.replace(
      `/screens/booking-confirmation?ref=${bookingRef}&facilityId=${facilityId}&date=${selectedDate}&start=${startTime}&end=${endTime}&total=${priceTotal}`
    );
  };

  return (
    <MultiStep
      onComplete={handleComplete}
      onClose={() => router.back()}
      onStepChange={handleStepChange}
      showStepIndicator
    >
      <Step title="Date & Time">
        <DateTimeStep
          facilityId={facility.id}
          selectedDate={selectedDate}
          startTime={startTime}
          endTime={endTime}
          onDateChange={setSelectedDate}
          onRangeChange={(s, e) => { setStartTime(s); setEndTime(e); }}
        />
      </Step>

      <Step title="Confirm & Guidelines">
        <GuidelinesStep
          facilityName={facility.name}
          teamName={user?.team?.name ?? 'Your Team'}
          date={selectedDate}
          startTime={startTime}
          endTime={endTime}
          priceTotal={priceTotal}
          accepted={guidelinesAccepted}
          onAcceptChange={setGuidelinesAccepted}
        />
      </Step>

      <Step title="Payment">
        <PaymentStep
          facilityName={facility.name}
          date={selectedDate}
          startTime={startTime}
          endTime={endTime}
          priceTotal={priceTotal}
          bookingRef={bookingRef}
          onPaymentAttempted={() => setPaymentAttempted(true)}
        />
      </Step>
    </MultiStep>
  );
}
