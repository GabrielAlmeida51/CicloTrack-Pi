import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';

interface ErrorBoundaryProps {
  error: string | null;
  onDismiss: () => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error, onDismiss }) => {
  const { theme } = useTheme();
  const colors = palette[theme];

  if (!error) return null;

  return (
    <View style={[styles.container, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
        <Text style={[styles.message, { color: '#DC2626' }]}>{error}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
        <MaterialCommunityIcons name="close" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
});
