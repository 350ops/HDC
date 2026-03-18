import { useThemeColors } from 'app/contexts/ThemeColors';
import { TabButton } from 'components/TabButton';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Layout() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList
        style={{
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
        }}
      >
        <TabTrigger name="(home)" href="/(tabs)/(home)" asChild>
          <TabButton labelAnimated={false} icon="Home">Home</TabButton>
        </TabTrigger>

        <TabTrigger name="trips" href="/trips" asChild>
          <TabButton labelAnimated={false} icon="CalendarCheck">Bookings</TabButton>
        </TabTrigger>

        <TabTrigger name="chat" href="/(tabs)/chat" asChild>
          <TabButton labelAnimated={false} hasBadge icon="Bell">Activity</TabButton>
        </TabTrigger>

        <TabTrigger name="profile" href="/profile" asChild>
          <TabButton labelAnimated={false} icon="CircleUser">Profile</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
