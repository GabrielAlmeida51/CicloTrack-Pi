import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser, useTheme, type UserContextType } from '../contexts';
import { palette } from '../colors';
import {
  ThemedInput,
  ThemedButton,
  LoadingOverlay,
  ErrorBoundary,
} from '../components';
import { authService } from '../services';

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Register'>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const { login } = useUser() as UserContextType;
  const { theme } = useTheme();
  const colors = palette[theme];

  const validateName = (text: string) => {
    setName(text);
    if (text && text.length < 3) {
      setNameError('Mínimo 3 caracteres');
    } else {
      setNameError(null);
    }
  };

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
    if (confirmPassword && text !== confirmPassword) {
      setConfirmError('Senhas não conferem');
    } else if (confirmPassword) {
      setConfirmError(null);
    }
  };

  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    if (text && text !== password) {
      setConfirmError('Senhas não conferem');
    } else {
      setConfirmError(null);
    }
  };

  const handleRegister = async () => {
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (nameError || emailError || passwordError || confirmError) {
      setError('Corrija os erros antes de continuar');
      return;
    }

    if (password !== confirmPassword) {
      setError('Senhas não conferem');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register({ name, email, password });

      if (result.user) {
        login({ email: result.user.email || email, name, totalKm: 0 });
      }
    } catch (e: any) {
      if (e.message?.includes('Network') || e.message?.includes('network')) {
        Alert.alert(
          'Sem conexão',
          'Criar conta em modo offline?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Offline',
              onPress: () => login({ email, name, totalKm: 0 }),
            },
          ]
        );
      } else {
        setError(e.message || 'Erro ao registrar');
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
            <MaterialCommunityIcons name="account-plus" size={54} color={colors.green} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Crie sua conta</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Junte-se à comunidade de ciclistas
          </Text>
        </View>

        <ErrorBoundary error={error} onDismiss={() => setError(null)} />

        <View style={styles.formContainer}>
          <ThemedInput
            label="Nome completo"
            placeholder="Seu nome"
            value={name}
            onChangeText={validateName}
            icon="account-outline"
            error={nameError}
          />

          <ThemedInput
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={validateEmail}
            icon="email-outline"
            keyboardType="email-address"
            error={emailError}
            style={{ marginTop: 16 }}
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

          <ThemedInput
            label="Confirmar senha"
            placeholder="••••••"
            value={confirmPassword}
            onChangeText={validateConfirmPassword}
            icon="lock-check-outline"
            secureTextEntry
            error={confirmError}
            style={{ marginTop: 16 }}
          />

          <ThemedButton
            title="CADASTRAR"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 24 }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Já tem uma conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.loginLink, { color: colors.green }]}>
              Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} message="Criando conta..." />
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
