import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';

interface ThemedModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: Array<{ label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger' }>;
  closeButton?: boolean;
}

export const ThemedModal: React.FC<ThemedModalProps> = ({
  visible,
  onClose,
  title,
  children,
  actions,
  closeButton = true,
}) => {
  const { theme } = useTheme();
  const colors = palette[theme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {closeButton && (
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.body}>
            {children}
          </View>

          {actions && actions.length > 0 && (
            <View style={styles.footer}>
              {actions.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor:
                        action.variant === 'danger'
                          ? '#EF4444'
                          : action.variant === 'secondary'
                          ? colors.background
                          : colors.green,
                      borderColor: action.variant === 'secondary' ? colors.green : undefined,
                      borderWidth: action.variant === 'secondary' ? 1 : 0,
                    },
                  ]}
                  onPress={action.onPress}
                >
                  <Text
                    style={[
                      styles.actionText,
                      {
                        color:
                          action.variant === 'secondary' ? colors.green : colors.background,
                      },
                    ]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    borderRadius: 12,
    width: '80%',
    maxWidth: 500,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
