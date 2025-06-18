// screens/RoutesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Rotas</Text>
      {/* Aqui entra seu componente de mapa ou lista de rotas */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: '#2E8B57', marginBottom: 10 },
});
