import { useThemeColors } from 'app/contexts/ThemeColors';
import { TabButton } from 'components/TabButton';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Layout() {
  const colors = useThemeColors();
  const { isAdmin } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList
        style={{
          backgroundColor: colors.bg,
          borderTopColor: colors.secondary,
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
        }}
      >
        {/* ── Team Rep tabs ────────────────────────────────────── */}
        <TabTrigger
          name="(home)"
          href="/(tabs)/(home)"
          asChild
          style={{ display: isAdmin ? 'none' : 'flex' }}
        >
          <TabButton labelAnimated={false} icon="MapPin">Facilities</TabButton>
        </TabTrigger>

        <TabTrigger
          name="calendar"
          href="/(tabs)/calendar"
          asChild
          style={{ display: isAdmin ? 'none' : 'flex' }}
        >
          <TabButton labelAnimated={false} icon="CalendarDays">Availability</TabButton>
        </TabTrigger>

        <TabTrigger
          name="trips"
          href="/(tabs)/trips"
          asChild
          style={{ display: isAdmin ? 'none' : 'flex' }}
        >
          <TabButton labelAnimated={false} icon="Ticket">My Bookings</TabButton>
        </TabTrigger>

        <TabTrigger
          name="profile"
          href="/(tabs)/profile"
          asChild
          style={{ display: isAdmin ? 'none' : 'flex' }}
        >
          <TabButton labelAnimated={false} icon="CircleUser">Profile</TabButton>
        </TabTrigger>

        {/* ── CSR Admin tabs ───────────────────────────────────── */}
        <TabTrigger
          name="dashboard"
          href="/(tabs)/dashboard"
          asChild
          style={{ display: isAdmin ? 'flex' : 'none' }}
        >
          <TabButton labelAnimated={false} icon="LayoutDashboard">Dashboard</TabButton>
        </TabTrigger>

        <TabTrigger
          name="listings"
          href="/(tabs)/listings"
          asChild
          style={{ display: isAdmin ? 'flex' : 'none' }}
        >
          <TabButton labelAnimated={false} icon="Building2">Facilities</TabButton>
        </TabTrigger>

        <TabTrigger
          name="admin-bookings"
          href="/(tabs)/admin-bookings"
          asChild
          style={{ display: isAdmin ? 'flex' : 'none' }}
        >
          <TabButton labelAnimated={false} icon="CalendarCheck">Bookings</TabButton>
        </TabTrigger>

        <TabTrigger
          name="reports"
          href="/(tabs)/reports"
          asChild
          style={{ display: isAdmin ? 'flex' : 'none' }}
        >
          <TabButton labelAnimated={false} icon="BarChart2">Reports</TabButton>
        </TabTrigger>

        <TabTrigger
          name="admin-profile"
          href="/(tabs)/profile"
          asChild
          style={{ display: isAdmin ? 'flex' : 'none' }}
        >
          <TabButton labelAnimated={false} icon="CircleUser">Profile</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
