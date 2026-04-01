import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import ThemedText from './ThemedText';

// All bookable hours: 06:00–22:00 (last bookable slot starts at 22:00, ends 23:00) per BR-01
const ALL_HOURS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return `${String(h).padStart(2, '0')}:00`;
});

interface TimeSlotGridProps {
  facilityId: string;
  date: string;
  selectedStart: string;
  selectedEnd: string;
  occupiedStarts: string[]; // slot starts already booked
  onSelectRange: (start: string, end: string) => void;
}

export default function TimeSlotGrid({
  selectedStart,
  selectedEnd,
  occupiedStarts,
  onSelectRange,
}: TimeSlotGridProps) {
  const handleSlotPress = (slot: string) => {
    if (occupiedStarts.includes(slot)) return;

    if (!selectedStart) {
      // First tap: set start
      const nextHour = getNextHour(slot);
      onSelectRange(slot, nextHour);
      return;
    }

    if (slot === selectedStart) {
      // Deselect
      onSelectRange('', '');
      return;
    }

    // Extend range: set end to clicked slot+1h (if after start)
    const slotIdx = ALL_HOURS.indexOf(slot);
    const startIdx = ALL_HOURS.indexOf(selectedStart);

    if (slotIdx < startIdx) {
      // Tapped before start — reset selection
      const nextHour = getNextHour(slot);
      onSelectRange(slot, nextHour);
      return;
    }

    // Validate no occupied slots in range
    const rangeEnd = getNextHour(slot);
    const hasConflict = ALL_HOURS.slice(startIdx, slotIdx + 1).some((h) =>
      occupiedStarts.includes(h)
    );
    if (hasConflict) {
      // Reset to new selection
      const nextHour = getNextHour(slot);
      onSelectRange(slot, nextHour);
      return;
    }

    onSelectRange(selectedStart, rangeEnd);
  };

  return (
    <View>
      <View className="flex-row flex-wrap gap-2">
        {ALL_HOURS.map((slot) => {
          const isOccupied = occupiedStarts.includes(slot);
          const isStart = slot === selectedStart;
          const isEnd = slot === getHourBefore(selectedEnd);
          const isInRange =
            selectedStart &&
            selectedEnd &&
            ALL_HOURS.indexOf(slot) >= ALL_HOURS.indexOf(selectedStart) &&
            ALL_HOURS.indexOf(slot) < ALL_HOURS.indexOf(selectedEnd);

          let bgClass = 'bg-light-secondary dark:bg-dark-secondary border-light-secondary dark:border-dark-secondary';
          let textClass = 'text-light-text dark:text-dark-text';

          if (isOccupied) {
            bgClass = 'bg-light-secondary dark:bg-dark-secondary border-light-secondary dark:border-dark-secondary opacity-40';
            textClass = 'text-light-subtext dark:text-dark-subtext line-through';
          } else if (isStart || isEnd) {
            bgClass = 'bg-hdc-green border-hdc-green';
            textClass = 'text-white';
          } else if (isInRange) {
            bgClass = 'bg-hdc-green-bg dark:bg-hdc-green/20 border-hdc-green';
            textClass = 'text-hdc-green font-semibold';
          }

          return (
            <TouchableOpacity
              key={slot}
              onPress={() => handleSlotPress(slot)}
              disabled={isOccupied}
              activeOpacity={0.7}
              className={`px-3 py-2 rounded-xl border ${bgClass}`}
              style={{ minWidth: 70 }}
            >
              <ThemedText className={`text-sm text-center ${textClass}`}>{slot}</ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View className="flex-row gap-4 mt-4 flex-wrap">
        {[
          { color: 'bg-hdc-green', label: 'Selected' },
          { color: 'bg-hdc-green-bg border border-hdc-green', label: 'In range' },
          { color: 'bg-light-secondary dark:bg-dark-secondary opacity-40', label: 'Occupied' },
        ].map(({ color, label }) => (
          <View key={label} className="flex-row items-center gap-1.5">
            <View className={`w-3 h-3 rounded-sm ${color}`} />
            <ThemedText className="text-xs text-light-subtext dark:text-dark-subtext">{label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

function getNextHour(slot: string): string {
  const h = parseInt(slot.split(':')[0], 10);
  return `${String(h + 1).padStart(2, '0')}:00`;
}

function getHourBefore(slot: string): string {
  if (!slot) return '';
  const h = parseInt(slot.split(':')[0], 10);
  return `${String(h - 1).padStart(2, '0')}:00`;
}
