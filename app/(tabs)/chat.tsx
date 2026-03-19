import React, { useState } from 'react';
import { View, FlatList, Pressable } from 'react-native';

import { useCollapsibleTitle } from '@/app/hooks/useCollapsibleTitle';
import AnimatedView from '@/components/AnimatedView';
import { CardScroller } from '@/components/CardScroller';
import { Chip } from '@/components/Chip';
import Header from '@/components/Header';
import Icon, { IconName } from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import { shadowPresets } from '@/utils/createShadow';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: IconName;
  iconBg: string;
  type: 'booking' | 'payment' | 'system' | 'reminder';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your football pitch booking for Mar 20, 4:00 PM has been confirmed.',
    timestamp: '2h ago',
    read: false,
    icon: 'CheckCircle',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    type: 'booking',
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of MVR 500 for Basketball Court booking received.',
    timestamp: '5h ago',
    read: false,
    icon: 'CreditCard',
    iconBg: 'bg-sky-100 dark:bg-sky-900/40',
    type: 'payment',
  },
  {
    id: '3',
    title: 'Upcoming Booking',
    message: "Reminder: Badminton Court tomorrow at 6:00 PM. Don't forget your gear!",
    timestamp: '1d ago',
    read: true,
    icon: 'Clock',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    type: 'reminder',
  },
  {
    id: '4',
    title: 'Booking Pending',
    message: 'Your cricket ground booking for Mar 22 is pending approval from admin.',
    timestamp: '1d ago',
    read: true,
    icon: 'Hourglass',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    type: 'booking',
  },
  {
    id: '5',
    title: 'Facility Maintenance',
    message: 'Swimming Pool will be closed for maintenance on Mar 25-26.',
    timestamp: '2d ago',
    read: true,
    icon: 'AlertTriangle',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    type: 'system',
  },
  {
    id: '6',
    title: 'New Facility Available',
    message: 'A new Tennis Court has been added. Check it out and book your slot!',
    timestamp: '3d ago',
    read: true,
    icon: 'Plus',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    type: 'system',
  },
  {
    id: '7',
    title: 'Booking Cancelled',
    message: 'Your volleyball court booking for Mar 18 was cancelled as requested.',
    timestamp: '4d ago',
    read: true,
    icon: 'XCircle',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    type: 'booking',
  },
];

type FilterType = 'all' | 'unread' | 'bookings' | 'system';

export default function NotificationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const { scrollY, onScroll, scrollEventThrottle } = useCollapsibleTitle();

  const filteredNotifications = mockNotifications.filter((n) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !n.read;
    if (selectedFilter === 'bookings') return n.type === 'booking' || n.type === 'payment';
    if (selectedFilter === 'system') return n.type === 'system' || n.type === 'reminder';
    return true;
  });

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable
      style={!item.read ? shadowPresets.card : undefined}
      className={`mx-4 mb-2 flex-row rounded-2xl p-4 ${
        !item.read ? 'bg-light-primary dark:bg-dark-secondary' : 'bg-transparent'
      }`}>
      <View className={`h-11 w-11 items-center justify-center rounded-full ${item.iconBg}`}>
        <Icon name={item.icon} size={20} strokeWidth={1.8} />
      </View>

      <View className="ml-3 flex-1">
        <View className="mb-0.5 flex-row items-start justify-between">
          <ThemedText
            className={`mr-2 flex-1 text-sm ${!item.read ? 'font-bold' : 'font-medium'}`}
            numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
            {item.timestamp}
          </ThemedText>
        </View>
        <ThemedText
          className="text-xs leading-4 text-light-subtext dark:text-dark-subtext"
          numberOfLines={2}>
          {item.message}
        </ThemedText>
      </View>

      {!item.read && <View className="ml-2 mt-1 h-2.5 w-2.5 rounded-full bg-highlight" />}
    </Pressable>
  );

  return (
    <>
      <Header title="Activity" variant="collapsibleTitle" scrollY={scrollY} />
      <View className="flex-1 bg-light-primary dark:bg-dark-primary">
        <AnimatedView animation="scaleIn" className="flex-1">
          <View className="px-4 py-0">
            <CardScroller className="mb-2" space={5}>
              <Chip
                label="All"
                size="lg"
                isSelected={selectedFilter === 'all'}
                onPress={() => setSelectedFilter('all')}
              />
              <Chip
                label={`Unread (${unreadCount})`}
                size="lg"
                isSelected={selectedFilter === 'unread'}
                onPress={() => setSelectedFilter('unread')}
              />
              <Chip
                label="Bookings"
                size="lg"
                isSelected={selectedFilter === 'bookings'}
                onPress={() => setSelectedFilter('bookings')}
              />
              <Chip
                label="Updates"
                size="lg"
                isSelected={selectedFilter === 'system'}
                onPress={() => setSelectedFilter('system')}
              />
            </CardScroller>
          </View>

          <FlatList
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
            data={filteredNotifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 8, flexGrow: 1 }}
            ListFooterComponent={<View className="h-52" />}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-32">
                <Icon name="BellOff" size={48} strokeWidth={1} className="mb-4 opacity-30" />
                <ThemedText className="text-light-subtext dark:text-dark-subtext">
                  No notifications yet
                </ThemedText>
              </View>
            }
          />
        </AnimatedView>
      </View>
    </>
  );
}
