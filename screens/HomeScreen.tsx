// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      {/* Título */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Bem‑vindo à CicloTrack</Text>
      </View>

      {/* Galeria de fotos (placeholder) */}
      <View style={styles.photoGallery} />

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 CicloTrack. Todos os direitos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#2E8B57',
  },
  navText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  titleSection: { marginVertical: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#2E8B57' },
  photoGallery: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    minHeight: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
  },
  footerText: { color: '#fff', fontSize: 12 },
});
