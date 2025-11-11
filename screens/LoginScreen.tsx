import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser, useTheme } from '../contexts';
import { palette } from '../colors';
import {
  ThemedInput,
  ThemedButton,
  ThemedCard,
  LoadingOverlay,
  ErrorBoundary,
} from '../components';
import { authService } from '../services';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { login } = useUser();
  const { theme } = useTheme();
  const colors = palette[theme];

  const validateEmail = (text: string) => {
    setEmail(text);
    if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('Email inválido');
    } else {
      setEmailError(null);
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (text && text.length < 6) {
      setPasswordError('Mínimo 6 caracteres');
    } else {
      setPasswordError(null);
    }
  };

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    if (emailError || passwordError) {
      setError('Corrija os erros antes de continuar');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login({ email, password });
      
      if (result.user) {
        login({
          email: result.user.email || email,
          name: result.user.user_metadata?.name || email.split('@')[0],
          totalKm: 0,
        });
      }
    } catch (e: any) {
      if (e.message?.includes('Network') || e.message?.includes('network')) {
        Alert.alert(
          'Sem conexão',
          'Entrar em modo offline?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Offline',
              onPress: () => login({ email, name: email.split('@')[0], totalKm: 0 }),
            },
          ]
        );
      } else {
        setError(e.message || 'Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="bike" size={54} color={colors.green} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>CicloTrack</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Faça login para continuar
          </Text>
        </View>

        <ErrorBoundary error={error} onDismiss={() => setError(null)} />

        <View style={styles.formContainer}>
          <ThemedInput
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={validateEmail}
            icon="email-outline"
            keyboardType="email-address"
            error={emailError}
          />

          <ThemedInput
            label="Senha"
            placeholder="••••••"
            value={password}
            onChangeText={validatePassword}
            icon="lock-outline"
            secureTextEntry
            error={passwordError}
            style={{ marginTop: 16 }}
          />

          <TouchableOpacity style={styles.forgotLink}>
            <Text style={[styles.forgotText, { color: colors.green }]}>
              Esqueceu a senha?
            </Text>
          </TouchableOpacity>

          <ThemedButton
            title="ENTRAR"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: 24 }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Não tem uma conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.signupLink, { color: colors.green }]}>
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} message="Entrando..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    gap: 8,
    marginVertical: 16,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
