// screens/HomeScreen.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../App';

// Para inserir sua foto, coloque o arquivo em /assets/images e ajuste o require abaixo
const bannerImage = require('../assets/bike.jpg');

const bgColor = '#181F23'; // preto/cinza escuro da imagem
const green = '#A3FF6F'; // verde claro da imagem
const grayText = '#BFC9C5';

const screenWidth = Dimensions.get('window').width;
const isSmallScreen = screenWidth < 500;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const { user } = useUser() || {};

  // Animação de fade-in para o texto de impacto
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Dados fictícios para os indicadores e barra de progresso
  const totalCO2 = 5; // toneladas
  const currentCO2 = 2.3; // toneladas
  const progress = currentCO2 / totalCO2;

  return (
    <>
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        {/* Removido o headerRow com o texto 'Bem-vindo ao CicloTrack!' */}
        {/* Navbar fixa no topo */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
            <MaterialCommunityIcons name="home" size={22} color={green} style={{ marginRight: 6 }} />
            <Text style={[styles.navText, { color: green }]}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Routes')} style={styles.navItem}>
            <MaterialCommunityIcons name="map-marker-path" size={22} color={grayText} style={{ marginRight: 6 }} />
            <Text style={styles.navText}>Rotas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CarbonCounter')} style={styles.navItem}>
            <MaterialCommunityIcons name="leaf" size={22} color={grayText} style={{ marginRight: 6 }} />
            <Text style={styles.navText}>CO₂</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.navItem}>
            <MaterialCommunityIcons name="account-circle" size={22} color={grayText} style={{ marginRight: 6 }} />
            <Text style={styles.navText}>Login</Text>
          </TouchableOpacity>
        </View>
        {/* Conteúdo principal com ScrollView para evitar corte em telas pequenas */}
        <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={false}>
          <View style={[styles.containerRow, isSmallScreen && styles.containerColumn]}>
            {/* Texto à esquerda */}
            <View style={[styles.leftContent, isSmallScreen && { width: '100%' }]}>
              <Text style={styles.naturalTitle}>CicloTracK</Text>
              <Text style={styles.landingTitle}>Pedale para o futuro!</Text>
              <Text style={styles.landingDesc}>
                Descubra rotas seguras, calcule seu impacto ambiental e conecte-se com uma comunidade que valoriza a mobilidade sustentável.
              </Text>
              <TouchableOpacity style={styles.readMoreBtn} onPress={() => navigation.navigate('Routes')}>
                <Text style={styles.readMoreText}>COMEÇAR</Text>
              </TouchableOpacity>
              {/* Indicadores/Estatísticas */}
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { marginLeft: 32 }]}>
                  <Text style={styles.statValue}>+1200 km</Text>
                  <Text style={styles.statLabel}>Rotas mapeadas</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>+300</Text>
                  <Text style={styles.statLabel}>Usuários ativos</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>2 t</Text>
                  <Text style={styles.statLabel}>CO₂ economizado</Text>
                </View>
              </View>
            </View>
            {/* Lado direito vazio */}
            <View style={styles.rightContent}>
              {/* Imagem removida para teste visual */}
            </View>
          </View>
        </ScrollView>
      </View>
      {/* Botão de configurações no canto inferior direito, só aparece se logado */}
      {user && user.logged && (
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Config')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="cog" size={32} color={bgColor} />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: bgColor,
    borderBottomWidth: 1,
    borderBottomColor: '#23292D',
    gap: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  navText: {
    color: grayText,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 32,
    backgroundColor: bgColor,
  },
  containerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContent: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 24,
    paddingRight: 24,
  },
  rightContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  naturalTitle: {
    color: green,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 1,
  },
  landingTitle: {
    color: grayText,
    fontSize: 23,
    fontWeight: '600',
    marginBottom: 10,
  },
  landingDesc: {
    color: grayText,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'left',
  },
  readMoreBtn: {
    backgroundColor: green,
    borderRadius: 22,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 4,
  },
  readMoreText: {
    color: bgColor,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  illustration: {
    width: 100,
    height: 130,
    marginTop: 8,
    marginBottom: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bgColor,
    paddingVertical: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 6,
    justifyContent: 'center',
  },
  statCard: {
    backgroundColor: '#23292D',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 13,
    alignItems: 'center',
    minWidth: 70,
  },
  statValue: {
    color: green,
    fontWeight: 'bold',
    fontSize: 15,
  },
  statLabel: {
    color: grayText,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    maxWidth: 260,
    alignSelf: 'center',
  },
  progressLabel: {
    color: grayText,
    fontSize: 12,
    marginBottom: 1,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#23292D',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: green,
    borderRadius: 8,
  },
  progressValue: {
    color: grayText,
    fontSize: 11,
    marginTop: 1,
    textAlign: 'right',
  },
  impactText: {
    color: green,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -4,
    textAlign: 'left',
    maxWidth: 260,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 8,
  },
  gearBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(163,255,111,0.10)',
  },
  title: {
    color: green,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 1,
  },
  settingsBtn: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: green,
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: green,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 300,
  },
});
