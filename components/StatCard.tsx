import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';
import { ThemedCard } from './ThemedCard';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  unit,
  color,
}) => {
  const { theme } = useTheme();
  const colors = palette[theme];
  const displayColor = color || colors.green;

  return (
    <ThemedCard variant="elevated" style={styles.card}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: displayColor + '20' }]}>
          <MaterialCommunityIcons name={icon as any} size={28} color={displayColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: displayColor }]}>{value}</Text>
            {unit && <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>}
          </View>
        </View>
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
  },
});
