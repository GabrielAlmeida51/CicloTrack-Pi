import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../App';

const bgColor = '#181F23';
const green = '#A3FF6F';
const grayText = '#BFC9C5';

export default function ConfigScreen({ navigation }: any) {
  const { user, logout } = useUser() || {};
  const [name, setName] = useState(user?.name || '');
  const [peso, setPeso] = useState(user?.peso ? String(user.peso) : '');
  // Removido: const [carType, setCarType] = useState(user?.carType || 'popular');

  // Barra de progresso
  const progress = user ? user.progress : 0;
  const level = user ? user.level : 'Iniciante';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="cog" size={32} color={green} style={{ marginRight: 10 }} />
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.levelBox}>
          <Text style={styles.levelLabel}>Nível do usuário</Text>
          <Text style={styles.levelValue}>{level}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}% para o próximo nível</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsText}>Total pedalado: <Text style={styles.statsValue}>{user?.totalKm?.toFixed(2) || 0} km</Text></Text>
          <Text style={styles.statsText}>CO₂ economizado: <Text style={styles.statsValue}>{user?.totalCo2?.toFixed(2) || 0} kg</Text></Text>
          <Text style={styles.statsText}>Calorias gastas: <Text style={styles.statsValue}>{user?.totalCalories?.toFixed(0) || 0} kcal</Text></Text>
        </View>
        <View style={styles.formBox}>
          <Text style={styles.formLabel}>Nome</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.formLabel}>Peso (kg)</Text>
          <TextInput style={styles.input} value={peso} onChangeText={setPeso} keyboardType="numeric" />
          {/* Removido: Tipo de carro padrão e botões de escolha */}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <MaterialCommunityIcons name="logout" size={22} color={bgColor} style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: bgColor,
    borderBottomWidth: 1,
    borderBottomColor: '#23292D',
  },
  headerTitle: {
    color: green,
    fontWeight: 'bold',
    fontSize: 22,
  },
  levelBox: {
    margin: 18,
    backgroundColor: '#23292D',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: green,
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  levelLabel: {
    color: grayText,
    fontSize: 15,
    marginBottom: 4,
  },
  levelValue: {
    color: green,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#181F23',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    backgroundColor: green,
    borderRadius: 8,
  },
  progressText: {
    color: grayText,
    fontSize: 13,
    marginTop: 2,
  },
  statsBox: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#23292D',
    borderRadius: 18,
    padding: 18,
  },
  statsText: {
    color: grayText,
    fontSize: 15,
    marginBottom: 2,
  },
  statsValue: {
    color: green,
    fontWeight: 'bold',
    fontSize: 15,
  },
  formBox: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#23292D',
    borderRadius: 18,
    padding: 18,
  },
  formLabel: {
    color: grayText,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#181F23',
    color: green,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: green,
  },
  carTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  carTypeBtn: {
    backgroundColor: 'rgba(35,41,45,0.7)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  carTypeBtnActive: {
    backgroundColor: green,
    borderColor: green,
  },
  carTypeText: {
    color: green,
    fontWeight: 'bold',
    fontSize: 15,
  },
  carTypeTextActive: {
    color: bgColor,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: green,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 18,
    shadowColor: green,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutBtnText: {
    color: bgColor,
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
}); 