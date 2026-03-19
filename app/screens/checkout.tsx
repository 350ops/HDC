import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';

import useThemeColors from '../contexts/ThemeColors';

import { Button } from '@/components/Button';
import Icon, { IconName } from '@/components/Icon';
import MultiStep, { Step } from '@/components/MultiStep';
import ShowRating from '@/components/ShowRating';
import ThemedText from '@/components/ThemedText';
import Toggle from '@/components/Toggle';
import Input from '@/components/forms/Input';
import Selectable from '@/components/forms/Selectable';
import Section from '@/components/layout/Section';

// Mock data for UI display
const PACKAGE_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic Logo Package',
    price: '$99',
    deliveryTime: '3 days',
    icon: 'Pen',
    revisions: '2 revisions',
    features: ['2 initial concepts', 'High resolution files', 'Logo transparency'],
  },
  {
    id: 'standard',
    name: 'Standard Logo Package',
    price: '$199',
    icon: 'Star',
    deliveryTime: '5 days',
    revisions: '5 revisions',
    features: [
      '4 initial concepts',
      'High resolution files',
      'Logo transparency',
      'Source files',
      'Social media kit',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Logo Package',
    price: '$349',
    icon: 'Gem',
    deliveryTime: '7 days',
    revisions: 'Unlimited revisions',
    features: [
      '6 initial concepts',
      'High resolution files',
      'Logo transparency',
      'Source files',
      'Social media kit',
      'Brand guidelines',
      'Stationery design',
    ],
  },
];

// Step Components
const ProjectDetailsStep = () => {
  const [selectedPackage, setSelectedPackage] = useState('standard');

  return (
    <ScrollView className="flex-1 p-4">
      <Section
        title="Logo Design Package"
        titleSize="2xl"
        subtitle="Choose your package"
        className="mb-8 mt-4"
      />

      {PACKAGE_OPTIONS.map((pkg) => (
        <Selectable
          key={pkg.id}
          title={pkg.name}
          description={`${pkg.price} • ${pkg.deliveryTime} • ${pkg.revisions}`}
          icon={pkg.icon as IconName}
          selected={selectedPackage === pkg.id}
          onPress={() => setSelectedPackage(pkg.id)}
          containerClassName="mb-4"
        />
      ))}
    </ScrollView>
  );
};

const PaymentStep = () => {
  const [selectedPayment, setSelectedPayment] = useState('1');
  const colors = useThemeColors();

  // Simple mock payment methods
  const paymentMethods = [
    { id: '1', type: 'visa', label: 'Visa', lastFour: '4242', expiryDate: '05/25' },
    { id: '2', type: 'mastercard', label: 'Mastercard', lastFour: '5678', expiryDate: '08/24' },
  ];

  return (
    <View className="flex-1 p-4">
      <Section
        title="Payment method"
        titleSize="2xl"
        subtitle="Choose a payment method for your design service"
        className="mb-8 mt-4"
      />

      {paymentMethods.map((method) => (
        <Selectable
          key={method.id}
          title={`${method.label} ending in ${method.lastFour}`}
          description={`Expires ${method.expiryDate}`}
          customIcon={<Icon name="CreditCard" size={24} />}
          selected={selectedPayment === method.id}
          onPress={() => setSelectedPayment(method.id)}
          containerClassName="mb-4"
        />
      ))}

      <Selectable
        title="Apple Pay"
        customIcon={<AntDesign name="apple" size={24} color={colors.text} />}
        description="Pay using Apple Pay"
        selected={selectedPayment === 'apple'}
        onPress={() => setSelectedPayment('apple')}
        containerClassName="mb-4"
      />

      <Selectable
        title="Google Pay"
        customIcon={<AntDesign name="google" size={24} color={colors.text} />}
        description="Pay using Google Pay"
        selected={selectedPayment === 'google'}
        onPress={() => setSelectedPayment('google')}
        containerClassName="mb-4"
      />

      <Button
        title="Add New Card"
        iconStart="Plus"
        variant="ghost"
        className="mb-8"
        onPress={() => {}}
      />
    </View>
  );
};

