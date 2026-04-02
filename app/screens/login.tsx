import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import Input from '@/components/forms/Input';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginScreen() {
  const { login, loginAsAdmin } = useAuth();
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [teamIdError, setTeamIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let valid = true;
    if (!teamId.trim()) {
      setTeamIdError('HDC Team ID is required');
      valid = false;
    } else {
      setTeamIdError('');
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    const result = await login(teamId.trim(), password);
    setIsLoading(false);
    if (result.success) {
      router.replace('/(tabs)/(home)');
    } else {
      setTeamIdError(result.error ?? 'Login failed. Please try again.');
    }
  };

  const handleAdminLogin = () => {
    loginAsAdmin();
    router.replace('/(tabs)/dashboard');
  };

  return (
    <>
      <Header showBackButton />
      <ScrollView
        className="flex-1 bg-light-primary dark:bg-dark-primary"
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* HDC badge */}
        <View className="flex-row items-center gap-3 mb-8 mt-4">
          <View className="w-12 h-12 rounded-xl bg-hdc-green items-center justify-center">
            <Icon name="Trophy" size={22} color="white" />
          </View>
          <View>
            <ThemedText className="text-xl font-bold">HDC Sports</ThemedText>
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">CSR Facilities Booking</ThemedText>
          </View>
        </View>

        <ThemedText className="text-3xl font-bold mb-1">Welcome back</ThemedText>
        <ThemedText className="text-light-subtext dark:text-dark-subtext mb-8">
          Sign in with your HDC Team ID
        </ThemedText>

        <Input
          label="HDC Team ID"
          placeholder="e.g. TEAM-001"
          value={teamId}
          onChangeText={(text) => {
            setTeamId(text);
            if (teamIdError) setTeamIdError('');
          }}
          error={teamIdError}
          autoCapitalize="characters"
          containerClassName="mb-4"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          isPassword
          autoCapitalize="none"
          containerClassName="mb-3"
        />

        <Link className="text-hdc-green text-sm mb-6" href="/screens/forgot-password">
          Forgot Password?
        </Link>

        <Button
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          size="large"
          className="mb-4"
        />

        {/* Dev helper: admin login */}
        <Pressable
          onPress={handleAdminLogin}
          className="border border-hdc-green rounded-2xl py-3.5 items-center mb-6"
        >
          <ThemedText className="text-hdc-green font-semibold text-sm">
            Login as CSR Admin (Demo)
          </ThemedText>
        </Pressable>

        <View className="flex-row justify-center">
          <ThemedText className="text-light-subtext dark:text-dark-subtext">
            Don't have an account?{' '}
          </ThemedText>
          <Link href="/screens/signup" asChild>
            <Pressable>
              <ThemedText className="text-hdc-green font-semibold">Register</ThemedText>
            </Pressable>
          </Link>
        </View>

        {/* Info note */}
        <View className="mt-8 bg-hdc-green-bg dark:bg-hdc-green/10 rounded-xl p-4 flex-row gap-3">
          <Icon name="Info" size={16} color="#16A34A" />
          <ThemedText className="text-sm text-hdc-green flex-1 leading-relaxed">
            Only HDC-registered sports teams can make bookings. Contact{' '}
            <ThemedText className="font-semibold">hello@hdc.mv</ThemedText> to register your team.
          </ThemedText>
        </View>
      </ScrollView>
    </>
  );
}
