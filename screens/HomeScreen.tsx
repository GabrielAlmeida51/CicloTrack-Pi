// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// Para inserir sua foto, coloque o arquivo em /assets/images e ajuste o require abaixo
const bannerImage = require('../assets/bike.jpg');

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

      {/* Título de boas-vindas */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Bem-vindo à CicloTrack</Text>
      </View>

      {/* Foto de destaque */}
      <View style={styles.photoGallery}>
        <Image source={bannerImage} style={styles.photo} resizeMode="cover" />
      </View>

      {/* Descrição do projeto */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Descubra rotas seguras e otimizadas para suas pedaladas, calcule seu impacto ambiental e conecte-se com uma comunidade que valoriza a mobilidade sustentável. Com a CicloTrack, cada pedalada conta para um futuro mais verde.
        </Text>
      </View>

      {/* Acesso rápido */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Routes')}>
          <Text style={styles.actionText}>Planejar Rota</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CarbonCounter')}>
          <Text style={styles.actionText}>Ver CO₂</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 CicloTrack. Todos os direitos reservados.</Text>
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
  navText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  titleSection: { marginVertical: 25, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#2E8B57', fontFamily: 'sans-serif-medium' },
  photoGallery: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  photo: { width: '100%', height: '100%' },
  descriptionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#555',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
  },
  footerText: { color: '#fff', fontSize: 12 },
});
