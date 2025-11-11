// screens/HomeScreen.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser, useTheme } from '../contexts';
import { palette } from '../colors';

// Para inserir sua foto, coloque o arquivo em /assets/images e ajuste o require abaixo
const bannerImage = require('../assets/bike.jpg');

const screenWidth = Dimensions.get('window').width;
const isSmallScreen = screenWidth < 500;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const { user } = useUser() || {};
  const { theme } = useTheme();
  const colors = palette[theme];
  const bg = colors.background;
  const greenTheme = colors.green;
  const navBg = theme === 'dark' ? colors.background : colors.card;
  const cardBg = colors.card;
  const textMain = colors.text;
  const textSecondary = colors.textSecondary;

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

  const navigateIfLogged = (screen: any) => {
    if (user && user.logged) {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
          {/* Removido o headerRow com o texto 'Bem-vindo ao CicloTrack!' */}
          {/* Navbar fixa no topo */}
          <View style={[styles.navbar, { backgroundColor: navBg, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
              <MaterialCommunityIcons name="home" size={22} color={greenTheme} style={{ marginRight: 6 }} />
              <Text style={[styles.navText, { color: greenTheme }]}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateIfLogged('Routes')} style={styles.navItem}>
              <MaterialCommunityIcons name="map-marker-path" size={22} color={textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.navText, { color: textSecondary }]}>Rotas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateIfLogged('CarbonCounter')} style={styles.navItem}>
              <MaterialCommunityIcons name="leaf" size={22} color={textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.navText, { color: textSecondary }]}>CO₂</Text>
            </TouchableOpacity>
            {user && user.logged && (
              <TouchableOpacity onPress={() => navigation.navigate('Config')} style={styles.navItem}>
                <MaterialCommunityIcons name="cog" size={22} color={textSecondary} style={{ marginRight: 6 }} />
                <Text style={[styles.navText, { color: textSecondary }]}>Config</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Conteúdo principal com ScrollView para evitar corte em telas pequenas */}
          <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: bg }]} horizontal={false}>
            <View style={[styles.containerRow, isSmallScreen && styles.containerColumn, { backgroundColor: bg }]}>
              {/* Texto à esquerda */}
              <View style={[styles.leftContent, isSmallScreen && { width: '100%' }]}>
                <Text style={[styles.naturalTitle, { color: greenTheme }]}>CicloTracK</Text>
                <Text style={[styles.landingTitle, { color: textMain }]}>Pedale para o futuro!</Text>
                <Text style={[styles.landingDesc, { color: textSecondary }]}>Descubra rotas seguras, calcule seu impacto ambiental e conecte-se com uma comunidade que valoriza a mobilidade sustentável.</Text>
                <TouchableOpacity style={[styles.readMoreBtn, { backgroundColor: greenTheme }]} onPress={() => navigateIfLogged('Routes')}>
                  <Text style={[styles.readMoreText, { color: bg }]}>COMEÇAR</Text>
                </TouchableOpacity>
                {/* Botão para Cupons & Conquistas */}
                {user && user.logged && (
                  <TouchableOpacity style={[styles.cuponsBtn, { backgroundColor: greenTheme }]} onPress={() => navigation.navigate('Cupons')}>
                    <MaterialCommunityIcons name="trophy-award" size={20} color={bg} style={{ marginRight: 8 }} />
                    <Text style={[styles.cuponsBtnText, { color: bg }]}>Cupons & Conquistas</Text>
                  </TouchableOpacity>
                )}
                {/* Botão para Conteúdo Educativo */}
                <TouchableOpacity style={[styles.educBtn, { backgroundColor: greenTheme }]} onPress={() => navigateIfLogged('EducationalContent')}>
                  <MaterialCommunityIcons name="book-open-page-variant" size={20} color={bg} style={{ marginRight: 8 }} />
                  <Text style={[styles.educBtnText, { color: bg }]}>Conteúdo Educativo</Text>
                </TouchableOpacity>
                {/* Navegação Rápida */}
                <View style={styles.quickNavSection}>
                  <Text style={[styles.quickNavTitle, { color: greenTheme }]}>Navegação Rápida</Text>
                  <View style={styles.quickNavGrid}>
                    <TouchableOpacity style={[styles.quickNavBtn, { backgroundColor: cardBg, borderColor: greenTheme }]} onPress={() => navigateIfLogged('Routes')}>
                      <MaterialCommunityIcons name="map-marker-path" size={28} color={greenTheme} />
                      <Text style={[styles.quickNavBtnText, { color: greenTheme }]}>Rotas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.quickNavBtn, { backgroundColor: cardBg, borderColor: greenTheme }]} onPress={() => navigateIfLogged('CarbonCounter')}>
                      <MaterialCommunityIcons name="leaf" size={28} color={greenTheme} />
                      <Text style={[styles.quickNavBtnText, { color: greenTheme }]}>CO₂</Text>
                    </TouchableOpacity>
                    {user && user.logged && (
                      <>
                        <TouchableOpacity style={[styles.quickNavBtn, { backgroundColor: cardBg, borderColor: greenTheme }]} onPress={() => navigation.navigate('Config')}>
                          <MaterialCommunityIcons name="cog" size={28} color={greenTheme} />
                          <Text style={[styles.quickNavBtnText, { color: greenTheme }]}>Config</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.quickNavBtn, { backgroundColor: cardBg, borderColor: greenTheme }]} onPress={() => navigation.navigate('Cupons')}>
                          <MaterialCommunityIcons name="trophy-award" size={28} color={greenTheme} />
                          <Text style={[styles.quickNavBtnText, { color: greenTheme }]}>Prêmios</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
                {/* Indicadores/Estatísticas */}
                <View style={styles.statsRow}>
                  <View style={[styles.statCard, { marginLeft: 32, backgroundColor: cardBg }]}>
                    <Text style={[styles.statValue, { color: greenTheme }]}>+1200 km</Text>
                    <Text style={[styles.statLabel, { color: textSecondary }]}>Rotas mapeadas</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: cardBg }]}>
                    <Text style={[styles.statValue, { color: greenTheme }]}>+300</Text>
                    <Text style={[styles.statLabel, { color: textSecondary }]}>Usuários ativos</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: cardBg }]}>
                    <Text style={[styles.statValue, { color: greenTheme }]}>2 t</Text>
                    <Text style={[styles.statLabel, { color: textSecondary }]}>CO₂ economizado</Text>
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
    borderBottomWidth: 1,
    gap: 10,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  navText: {
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
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 1,
  },
  landingTitle: {
    fontSize: 23,
    fontWeight: '600',
    marginBottom: 10,
  },
  landingDesc: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'left',
  },
  readMoreBtn: {
    borderRadius: 22,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 4,
  },
  readMoreText: {
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
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 13,
    alignItems: 'center',
    minWidth: 70,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  statLabel: {
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
    color: '#BFC9C5', // grayText
    fontSize: 12,
    marginBottom: 1,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#23292D', // bgColor
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A3FF6F', // green
    borderRadius: 8,
  },
  progressValue: {
    color: '#BFC9C5', // grayText
    fontSize: 11,
    marginTop: 1,
    textAlign: 'right',
  },
  impactText: {
    color: '#A3FF6F', // green
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
    color: '#A3FF6F', // green
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 1,
  },
  settingsBtn: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#A3FF6F', // green
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A3FF6F', // green
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 300,
  },
  cuponsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3FF6F', // green
    borderRadius: 22,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
    shadowColor: '#A3FF6F', // green
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  cuponsBtnText: {
    color: '#181F23', // bgColor
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  educBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3FF6F', // green
    borderRadius: 22,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
    shadowColor: '#A3FF6F', // green
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  educBtnText: {
    color: '#181F23', // bgColor
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  quickNavSection: {
    marginTop: 24,
    marginBottom: 16,
    width: '100%',
  },
  quickNavTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  quickNavBtn: {
    width: '45%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  quickNavBtnText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
