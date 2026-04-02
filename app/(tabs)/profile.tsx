import React from 'react';
import { View } from 'react-native';
import ThemedText from '@/components/ThemedText';
import Header, { HeaderIcon } from '@/components/Header';
import ListLink from '@/components/ListLink';
import AnimatedView from '@/components/AnimatedView';
import ThemeToggle from '@/components/ThemeToggle';
import ThemedScroller from '@/components/ThemeScroller';
import Divider from '@/components/layout/Divider';
import Icon from '@/components/Icon';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { shadowPresets } from '@/utils/useShadow';

const ROLE_LABELS: Record<string, string> = {
  team_rep: 'Team Representative',
  csr_admin: 'CSR Admin',
  finance: 'Finance',
  sys_admin: 'System Admin',
};

export default function ProfileScreen() {
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/screens/welcome');
  };

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary">
      <Header
        leftComponent={<ThemeToggle />}
        rightComponents={[<HeaderIcon key="bell" icon="Bell" href="/screens/notifications" />]}
      />
      <ThemedScroller>
        <AnimatedView animation="scaleIn" className="pt-4 pb-8">
          {/* Profile card */}
          <View
            style={shadowPresets.large}
            className="mx-4 mb-5 bg-light-secondary dark:bg-dark-secondary rounded-3xl p-6"
          >
            {/* Avatar initials */}
            <View className="items-center mb-4">
              <View className="w-20 h-20 rounded-full bg-hdc-green items-center justify-center mb-3">
                <ThemedText className="text-3xl font-bold text-white">
                  {user?.fullName?.charAt(0) ?? '?'}
                </ThemedText>
              </View>
              <ThemedText className="text-xl font-bold">{user?.fullName ?? 'Guest'}</ThemedText>
              <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
                {user?.email}
              </ThemedText>
            </View>

            {/* Role badge */}
            <View className="flex-row justify-center mb-4">
              <View className="flex-row items-center gap-1.5 bg-hdc-green-bg dark:bg-hdc-green/20 rounded-full px-3 py-1.5">
                <Icon name={isAdmin ? 'ShieldCheck' : 'Users'} size={13} color="#16A34A" />
                <ThemedText className="text-xs font-semibold text-hdc-green">
                  {ROLE_LABELS[user?.role ?? 'team_rep'] ?? user?.role}
                </ThemedText>
              </View>
            </View>

            {/* Team info (for team reps) */}
            {user?.team && (
              <View className="bg-light-primary dark:bg-dark-primary rounded-2xl p-4 gap-2">
                <View className="flex-row items-center gap-2 mb-1">
                  <Icon name="Trophy" size={14} color="#16A34A" />
                  <ThemedText className="text-sm font-semibold text-hdc-green">Team Details</ThemedText>
                </View>
                {[
                  { label: 'Team Name', value: user.team.name },
                  { label: 'HDC Team ID', value: user.team.id },
                  { label: 'Sport', value: user.team.sport },
                ].map(({ label, value }) => (
                  <View key={label} className="flex-row justify-between">
                    <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">{label}</ThemedText>
                    <ThemedText className="text-xs font-semibold">{value}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Navigation links */}
          <View className="px-4 gap-1">
            {!isAdmin && (
              <ListLink showChevron title="My Bookings" icon="Ticket" href="/(tabs)/trips" />
            )}
            <ListLink showChevron title="Notifications" icon="Bell" href="/screens/notifications" />
            <ListLink showChevron title="Edit Profile" icon="UserRoundPen" href="/screens/edit-profile" />
            <ListLink showChevron title="Settings" icon="Settings" href="/screens/settings" />
            <ListLink showChevron title="Help" icon="HelpCircle" href="/screens/help" />
            <Divider className="my-1" />

            <ListLink showChevron title="Logout" icon="LogOut" onPress={handleLogout} />
          </View>

          {/* Contact HDC */}
          <View className="mx-4 mt-5 bg-hdc-green-bg dark:bg-hdc-green/10 rounded-2xl p-4 flex-row gap-3">
            <Icon name="Mail" size={16} color="#16A34A" />
            <View>
              <ThemedText className="text-sm font-semibold text-hdc-green">Contact HDC CSR</ThemedText>
              <ThemedText className="text-xs text-hdc-green/70 mt-0.5">hello@hdc.mv</ThemedText>
            </View>
          </View>
        </AnimatedView>
      </ThemedScroller>
    </View>
  );
}
