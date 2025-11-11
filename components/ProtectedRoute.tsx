import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useUser } from '../contexts';
import { palette } from '../colors';

interface ProtectedRouteProps {
  children: React.ReactNode;
  screenName: string;
}

export function ProtectedRoute({ children, screenName }: ProtectedRouteProps) {
  const { user, logout } = useUser();
  const { theme } = useTheme();
  const colors = palette[theme];

  const handleLoginPress = async () => {
    await logout?.();
  };

  if (!user?.logged) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="lock-alert"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Acesso Restrito
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Você precisa estar logado para acessar {screenName}
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.green }]}
            onPress={handleLoginPress}
          >
            <MaterialCommunityIcons name="login" size={20} color={colors.background} style={{ marginRight: 8 }} />
            <Text style={[styles.loginButtonText, { color: colors.background }]}>Fazer Login / Cadastro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
