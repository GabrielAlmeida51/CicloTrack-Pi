import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';
import { ThemedCard } from './ThemedCard';
import { ProgressBar } from './ProgressBar';

interface GoalCardProps {
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  icon: string;
  isCompleted?: boolean;
  dueDate?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  title,
  description,
  currentValue,
  targetValue,
  unit,
  icon,
  isCompleted,
  dueDate,
}) => {
  const { theme } = useTheme();
  const colors = palette[theme];
  const progress = Math.min((currentValue / targetValue) * 100, 100);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    const diffTime = d.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    return `${diffDays} dias`;
  };

  return (
    <ThemedCard variant="elevated">
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.green + '20' }]}>
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={colors.green}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
        {isCompleted && (
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.green} />
        )}
      </View>

      <View style={styles.content}>
        <ProgressBar value={progress} />
        <View style={styles.stats}>
          <Text style={[styles.progress, { color: colors.text }]}>
            {currentValue} / {targetValue} {unit}
          </Text>
          {dueDate && (
            <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
              {formatDate(dueDate)}
            </Text>
          )}
        </View>
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
  },
  content: {
    gap: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progress: {
    fontSize: 12,
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 12,
  },
});
