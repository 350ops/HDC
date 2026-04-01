import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Switch, Alert } from 'react-native';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import { Chip } from '@/components/Chip';
import { FACILITIES, SPORT_LABELS, NEIGHBORHOODS } from '@/data/facilities';
import { Facility, Neighborhood } from '@/types';
import useThemeColors from '@/app/contexts/ThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FacilityManagementScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [facilities, setFacilities] = useState(FACILITIES);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | 'all'>('all');

  const filtered =
    selectedNeighborhood === 'all'
      ? facilities
      : facilities.filter((f) => f.neighborhood === selectedNeighborhood);

  const toggleActive = (id: string) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const handleEdit = (facility: Facility) => {
    Alert.alert(
      `Edit ${facility.name}`,
      'Facility editor coming soon. This will open a form to edit operating hours, pricing, and blockouts.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="flex-1 bg-light-primary dark:bg-dark-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <ThemedText className="text-2xl font-bold">Manage Facilities</ThemedText>
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
            {facilities.filter((f) => f.isActive).length} active · {facilities.length} total
          </ThemedText>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-hdc-green items-center justify-center">
          <Icon name="Plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Neighborhood filter */}
      <FlatList
        data={[{ id: 'all' as const, shortLabel: 'All Areas' }, ...NEIGHBORHOODS.map((n) => ({ id: n.id as Neighborhood | 'all', shortLabel: n.shortLabel }))]}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8, paddingTop: 4 }}
        renderItem={({ item }) => (
          <Chip
            label={item.shortLabel}
            isSelected={selectedNeighborhood === item.id}
            onPress={() => setSelectedNeighborhood(item.id as Neighborhood | 'all')}
            size="sm"
          />
        )}
      />

      {/* Facility list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mb-3 bg-light-secondary dark:bg-dark-secondary rounded-2xl p-4">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1 mr-2">
                <ThemedText className="text-base font-bold" numberOfLines={1}>
                  {item.name}
                </ThemedText>
                <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext mt-0.5">
                  {item.neighborhoodLabel}
                </ThemedText>
              </View>
              <Switch
                value={item.isActive}
                onValueChange={() => toggleActive(item.id)}
                trackColor={{ true: '#16A34A', false: '#94A3B8' }}
                thumbColor="white"
              />
            </View>

            <View className="flex-row gap-3 mb-3 flex-wrap">
              <View className="flex-row items-center gap-1.5">
                <Icon name="Dumbbell" size={12} color="#16A34A" />
                <ThemedText className="text-xs">{SPORT_LABELS[item.sport]}</ThemedText>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Icon name="Banknote" size={12} color="#16A34A" />
                <ThemedText className="text-xs">MVR {item.pricePerHour}/hr</ThemedText>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Icon name="Clock" size={12} color="#16A34A" />
                <ThemedText className="text-xs">{item.operatingHours.open}–{item.operatingHours.close}</ThemedText>
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                className="flex-1 flex-row items-center justify-center gap-1.5 bg-light-primary dark:bg-dark-primary rounded-xl py-2"
              >
                <Icon name="Pencil" size={13} color="#16A34A" />
                <ThemedText className="text-sm font-medium text-hdc-green">Edit</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-1.5 bg-light-primary dark:bg-dark-primary rounded-xl py-2"
              >
                <Icon name="CalendarX" size={13} color="#F59E0B" />
                <ThemedText className="text-sm font-medium text-hdc-amber">Blockout</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
