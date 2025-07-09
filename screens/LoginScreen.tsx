// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../App';

const bgColor = '#181F23';
const green = '#A3FF6F';
const grayText = '#BFC9C5';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useUser();

  function handleLogin() {
    login({ email, name: email.split('@')[0] });
    navigation.replace('Home');
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.darkCenteredContainer}>
        <View style={styles.darkAvatarContainer}>
          <View style={styles.darkAvatarCircle}>
            <MaterialCommunityIcons name="bike" size={54} color={green} />
          </View>
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
        <View style={styles.darkOptionsRow}>
          <TouchableOpacity onPress={() => setRemember(!remember)} style={styles.checkboxCustom}>
            {remember ? (
              <MaterialCommunityIcons name="checkbox-marked" size={22} color={green} />
            ) : (
              <MaterialCommunityIcons name="checkbox-blank-outline" size={22} color={grayText} />
            )}
          </TouchableOpacity>
          <Text style={styles.darkRememberMeText}>Lembrar de mim</Text>
          <TouchableOpacity>
            <Text style={styles.darkForgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.darkButtonWrapper}>
          <View style={styles.darkButton}>
            <Text style={styles.darkButtonText}>ENTRAR</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLinkWrapper}>
          <Text style={styles.registerLinkText}>Não tem uma conta? <Text style={styles.registerLinkHighlight}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '92%',
    maxWidth: 340,
    borderRadius: 40,
    paddingVertical: 48,
    paddingHorizontal: 28,
    backgroundColor: 'rgba(183, 228, 199, 0.32)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 7,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#40916C',
    marginBottom: 16,
    width: '85%',
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 13,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    color: '#B7E4C7',
    marginLeft: 4,
    fontSize: 13,
  },
  forgotText: {
    color: '#B7E4C7',
    fontSize: 13,
    fontStyle: 'italic',
  },
  buttonWrapper: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 8,
  },
  button: {
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1.5,
  },
  checkboxCustom: {
    marginRight: 4,
    padding: 2,
  },
  darkCenteredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  darkAvatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
  darkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: green,
    marginBottom: 22,
    width: '100%',
    paddingHorizontal: 6,
  },
  darkInput: {
    flex: 1,
    color: grayText,
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 8,
  },
  darkOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  darkRememberMeText: {
    color: grayText,
    fontSize: 14,
    marginLeft: 2,
  },
  darkForgotText: {
    color: green,
    fontSize: 14,
    fontStyle: 'italic',
  },
  darkButtonWrapper: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 8,
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
  registerLinkWrapper: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerLinkText: {
    color: grayText,
    fontSize: 15,
  },
  registerLinkHighlight: {
    color: green,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
