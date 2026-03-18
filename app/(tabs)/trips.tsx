import React, { useMemo } from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { shadowPresets } from '@/utils/useShadow';
import ThemeScroller from '@/components/ThemeScroller';
import AnimatedView from '@/components/AnimatedView';
import Header from '@/components/Header';
import { useCollapsibleTitle } from '@/app/hooks/useCollapsibleTitle';
import { useMyBookings } from '@/lib/hooks';
import { router } from 'expo-router';
import { Booking, Facility } from '@/lib/types';

type BookingWithFacility = Booking & { facility?: Facility };

interface BookingSection {
    title: string;
    data: BookingWithFacility[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300' },
    blocked: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-300' },
    expired: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-500 dark:text-gray-300' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300' },
    rejected: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300' },
    pending_approval: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300' },
};

const SPORT_ICONS: Record<string, string> = {
    football: '\u26BD',
    soccer: '\u26BD',
    basketball: '\uD83C\uDFC0',
    tennis: '\uD83C\uDFBE',
    volleyball: '\uD83C\uDFD0',
    cricket: '\uD83C\uDFCF',
    baseball: '\u26BE',
    swimming: '\uD83C\uDFCA',
    hockey: '\uD83C\uDFD2',
    badminton: '\uD83C\uDFF8',
};

function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatTime(time: string): string {
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const display = hour % 12 || 12;
    return `${display}:${m} ${ampm}`;
}

function getSportIcon(sportType?: string): string {
    if (!sportType) return '\uD83C\uDFDF\uFE0F';
    return SPORT_ICONS[sportType.toLowerCase()] || '\uD83C\uDFDF\uFE0F';
}

const BookingsScreen = () => {
    const { scrollY, scrollHandler, scrollEventThrottle } = useCollapsibleTitle();
    const { bookings, loading, error, refetch } = useMyBookings();

    const sections = useMemo(() => {
        if (!bookings || bookings.length === 0) return [];

        const today = new Date().toISOString().split('T')[0];

        const upcoming: BookingWithFacility[] = [];
        const pendingPayment: BookingWithFacility[] = [];
        const past: BookingWithFacility[] = [];
        const cancelledExpired: BookingWithFacility[] = [];

        for (const booking of bookings) {
            const isFuture = booking.booking_date >= today;
            const status = booking.status;

            if (status === 'expired' || status === 'cancelled' || status === 'rejected') {
                cancelledExpired.push(booking);
            } else if (status === 'blocked' && !isFuture) {
                pendingPayment.push(booking);
            } else if ((status === 'confirmed' || status === 'blocked') && isFuture) {
                upcoming.push(booking);
            } else if (status === 'blocked') {
                pendingPayment.push(booking);
            } else if (booking.booking_date < today && status === 'confirmed') {
                past.push(booking);
            } else {
                // pending_approval or other statuses with future dates go to upcoming
                if (isFuture) upcoming.push(booking);
                else past.push(booking);
            }
        }

        const result: BookingSection[] = [];
        if (upcoming.length > 0) result.push({ title: 'Upcoming', data: upcoming });
        if (pendingPayment.length > 0) result.push({ title: 'Pending Payment', data: pendingPayment });
        if (past.length > 0) result.push({ title: 'Past', data: past });
        if (cancelledExpired.length > 0) result.push({ title: 'Cancelled/Expired', data: cancelledExpired });

        return result;
    }, [bookings]);

    if (loading) {
        return (
            <View className="flex-1 bg-light-primary dark:bg-dark-primary">
                <Header
                    title="My Bookings"
                    variant="collapsibleTitle"
                    scrollY={scrollY}
                />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-light-primary dark:bg-dark-primary">
            <Header
                title="My Bookings"
                variant="collapsibleTitle"
                scrollY={scrollY}
            />
            <AnimatedView animation="scaleIn" className="flex-1">
                <ThemeScroller
                    className="pt-4"
                    onScroll={scrollHandler}
                    scrollEventThrottle={scrollEventThrottle}
                >
                    {(!bookings || bookings.length === 0) ? (
                        <View className="flex-1 items-center justify-center px-6 pt-32">
                            <ThemedText className="text-lg font-bold mb-2">
                                No bookings yet
                            </ThemedText>
                            <ThemedText className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                                Browse facilities to make your first booking
                            </ThemedText>
                            <Pressable
                                onPress={() => router.push('/(tabs)')}
                                className="bg-highlight px-6 py-3 rounded-xl active:opacity-80"
                            >
                                <ThemedText className="text-white font-semibold text-sm">
                                    Browse Facilities
                                </ThemedText>
                            </Pressable>
                        </View>
                    ) : (
                        sections.map((section, sectionIndex) => (
                            <View key={section.title}>
                                <SectionHeader title={section.title} isFirst={sectionIndex === 0} />
                                {section.data.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </View>
                        ))
                    )}
                </ThemeScroller>
            </AnimatedView>
        </View>
    );
};

const SectionHeader = ({ title, isFirst }: { title: string; isFirst: boolean }) => {
    return (
        <View className={`px-4 ${isFirst ? 'mb-2' : 'mt-4 mb-2'}`}>
            <ThemedText className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {title}
            </ThemedText>
        </View>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors = STATUS_COLORS[status] || STATUS_COLORS.expired;
    const label = status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <View className={`px-2 py-0.5 rounded-full ${colors.bg}`}>
            <ThemedText className={`text-xs font-medium ${colors.text}`}>
                {label}
            </ThemedText>
        </View>
    );
};

const BookingCard = ({ booking }: { booking: BookingWithFacility }) => {
    const sportIcon = getSportIcon(booking.facility?.sport_type);

    return (
        <Pressable
            onPress={() => router.push(`/screens/booking-detail?id=${booking.id}`)}
            style={{ ...shadowPresets.large }}
            className="mx-4 mb-3 flex-row items-center rounded-2xl bg-light-primary dark:bg-dark-secondary p-2 active:opacity-80"
        >
            {/* Sport icon placeholder */}
            <View className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 items-center justify-center">
                <ThemedText className="text-3xl">{sportIcon}</ThemedText>
            </View>

            {/* Booking details */}
            <View className="flex-1 px-3">
                <View className="flex-row items-center justify-between mb-1">
                    <ThemedText className="text-base font-bold flex-shrink" numberOfLines={1}>
                        {booking.facility?.name || 'Unknown Facility'}
                    </ThemedText>
                    <StatusBadge status={booking.status} />
                </View>

                <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(booking.booking_date)}
                </ThemedText>

                <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </ThemedText>

                {booking.reference_no && (
                    <ThemedText className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Ref: {booking.reference_no}
                    </ThemedText>
                )}
            </View>
        </Pressable>
    );
};

export default BookingsScreen;
