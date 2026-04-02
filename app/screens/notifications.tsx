import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';
import { AppNotification, NotificationType } from '@/types';
import useThemeColors from '@/app/contexts/ThemeColors';
import { router } from 'expo-router';

const TYPE_CONFIG: Record<NotificationType, { icon: string; iconColor: string; bgClass: string }> = {
  booking_confirmed: { icon: 'CheckCircle', iconColor: '#16A34A', bgClass: 'bg-hdc-green-bg dark:bg-hdc-green/10' },
  booking_blocked: { icon: 'Clock', iconColor: '#F59E0B', bgClass: 'bg-hdc-amber-light dark:bg-hdc-amber/10' },
  booking_expired: { icon: 'XCircle', iconColor: '#94A3B8', bgClass: 'bg-light-secondary dark:bg-dark-secondary' },
  booking_cancelled: { icon: 'Ban', iconColor: '#EF4444', bgClass: 'bg-red-50 dark:bg-red-900/10' },
  payment_reminder: { icon: 'AlertCircle', iconColor: '#F59E0B', bgClass: 'bg-hdc-amber-light dark:bg-hdc-amber/10' },
};

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const openNotification = (notif: AppNotification) => {
    markRead(notif.id);
    if (notif.bookingId) {
      router.push(`/screens/trip-detail?id=${notif.bookingId}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Header
        showBackButton
        title="Notifications"
        rightComponents={
          unreadCount > 0
            ? [
                <TouchableOpacity key="mark-all" onPress={markAllRead} className="pr-2">
                  <ThemedText className="text-sm text-hdc-green font-medium">Mark all read</ThemedText>
                </TouchableOpacity>,
              ]
            : []
        }
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-light-primary dark:bg-dark-primary"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          unreadCount > 0 ? (
            <View className="mb-3 bg-hdc-green-bg dark:bg-hdc-green/10 rounded-xl px-4 py-2.5">
              <ThemedText className="text-sm text-hdc-green font-medium">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </ThemedText>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const cfg = TYPE_CONFIG[item.type];
          return (
            <TouchableOpacity
              onPress={() => openNotification(item)}
              activeOpacity={0.85}
              className={`mb-3 rounded-2xl p-4 flex-row gap-3 ${
                item.isRead
                  ? 'bg-light-secondary dark:bg-dark-secondary'
                  : 'bg-light-primary dark:bg-dark-secondary border border-hdc-green/20'
              }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center ${cfg.bgClass}`}>
                <Icon name={cfg.icon as any} size={20} color={cfg.iconColor} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-start justify-between mb-0.5">
                  <ThemedText
                    className={`text-sm font-semibold flex-1 mr-2 ${!item.isRead ? 'text-hdc-green' : ''}`}
                    numberOfLines={1}
                  >
                    {item.title}
                  </ThemedText>
                  {!item.isRead && (
                    <View className="w-2 h-2 rounded-full bg-hdc-green mt-1" />
                  )}
                </View>
                <ThemedText
                  className="text-sm text-light-subtext dark:text-dark-subtext leading-relaxed"
                  numberOfLines={3}
                >
                  {item.body}
                </ThemedText>
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </ThemedText>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="mt-20 items-center">
            <Icon name="BellOff" size={44} color={colors.placeholder} />
            <ThemedText className="text-base font-semibold mt-4">No notifications</ThemedText>
          </View>
        }
      />
    </>
  );
}
