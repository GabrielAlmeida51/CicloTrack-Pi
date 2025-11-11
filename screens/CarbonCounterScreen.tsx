// screens/CarbonCounterScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser, useTheme } from '../contexts';
import { palette } from '../colors';
import { ProtectedRoute } from '../components';

export default function CarbonCounterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CarbonCounter'>>();
  const { user } = useUser() || {};
  const [distance, setDistance] = useState(''); // km evitados
  const [consumption, setConsumption] = useState(''); // km/L
  const [emissionSaved, setEmissionSaved] = useState<number | null>(null);
  const { theme } = useTheme();
  const colors = palette[theme];
  const bg = colors.background;
  const greenTheme = colors.green;
  const textSecondary = colors.textSecondary;

  // Removida navegação forçada; App.tsx decide o stack
  useEffect(() => {
    // se não logado, apenas limitar ações sensíveis
  }, [user]);

  function calculateEmissionSaved() {
    const kmEvitados = parseFloat(distance.replace(',', '.')) || 0;
    const consumoKmL = parseFloat(consumption.replace(',', '.')) || 0;
    const fatorEmissao = 2.31; // kg CO2 por litro (gasolina)
    if (kmEvitados > 0 && consumoKmL > 0) {
      const litrosEvitados = kmEvitados / consumoKmL;
      const co2Evitado = litrosEvitados * fatorEmissao;
      setEmissionSaved(+co2Evitado.toFixed(2));
    } else {
      setEmissionSaved(null);
    }
  }

  const showInfo = () => {
    Linking.openURL('https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle');
  };

  const isHigh = emissionSaved !== null && emissionSaved > 10; // threshold

  return (
    <ProtectedRoute screenName="Contador de Carbono">
      <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Calculadora de <Text style={[styles.titleHighlight, { color: greenTheme }]}>CO₂ Evitado</Text></Text>
        <View style={[styles.inputRow, { borderBottomColor: greenTheme }]}>
          <MaterialCommunityIcons name="map-marker-distance" size={22} color={greenTheme} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Km evitados (ex: 10)"
            placeholderTextColor={textSecondary}
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
          />
        </View>
        <View style={[styles.inputRow, { borderBottomColor: greenTheme }]}>
          <MaterialCommunityIcons name="gas-station" size={22} color={greenTheme} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Consumo do carro (km/L)"
            placeholderTextColor={textSecondary}
            keyboardType="numeric"
            value={consumption}
            onChangeText={setConsumption}
          />
        </View>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: greenTheme, shadowColor: greenTheme }]} onPress={calculateEmissionSaved}>
          <MaterialCommunityIcons name="leaf" size={20} color={bg} style={{ marginRight: 8 }} />
          <Text style={[styles.actionText, { color: bg }]}>Calcular CO₂ Evitado</Text>
        </TouchableOpacity>
        {emissionSaved !== null && (
          <View style={[styles.resultBox, emissionSaved > 10 && styles.highEmission, { backgroundColor: emissionSaved <= 10 ? `rgba(58, 125, 44, 0.1)` : '#FFCDD2', shadowColor: greenTheme }]}>
            <Text style={[styles.resultText, { color: greenTheme }]}>CO₂ evitado: <Text style={[styles.resultHighlight, { color: greenTheme }]}>{emissionSaved} kg</Text></Text>
            {emissionSaved > 10 && <Text style={styles.warning}>Parabéns! Usando a bicicleta você evitou muita emissão! 🌱</Text>}
          </View>
        )}
        <TouchableOpacity onPress={() => Linking.openURL('https://www.gov.br/pt-br/servicos/calcular-a-emissao-de-co2-de-veiculos')} style={styles.linkBox}>
          <Text style={[styles.linkText, { color: greenTheme }]}>Ver referência de cálculo</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  titleHighlight: { fontWeight: 'bold' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 8,
    marginBottom: 18,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    alignSelf: 'center',
  },
  actionText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  resultBox: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  highEmission: {
    backgroundColor: '#FFCDD2',
  },
  resultText: { fontSize: 18, fontWeight: '600' },
  resultHighlight: { fontWeight: 'bold' },
  warning: { marginTop: 8, fontSize: 16, color: '#C62828', fontWeight: '700' },
  linkBox: { marginTop: 15, alignItems: 'center' },
  linkText: { textDecorationLine: 'underline', fontSize: 15 },
});
