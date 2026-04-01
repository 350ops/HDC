import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import Section from '@/components/layout/Section';
import Divider from '@/components/layout/Divider';
import { FACILITIES } from '@/data/facilities';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookingConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { ref, facilityId, date, start, end, total } = useLocalSearchParams<{
    ref: string;
    facilityId: string;
    date: string;
    start: string;
    end: string;
    total: string;
  }>();

  const facility = FACILITIES.find((f) => f.id === facilityId);
  const facilityName = facility?.name ?? 'Sports Facility';

  // Entrance animation
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-light-primary dark:bg-dark-primary"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: insets.bottom + 24,
        paddingTop: insets.top,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Success icon */}
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}
        className="items-center mt-12 mb-6"
      >
        <View className="w-24 h-24 rounded-full bg-hdc-green items-center justify-center mb-4">
          <Icon name="CheckCircle" size={52} color="white" />
        </View>
        <ThemedText className="text-2xl font-bold text-center mb-1">Booking Confirmed!</ThemedText>
        <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext text-center px-8">
          Your slot has been confirmed. A confirmation email and SMS will be sent to your registered contact.
        </ThemedText>
      </Animated.View>

      {/* Reference */}
      <View className="mx-4 mb-4 bg-hdc-green-bg dark:bg-hdc-green/10 rounded-2xl p-4 items-center">
        <ThemedText className="text-xs text-hdc-green mb-1">Booking Reference</ThemedText>
        <ThemedText className="text-xl font-mono font-bold text-hdc-green">{ref}</ThemedText>
        <ThemedText className="text-xs text-hdc-green/70 mt-1">Keep this for your records</ThemedText>
      </View>

      {/* Booking details */}
      <View className="mx-4 bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4 gap-3 mb-4">
        {[
          { icon: 'MapPin', label: 'Facility', value: facilityName },
          { icon: 'CalendarDays', label: 'Date', value: date },
          { icon: 'Clock', label: 'Time', value: `${start} – ${end}` },
          { icon: 'Banknote', label: 'Amount Paid', value: `MVR ${total}` },
        ].map(({ icon, label, value }) => (
          <View key={label} className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-hdc-green-bg dark:bg-hdc-green/20 items-center justify-center">
              <Icon name={icon as any} size={15} color="#16A34A" />
            </View>
            <View className="flex-1">
              <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">{label}</ThemedText>
              <ThemedText className="text-sm font-semibold" numberOfLines={1}>{value}</ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Next steps */}
      <Section title="What's Next" titleSize="base" className="mx-4 mb-4">
        <View className="gap-3">
          {[
            { icon: 'Mail', text: 'A confirmation email has been sent with your booking details and receipt.' },
            { icon: 'MessageSquare', text: 'An SMS with your reference number has been sent to your registered phone.' },
            { icon: 'FileText', text: 'Please bring your booking reference to the facility on the day.' },
          ].map(({ icon, text }, i) => (
            <View key={i} className="flex-row gap-3">
              <View className="w-8 h-8 rounded-full bg-light-secondary dark:bg-dark-secondary items-center justify-center mt-0.5">
                <Icon name={icon as any} size={14} color="#16A34A" />
              </View>
              <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext flex-1 leading-relaxed">
                {text}
              </ThemedText>
            </View>
          ))}
        </View>
      </Section>

      {/* Actions */}
      <View className="mx-4 gap-3 mt-2">
        <Button
          title="View My Bookings"
          onPress={() => router.replace('/(tabs)/trips')}
          size="large"
        />
        <Button
          title="Back to Facilities"
          onPress={() => router.replace('/(tabs)/(home)')}
          variant="outline"
          size="large"
        />
      </View>
    </ScrollView>
  );
}
