import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts';
import { palette } from '../colors';

interface ThemedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const colors = palette[theme];

  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          shadowColor: colors.green,
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        };
      case 'outlined':
        return {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.card,
        };
    }
  };

  return (
    <View style={[styles.card, getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
});
