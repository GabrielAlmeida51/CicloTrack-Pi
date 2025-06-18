// screens/CarbonCounterScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

export default function CarbonCounterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CarbonCounter'>>();

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Routes')}>
          <Text style={styles.navText}>Rotas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CarbonCounter')}>
          <Text style={styles.navText}>CO₂</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.navText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da tela */}
      <View style={styles.content}>
        <Text style={styles.title}>Contador de Carbono</Text>
        {/* Aqui entra a lógica/UI específica do contador */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#2E8B57',
  },
  navText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#2E8B57', marginBottom: 10 },
});
