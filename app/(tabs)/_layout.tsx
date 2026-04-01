import React from 'react';
import { DynamicColorIOS, PlatformColor } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Layout() {
  const { isAdmin } = useAuth();

  return (
    <NativeTabs
      labelStyle={{
        color: PlatformColor('label'),
      }}
      tintColor={PlatformColor('label')}
      shadowColor="transparent"
    >
      {/* ── Team Rep tabs ────────────────────────────────────── */}
      <NativeTabs.Trigger name="(home)" hidden={isAdmin}>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' } as any} md="place" />
        <NativeTabs.Trigger.Label>Facilities</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar" hidden={isAdmin}>
        <NativeTabs.Trigger.Icon sf={{ default: 'calendar', selected: 'calendar.circle.fill' } as any} md="calendar_month" />
        <NativeTabs.Trigger.Label>Availability</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="trips" hidden={isAdmin}>
        <NativeTabs.Trigger.Icon sf={{ default: 'ticket', selected: 'ticket.fill' } as any} md="confirmation_number" />
        <NativeTabs.Trigger.Label>My Bookings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      {/* ── CSR Admin tabs ───────────────────────────────────── */}
      <NativeTabs.Trigger name="dashboard" hidden={!isAdmin}>
        <NativeTabs.Trigger.Icon sf={{ default: 'rectangle.3.group', selected: 'rectangle.3.group.fill' } as any} md="dashboard" />
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="listings" hidden={!isAdmin}>
        <NativeTabs.Trigger.Icon sf={{ default: 'building.2', selected: 'building.2.fill' } as any} md="business" />
        <NativeTabs.Trigger.Label>Facilities</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="admin-bookings" hidden={!isAdmin}>
        <NativeTabs.Trigger.Icon sf={{ default: 'calendar.badge.checkmark', selected: 'calendar.badge.checkmark' } as any} md="event_available" />
        <NativeTabs.Trigger.Label>Bookings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="reports" hidden={!isAdmin}>
        <NativeTabs.Trigger.Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' } as any} md="bar_chart" />
        <NativeTabs.Trigger.Label>Reports</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      {/* ── Shared tab (both roles) ─────────────────────────── */}
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' } as any} md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
