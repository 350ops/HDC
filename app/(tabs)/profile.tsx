import { View, Pressable, Alert } from 'react-native';
import Header, { HeaderIcon } from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Avatar from '@/components/Avatar';
import ListLink from '@/components/ListLink';
import AnimatedView from '@/components/AnimatedView';
import ThemedScroller from '@/components/ThemeScroller';
import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { shadowPresets } from '@/utils/useShadow';
import Divider from '@/components/layout/Divider';
import Icon from '@/components/Icon';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign out');
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User';
  const email = user?.email || 'Not signed in';

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary">
      <Header
        leftComponent={<ThemeToggle />}
        rightComponents={[<HeaderIcon icon="Bell" href="/screens/notifications" />]}
      />
      <ThemedScroller>
        <AnimatedView className="pt-2" animation="scaleIn">
          {/* Profile Card */}
          <View
            style={shadowPresets.large}
            className="items-center mb-6 bg-light-primary dark:bg-dark-secondary rounded-3xl p-8"
          >
            <View className="w-20 h-20 rounded-full bg-highlight/10 items-center justify-center mb-4">
              <Icon name="User" size={36} strokeWidth={1.5} />
            </View>
            <ThemedText className="text-2xl font-bold">{displayName}</ThemedText>
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-1">
              {email}
            </ThemedText>

            {/* Stats Row */}
            <View className="flex-row mt-6 w-full">
              <View className="flex-1 items-center border-r border-light-secondary dark:border-dark-primary">
                <ThemedText className="text-xl font-bold">0</ThemedText>
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Bookings</ThemedText>
              </View>
              <View className="flex-1 items-center border-r border-light-secondary dark:border-dark-primary">
                <ThemedText className="text-xl font-bold">-</ThemedText>
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Team</ThemedText>
              </View>
              <View className="flex-1 items-center">
                <ThemedText className="text-xl font-bold">-</ThemedText>
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">Sport</ThemedText>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="gap-1 px-2">
            <ThemedText className="text-xs font-semibold uppercase tracking-wide text-light-subtext dark:text-dark-subtext mb-2 px-2">
              Account
            </ThemedText>
            <ListLink showChevron title="Edit profile" icon="UserRoundPen" href="/screens/edit-profile" />
            <ListLink showChevron title="My team" icon="Users" href="/screens/team" />
            <ListLink showChevron title="Payment methods" icon="CreditCard" href="/screens/profile/payments" />

            <Divider className="my-3" />

            <ThemedText className="text-xs font-semibold uppercase tracking-wide text-light-subtext dark:text-dark-subtext mb-2 px-2">
              Support
            </ThemedText>
            <ListLink showChevron title="Help & FAQ" icon="HelpCircle" href="/screens/help" />
            <ListLink showChevron title="Report an issue" icon="Flag" href="/screens/report" />
            <ListLink showChevron title="About HDC Sports" icon="Info" href="/screens/about" />

            <Divider className="my-3" />

            <Pressable onPress={handleSignOut} className="flex-row items-center py-3 px-2">
              <Icon name="LogOut" size={20} strokeWidth={1.5} className="mr-3" />
              <ThemedText className="text-base text-red-500">Sign out</ThemedText>
            </Pressable>
          </View>
        </AnimatedView>
      </ThemedScroller>
    </View>
  );
}
