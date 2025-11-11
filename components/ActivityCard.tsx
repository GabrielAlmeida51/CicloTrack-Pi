import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';
import { ThemedCard } from './ThemedCard';

interface ActivityCardProps {
  title: string;
  distance: number;
  duration: number;
  mode: 'bike' | 'car';
  date: string;
  co2Saved?: number;
  caloriesBurned?: number;
  onPress?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  distance,
  duration,
  mode,
  date,
  co2Saved,
  caloriesBurned,
  onPress,
}) => {
  const { theme } = useTheme();
  const colors = palette[theme];

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getIcon = () => {
    return mode === 'bike' ? 'bike' : 'car';
  };

  return (
    <ThemedCard
      variant="elevated"
      style={[styles.card]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.iconContainer, { backgroundColor: colors.green + '20' }]}>
              <MaterialCommunityIcons name={getIcon()} size={24} color={colors.green} />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(date)}</Text>
            </View>
          </View>
          {onPress && <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />}
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="map-marker-distance" size={18} color={colors.green} />
            <Text style={[styles.statValue, { color: colors.text }]}>{distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={colors.green} />
            <Text style={[styles.statValue, { color: colors.text }]}>{duration} min</Text>
          </View>
          {co2Saved && (
            <View style={styles.stat}>
              <MaterialCommunityIcons name="leaf" size={18} color={colors.green} />
              <Text style={[styles.statValue, { color: colors.text }]}>{co2Saved} kg</Text>
            </View>
          )}
          {caloriesBurned && (
            <View style={styles.stat}>
              <MaterialCommunityIcons name="fire" size={18} color={colors.green} />
              <Text style={[styles.statValue, { color: colors.text }]}>{caloriesBurned} kcal</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
    marginVertical: 4,
  },
  content: {
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '500',
  },
});
