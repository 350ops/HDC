import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Facility } from '@/types';
import { SPORT_LABELS } from '@/data/facilities';
import ThemedText from './ThemedText';
import Icon from './Icon';
import { shadowPresets } from '@/utils/useShadow';
import useThemeColors from '@/app/contexts/ThemeColors';

const SPORT_ICONS: Record<string, string> = {
  basketball: 'Circle',
  volleyball: 'Circle',
  football: 'Circle',
  netball: 'Circle',
  handball: 'Circle',
  badminton: 'Feather',
  bashi: 'Star',
  'multi-purpose': 'LayoutGrid',
};

interface FacilityCardProps {
  facility: Facility;
  onPress: () => void;
  variant?: 'full' | 'compact';
}

export default function FacilityCard({ facility, onPress, variant = 'full' }: FacilityCardProps) {
  const colors = useThemeColors();
  const sportLabel = SPORT_LABELS[facility.sport] ?? facility.sport;

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{ width: 160, ...shadowPresets.small }}
        className="mr-3"
      >
        <View className="rounded-2xl overflow-hidden bg-light-secondary dark:bg-dark-secondary">
          <Image
            source={{ uri: facility.images[0] }}
            style={{ width: 160, height: 110 }}
            resizeMode="cover"
          />
          <View className="p-2.5">
            <ThemedText className="text-sm font-semibold" numberOfLines={1}>
              {facility.name}
            </ThemedText>
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mt-0.5">
              {sportLabel}
            </ThemedText>
            <ThemedText className="text-xs font-bold text-hdc-green mt-1">
              MVR {facility.pricePerHour}/hr
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={shadowPresets.small}
      className="mb-4 rounded-2xl overflow-hidden bg-light-primary dark:bg-dark-secondary"
    >
      {/* Image */}
      <View className="relative">
        <Image
          source={{ uri: facility.images[0] }}
          style={{ width: '100%', height: 180 }}
          resizeMode="cover"
        />
        {/* Price badge */}
        <View className="absolute bottom-3 right-3 bg-white/90 dark:bg-dark-primary/90 rounded-full px-3 py-1">
          <ThemedText className="text-xs font-bold text-hdc-green">
            MVR {facility.pricePerHour}/hr
          </ThemedText>
        </View>
        {/* Neighborhood badge */}
        <View className="absolute top-3 left-3 bg-black/50 rounded-full px-3 py-1">
          <ThemedText className="text-xs text-white font-medium">
            {facility.neighborhood}
          </ThemedText>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-2">
            <ThemedText className="text-base font-bold mb-0.5" numberOfLines={1}>
              {facility.name}
            </ThemedText>
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
              {facility.neighborhoodLabel}
            </ThemedText>
          </View>
          {/* Sport chip */}
          <View className="bg-hdc-green-bg dark:bg-hdc-green/20 rounded-full px-2.5 py-1 flex-row items-center gap-1">
            <Icon name="Dumbbell" size={10} color="#16A34A" />
            <ThemedText className="text-xs font-semibold text-hdc-green">{sportLabel}</ThemedText>
          </View>
        </View>

        {/* Amenities */}
        {facility.amenities && facility.amenities.length > 0 && (
          <View className="flex-row mt-3 gap-2 flex-wrap">
            {facility.amenities.slice(0, 3).map((amenity) => (
              <View
                key={amenity}
                className="flex-row items-center gap-1 bg-light-secondary dark:bg-dark-primary rounded-full px-2 py-0.5"
              >
                <Icon name="Check" size={9} color={colors.text} />
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
                  {amenity}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-light-secondary dark:border-dark-primary">
          <View className="flex-row items-center gap-1">
            <Icon name="Clock" size={12} color="#16A34A" />
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">
              {facility.operatingHours.open} – {facility.operatingHours.close}
            </ThemedText>
          </View>
          <View className="flex-row items-center gap-1">
            <ThemedText className="text-xs font-semibold text-hdc-green">Book now</ThemedText>
            <Icon name="ChevronRight" size={12} color="#16A34A" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
