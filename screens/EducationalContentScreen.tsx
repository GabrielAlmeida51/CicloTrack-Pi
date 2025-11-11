import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';


export default function EducationalContentScreen() {
  const { theme } = useTheme();
  const colors = palette[theme];
  const bg = colors.background;
  const greenTheme = colors.green;
  const textSecondary = colors.textSecondary;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: greenTheme }]}>Conteúdo Educativo</Text>

        {/* Dicas de manutenção */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: greenTheme }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="wrench" size={26} color={greenTheme} style={{ marginRight: 10 }} />
            <Text style={[styles.sectionTitle, { color: greenTheme }]}>Dicas de manutenção de bicicleta</Text>
          </View>
          <Text style={[styles.sectionText, { color: textSecondary }]}>• Mantenha os pneus calibrados para evitar desgaste e facilitar a pedalada.
• Lubrifique a corrente regularmente para evitar ferrugem e ruídos.
• Verifique os freios antes de cada pedalada.
• Faça revisões periódicas em uma oficina especializada.</Text>
        </View>

        {/* Mobilidade urbana e meio ambiente */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: greenTheme }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="city-variant-outline" size={26} color={greenTheme} style={{ marginRight: 10 }} />
            <Text style={[styles.sectionTitle, { color: greenTheme }]}>Mobilidade urbana e meio ambiente</Text>
          </View>
          <Text style={[styles.sectionText, { color: textSecondary }]}>• Pedalar contribui para a redução da poluição do ar e do trânsito.
• Bicicletas ocupam menos espaço e promovem cidades mais humanas.
• Incentive amigos e familiares a adotar meios de transporte sustentáveis.
• Conheça as leis de trânsito para ciclistas e respeite a sinalização.</Text>
        </View>

        {/* Sugestões de rotas seguras */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: greenTheme }]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker-path" size={26} color={greenTheme} style={{ marginRight: 10 }} />
            <Text style={[styles.sectionTitle, { color: greenTheme }]}>Sugestões de rotas seguras e ciclovias</Text>
          </View>
          <Text style={[styles.sectionText, { color: textSecondary }]}>• Prefira ciclovias e ciclofaixas sempre que possível.
• Planeje seu trajeto com antecedência usando apps de mapas.
• Evite vias movimentadas em horários de pico.
• Compartilhe rotas seguras com outros ciclistas na comunidade.</Text>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  sectionText: {
    fontSize: 15,
    marginTop: 2,
    lineHeight: 22,
  },
});
