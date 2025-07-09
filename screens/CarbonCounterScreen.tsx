// screens/CarbonCounterScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../App';

export default function CarbonCounterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CarbonCounter'>>();
  const { user } = useUser() || {};
  const [distance, setDistance] = useState(''); // km
  const [consumption, setConsumption] = useState(''); // L/100km
  const [emission, setEmission] = useState<number | null>(null);

  const bgColor = '#181F23';
  const green = '#A3FF6F';
  const grayText = '#BFC9C5';

  useEffect(() => {
    if (!user || !user.logged) {
      navigation.replace('Login');
    }
  }, [user]);

  function calculateEmission() {
    const dist = parseFloat(distance.replace(',', '.')) || 0;
    const cons = parseFloat(consumption.replace(',', '.')) || 0;
    const emissionFactor = 2.31; // kg CO2 per liter
    const liters = (dist * cons) / 100;
    const co2 = liters * emissionFactor;
    setEmission(+co2.toFixed(2));
  }

  const showInfo = () => {
    Linking.openURL('https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle');
  };

  const isHigh = emission !== null && emission > 10; // threshold

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navItem}>
          <MaterialCommunityIcons name="home" size={22} color={green} />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Routes')} style={styles.navItem}>
          <MaterialCommunityIcons name="map-marker-path" size={22} color={grayText} />
          <Text style={styles.navText}>Rotas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CarbonCounter')} style={styles.navItem}>
          <MaterialCommunityIcons name="leaf" size={22} color={grayText} />
          <Text style={styles.navText}>CO₂</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.navItem}>
          <MaterialCommunityIcons name="account-circle" size={22} color={grayText} />
          <Text style={styles.navText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>Calculadora de <Text style={styles.titleHighlight}>Emissão de CO₂</Text></Text>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="map-marker-distance" size={22} color={green} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Distância (km)"
            placeholderTextColor={grayText}
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="gas-station" size={22} color={green} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Consumo (L/100km)"
            placeholderTextColor={grayText}
            keyboardType="numeric"
            value={consumption}
            onChangeText={setConsumption}
          />
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={calculateEmission}>
          <MaterialCommunityIcons name="leaf" size={20} color={bgColor} style={{ marginRight: 8 }} />
          <Text style={styles.actionText}>Calcular Emissão</Text>
        </TouchableOpacity>
        {emission !== null && (
          <View style={[styles.resultBox, isHigh && styles.highEmission]}>
            <Text style={styles.resultText}>Emissão de CO₂: <Text style={styles.resultHighlight}>{emission} kg</Text></Text>
            {isHigh && <Text style={styles.warning}>⚠️ Alto nível de emissão!</Text>}
          </View>
        )}
        <TouchableOpacity onPress={showInfo} style={styles.linkBox}>
          <Text style={styles.linkText}>Ver referência de emissões</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: '#181F23',
    borderBottomWidth: 1,
    borderBottomColor: '#23292D',
    gap: 18,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 18,
  },
  navText: {
    color: '#BFC9C5',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#BFC9C5', marginBottom: 24, textAlign: 'center' },
  titleHighlight: { color: '#A3FF6F', fontWeight: 'bold' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#A3FF6F',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#BFC9C5',
    fontSize: 15,
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3FF6F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    alignSelf: 'center',
  },
  actionText: { color: '#181F23', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  resultBox: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(163,255,111,0.07)',
    alignItems: 'center',
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  highEmission: {
    backgroundColor: '#FFCDD2',
  },
  resultText: { fontSize: 18, fontWeight: '600', color: '#BFC9C5' },
  resultHighlight: { color: '#A3FF6F', fontWeight: 'bold' },
  warning: { marginTop: 8, fontSize: 16, color: '#C62828', fontWeight: '700' },
  linkBox: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#A3FF6F', textDecorationLine: 'underline', fontSize: 15 },
});