const ReviewStep = () => (
  <ScrollView className="flex-1">
    <Section
      title="Order review"
      titleSize="2xl"
      subtitle="Review your logo design order"
      className="mb-4 mt-4 px-global"
    />
    {/* Service Provider */}
    <View className="mb-4 border-b-8 border-light-secondary px-global py-7 dark:border-dark-darker">
      <View className="flex-row items-center rounded-lg">
        <Image source={require('@/assets/img/user-2.jpg')} className="h-12 w-12 rounded-full" />
        <View className="ml-4 flex-1">
          <View className="flex-1 flex-row items-center justify-between">
            <ThemedText className="text-lg font-bold">Sarah Miller</ThemedText>
            <ShowRating rating={4.9} />
          </View>
          <ThemedText className="text-light-subtext dark:text-dark-subtext">
            Professional Logo Designer
          </ThemedText>
        </View>
      </View>
    </View>
    {/* Service Package */}
    <View className="px-global">
      <View className="rounded-lg bg-light-secondary p-global dark:bg-dark-secondary">
        <View className="mb-2 flex-row">
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <ThemedText className="text-lg font-bold">Standard Logo Package</ThemedText>
              <Icon name="Gem" size={24} className="mr-3" />
            </View>
            <ThemedText className="mt-1 text-light-subtext dark:text-dark-subtext">
              4 initial concepts {'\n'}
              High resolution files {'\n'}
              Logo transparency {'\n'}
              Source files {'\n'}
              Social media kit
            </ThemedText>
            <ThemedText className="mt-2 font-bold">$199.00</ThemedText>
          </View>
        </View>
      </View>

      {/* Project Requirements */}
      <View className="mt-4 rounded-lg bg-light-secondary p-global dark:bg-dark-secondary">
        <ThemedText className="mb-4 text-lg font-bold">Project Requirements</ThemedText>
        <View className="">
          <View className="mb-2 flex-row">
            <ThemedText className="w-1/3 font-bold">Brand:</ThemedText>
            <ThemedText className="flex-1">Horizon Tech</ThemedText>
          </View>
          <View className="mb-2 flex-row">
            <ThemedText className="w-1/3 font-bold">Industry:</ThemedText>
            <ThemedText className="flex-1">Technology</ThemedText>
          </View>
          <View className="mb-2 flex-row">
            <ThemedText className="w-1/3 font-bold">Style:</ThemedText>
            <ThemedText className="flex-1">Modern, Minimalist</ThemedText>
          </View>
          <View className="mb-2 flex-row">
            <ThemedText className="w-1/3 font-bold">Colors:</ThemedText>
            <ThemedText className="flex-1">Blue, White, Gray</ThemedText>
          </View>
        </View>
      </View>

      {/* Payment Method */}
      <View className="mt-4 rounded-lg bg-light-secondary p-global dark:bg-dark-secondary">
        <ThemedText className="mb-4 text-lg font-bold">Payment Method</ThemedText>
        <View className="flex-row items-center rounded-lg">
          <Icon name="CreditCard" size={24} />
          <View className="ml-4">
            <ThemedText className="font-bold">Visa ending in 4242</ThemedText>
            <ThemedText className="text-light-subtext dark:text-dark-subtext">
              Expires 12/25
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Timeline */}
      <View className="mt-4 rounded-lg bg-light-secondary p-global dark:bg-dark-secondary">
        <ThemedText className="mb-4 text-lg font-bold">Delivery Timeline</ThemedText>
        <View className="flex-row items-center rounded-lg">
          <Icon name="Clock" size={24} />
          <View className="ml-4">
            <ThemedText className="font-bold">5 business days</ThemedText>
            <ThemedText className="text-light-subtext dark:text-dark-subtext">
              First draft delivery by Dec 20, 2023
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Order Summary */}
      <View className="px-global py-7">
        <ThemedText className="mb-4 text-lg font-bold">Order Summary</ThemedText>
        <View className=" rounded-lg">
          <View className="mb-2 flex-row justify-between">
            <ThemedText>Service Package</ThemedText>
            <ThemedText>$199.00</ThemedText>
          </View>
          <View className="mb-2 flex-row justify-between">
            <ThemedText>Platform Fee</ThemedText>
            <ThemedText>$19.90</ThemedText>
          </View>
          <View className="my-4 h-[1px] bg-light-secondary dark:bg-dark-secondary" />
          <View className="mb-10 flex-row justify-between">
            <ThemedText className="text-lg font-bold">Total</ThemedText>
            <ThemedText className="text-lg font-bold">$218.90</ThemedText>
          </View>
        </View>
      </View>
    </View>
  </ScrollView>
);

const CheckoutScreen = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <>
      <MultiStep
        onComplete={() => router.push('/screens/order-detail?id=1&fromCheckout=true')}
        onClose={() => router.back()}
        showHeader
        showStepIndicator={false}
        onStepChange={(nextStep) => {
          setCurrentStep(nextStep);
          return true;
        }}>
        <Step title="Project Details">
          <ProjectDetailsStep />
        </Step>

        <Step title="Payment">
          <PaymentStep />
        </Step>

        <Step title="Review">
          <ReviewStep />
        </Step>
      </MultiStep>
    </>
  );
};

export default CheckoutScreen;
