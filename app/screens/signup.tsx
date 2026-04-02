import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import Input from '@/components/forms/Input';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SignupScreen() {
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!teamId.trim()) newErrors.teamId = 'HDC Team ID is required';
    if (!teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setIsLoading(true);
    // TODO: call authService.register() — for now use mock login
    const result = await login(teamId.trim(), password);
    setIsLoading(false);
    if (result.success) {
      router.replace('/(tabs)/(home)');
    }
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
            <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext">Register your team</ThemedText>
          </View>
        </View>

        <ThemedText className="text-3xl font-bold mb-1">Create Account</ThemedText>
        <ThemedText className="text-light-subtext dark:text-dark-subtext mb-8">
          Team representative registration
        </ThemedText>

        {/* Team info note */}
        <View className="mb-6 bg-hdc-green-bg dark:bg-hdc-green/10 rounded-xl p-4 flex-row gap-3">
          <Icon name="Info" size={16} color="#16A34A" />
          <ThemedText className="text-sm text-hdc-green flex-1 leading-relaxed">
            Your HDC Team ID must match an active registered team. Contact{' '}
            <ThemedText className="font-semibold">hello@hdc.mv</ThemedText> if you don't have one.
          </ThemedText>
        </View>

        <Input
          label="Full Name"
          placeholder="Your full name"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
          containerClassName="mb-4"
        />

        <Input
          label="HDC Team ID"
          placeholder="e.g. TEAM-001"
          value={teamId}
          onChangeText={setTeamId}
          error={errors.teamId}
          autoCapitalize="characters"
          containerClassName="mb-4"
        />

        <Input
          label="Team Name"
          placeholder="Your team's registered name"
          value={teamName}
          onChangeText={setTeamName}
          error={errors.teamName}
          containerClassName="mb-4"
        />

        <Input
          label="Email"
          placeholder="your@email.mv"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          containerClassName="mb-4"
        />

        <Input
          label="Phone Number"
          placeholder="+960 7XXXXXX"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
          containerClassName="mb-4"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          isPassword
          autoCapitalize="none"
          containerClassName="mb-4"
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          isPassword
          autoCapitalize="none"
          containerClassName="mb-6"
        />

        <Button
          title="Create Account"
          onPress={handleSignup}
          loading={isLoading}
          size="large"
          className="mb-6"
        />

        <View className="flex-row justify-center">
          <ThemedText className="text-light-subtext dark:text-dark-subtext">
            Already have an account?{' '}
          </ThemedText>
          <Link href="/screens/login" asChild>
            <Pressable>
              <ThemedText className="text-hdc-green font-semibold">Login</ThemedText>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </>
  );
}
