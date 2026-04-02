import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import FacilityCard from '@/components/FacilityCard';
import Icon from '@/components/Icon';
import { Chip } from '@/components/Chip';
import Section from '@/components/layout/Section';
import { FACILITIES, NEIGHBORHOODS, SPORT_LABELS } from '@/data/facilities';
import { Facility, Neighborhood } from '@/types';
import useThemeColors from '@/app/contexts/ThemeColors';
import { useAuth } from '@/app/contexts/AuthContext';

const ALL_SPORTS = ['all', ...Array.from(new Set(FACILITIES.map((f) => f.sport)))];

export default function FacilitiesScreen() {
  const colors = useThemeColors();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | 'all'>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const filtered = useMemo(() => {
    return FACILITIES.filter((f) => {
      if (!f.isActive) return false;
      const matchesSearch =
        !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.sport.toLowerCase().includes(search.toLowerCase()) ||
        f.neighborhoodLabel.toLowerCase().includes(search.toLowerCase());
      const matchesNeighborhood =
        selectedNeighborhood === 'all' || f.neighborhood === selectedNeighborhood;
      const matchesSport = selectedSport === 'all' || f.sport === selectedSport;
      return matchesSearch && matchesNeighborhood && matchesSport;
    });
  }, [search, selectedNeighborhood, selectedSport]);

  const grouped = useMemo(() => {
    if (selectedNeighborhood !== 'all' || selectedSport !== 'all' || search) {
      return [{ label: 'Results', facilities: filtered }];
    }
    return NEIGHBORHOODS.map((n) => ({
      label: n.label,
      facilities: FACILITIES.filter((f) => f.neighborhood === n.id && f.isActive),
    })).filter((g) => g.facilities.length > 0);
  }, [filtered, selectedNeighborhood, selectedSport, search]);

  const openFacility = (facility: Facility) => {
    router.push(`/screens/facility-detail?id=${facility.id}`);
  };

  return (
    <FlatList
      data={grouped}
      keyExtractor={(item) => item.label}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
      ListHeaderComponent={
        <View>
          {/* Header greeting */}
          <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
            <View>
              <ThemedText className="text-2xl font-bold">Sports Facilities</ThemedText>
              {user?.team && (
                <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-0.5">
                  {user.team.name} · {user.team.id}
                </ThemedText>
              )}
            </View>
            <Pressable
              onPress={() => router.push('/screens/notifications')}
              className="w-10 h-10 rounded-full bg-light-secondary dark:bg-dark-secondary items-center justify-center"
            >
              <Icon name="Bell" size={20} color={colors.text} />
            </Pressable>
          </View>

          {/* Search bar */}
          <View className="mx-4 mt-2 mb-3 flex-row items-center bg-light-secondary dark:bg-dark-secondary rounded-2xl px-4 py-3 gap-2">
            <Icon name="Search" size={18} color={colors.placeholder} />
            <TextInput
              className="flex-1 text-sm text-black dark:text-white"
              placeholder="Search facilities, sports..."
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Icon name="X" size={16} color={colors.placeholder} />
              </TouchableOpacity>
            )}
          </View>

          {/* Neighborhood filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 4 }}
            className="mb-2"
          >
            <Chip
              label="All Areas"
              isSelected={selectedNeighborhood === 'all'}
              onPress={() => setSelectedNeighborhood('all')}
              size="sm"
            />
            {NEIGHBORHOODS.map((n) => (
              <Chip
                key={n.id}
                label={n.shortLabel}
                isSelected={selectedNeighborhood === n.id}
                onPress={() => setSelectedNeighborhood(n.id as Neighborhood)}
                size="sm"
              />
            ))}
          </ScrollView>

          {/* Sport filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
          >
            {ALL_SPORTS.map((sport) => (
              <Chip
                key={sport}
                label={sport === 'all' ? 'All Sports' : SPORT_LABELS[sport] ?? sport}
                isSelected={selectedSport === sport}
                onPress={() => setSelectedSport(sport)}
                size="sm"
              />
            ))}
          </ScrollView>

          {/* Result count when filtering */}
          {(search || selectedNeighborhood !== 'all' || selectedSport !== 'all') && (
            <ThemedText className="px-4 mb-2 text-sm text-light-subtext dark:text-dark-subtext">
              {filtered.length} {filtered.length === 1 ? 'facility' : 'facilities'} found
            </ThemedText>
          )}
        </View>
      }
      renderItem={({ item }) =>
        item.facilities.length === 0 ? null : (
          <View className="px-4">
            <Section title={item.label} titleSize="lg" className="mt-2 mb-1">
              {item.facilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  onPress={() => openFacility(facility)}
                />
              ))}
            </Section>
          </View>
        )
      }
      ListEmptyComponent={
        <View className="px-4 mt-16 items-center">
          <Icon name="SearchX" size={40} color={colors.placeholder} />
          <ThemedText className="text-base font-semibold mt-4 text-center">
            No facilities found
          </ThemedText>
          <ThemedText className="text-sm text-light-subtext dark:text-dark-subtext mt-1 text-center">
            Try adjusting your search or filters
          </ThemedText>
        </View>
      }
    />
  );
}
