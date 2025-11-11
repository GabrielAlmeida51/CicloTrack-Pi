import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts';
import { palette } from '../colors';

interface ProgressBarProps {
  value: number;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 8,
  animated = true,
  style,
}) => {
  const { theme } = useTheme();
  const colors = palette[theme];
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, height }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedValue}%`,
            backgroundColor: colors.green,
            height,
          },
          animated && styles.animated,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
  animated: {
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});
