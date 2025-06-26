// screens/CarbonCounterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

export default function CarbonCounterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CarbonCounter'>>();
  const [distance, setDistance] = useState(''); // km
  const [consumption, setConsumption] = useState(''); // L/100km
  const [emission, setEmission] = useState<number | null>(null);

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

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>Calculadora de Emissão de CO₂</Text>
        <TextInput
          style={styles.input}
          placeholder="Distância (km)"
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
        />
        <TextInput
          style={styles.input}
          placeholder="Consumo (L/100km)"
          keyboardType="numeric"
          value={consumption}
          onChangeText={setConsumption}
        />
        <Button color="#2E8B57" title="Calcular Emissão" onPress={calculateEmission} />
        {emission !== null && (
          <View style={[styles.resultBox, isHigh && styles.highEmission]}>  
            <Text style={styles.resultText}>Emissão de CO₂: {emission} kg</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#2E8B57',
  },
  navText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#2E8B57', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#2E8B57',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
  },
  highEmission: {
    backgroundColor: '#FFCDD2',
  },
  resultText: { fontSize: 18, fontWeight: '600', color: '#333' },
  warning: { marginTop: 8, fontSize: 16, color: '#C62828', fontWeight: '700' },
  linkBox: { marginTop: 15, alignItems: 'center' },
  linkText: { color: '#2E8B57', textDecorationLine: 'underline' },
});
