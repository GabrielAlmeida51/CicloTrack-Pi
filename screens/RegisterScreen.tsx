// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../App';

const bgColor = '#181F23';
const green = '#A3FF6F';
const grayText = '#BFC9C5';

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Register'>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();

  function handleRegister() {
    login({ email, name });
    navigation.replace('Home');
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.darkCenteredContainer}>
        <View style={styles.darkAvatarContainer}>
          <View style={styles.darkAvatarCircle}>
            <MaterialCommunityIcons name="account-plus" size={54} color={green} />
          </View>
        </View>
        <Text style={styles.darkTitle}>Cadastro</Text>
        <View style={styles.darkInputContainer}>
          <MaterialCommunityIcons name="account-outline" size={22} color={green} style={styles.inputIcon} />
          <TextInput
            placeholder="Nome"
            placeholderTextColor={grayText}
            style={styles.darkInput}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.darkInputContainer}>
          <MaterialCommunityIcons name="email-outline" size={22} color={green} style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={grayText}
            style={styles.darkInput}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.darkInputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={22} color={green} style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={grayText}
            style={styles.darkInput}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity onPress={handleRegister} style={styles.darkButtonWrapper}>
          <View style={styles.darkButton}>
            <Text style={styles.darkButtonText}>CADASTRAR</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkCenteredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  darkAvatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  darkAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#23292D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: green,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  darkTitle: {
    color: grayText,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  darkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: green,
    marginBottom: 22,
    width: '100%',
    paddingHorizontal: 6,
  },
  inputIcon: {
    marginRight: 8,
  },
  darkInput: {
    flex: 1,
    color: grayText,
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 8,
  },
  darkButtonWrapper: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 16,
  },
  darkButton: {
    backgroundColor: green,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: green,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  darkButtonText: {
    color: bgColor,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
  },
});
