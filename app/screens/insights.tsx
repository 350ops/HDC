import React from 'react';
import { View } from 'react-native';

import useThemeColors from '@/app/contexts/ThemeColors';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import ThemedFooter from '@/components/ThemeFooter';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Grid from '@/components/layout/Grid';
import Section from '@/components/layout/Section';
import { shadowPresets } from '@/utils/createShadow';

const InsightsScreen = () => {
  const colors = useThemeColors();

  return (
    <>
      <Header title=" " showBackButton />
      <ThemedScroller className="flex-1" keyboardShouldPersistTaps="handled">
        <Section title="Insights" titleSize="3xl" className="py-10" />
        <Grid columns={2} spacing={10}>
          <InsightCard icon="Calendar" title="Longer Stays" percentage={25} amount="1/4" />
          <InsightCard icon="WashingMachine" title="Amenities" percentage={50} amount="2/4" />
          <InsightCard
            icon="SlidersHorizontal"
            title="Flexible Stays"
            percentage={75}
            amount="3/4"
          />
          <InsightCard icon="Users" title="Family Travel" percentage={50} amount="2/4" />
          <InsightCard icon="Waves" title="Beachfront" percentage={25} amount="1/4" />
          <InsightCard icon="Dog" title="Pet Friendly" percentage={50} amount="2/4" />
          <InsightCard icon="Home" title="Star" percentage={75} amount="3/4" />
        </Grid>
      </ThemedScroller>
    </>
  );
};

const InsightCard = (props: any) => {
  return (
    <View
      style={{ ...shadowPresets.large }}
      className="rounded-3xl bg-light-primary p-4 dark:bg-dark-secondary">
      <Icon
        name={props.icon}
        size={20}
        strokeWidth={2}
        color="white"
        className="mb-20 h-12 w-12 rounded-full bg-highlight"
      />
      <ThemedText className="mb-1 text-xl font-semibold">{props.title}</ThemedText>
      <View className="w-full flex-row items-center">
        <View className="mr-3 h-2 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800">
          <View
            className="h-full rounded-full bg-highlight "
            style={{ width: `${props.percentage}%` }}
          />
        </View>
        <ThemedText className="text-sm opacity-50">{props.amount}</ThemedText>
      </View>
    </View>
  );
};

export default InsightsScreen;
