import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';

interface NavItem {
  name: string;
  icon: string;
  onPress: () => void;
}

interface BottomNavBarProps {
  items: NavItem[];
  activeIndex: number;
}

export default function BottomNavBar({ items, activeIndex }: BottomNavBarProps) {
  const { theme } = useTheme();
  const colors = palette[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={24}
            color={activeIndex === index ? colors.green : colors.textSecondary}
          />
          <Text
            style={[
              styles.navLabel,
              {
                color: activeIndex === index ? colors.green : colors.textSecondary,
              },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 4,
    paddingTop: 8,
    justifyContent: 'space-evenly',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
