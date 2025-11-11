import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../contexts';
import { palette } from '../colors';

export default function TermsScreen() {
  const { theme } = useTheme();
  const colors = palette[theme];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 18 }}>
      <Text style={{ color: colors.green, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Termos de Uso</Text>
      <View style={{ gap: 12 }}>
        <Text style={{ color: colors.textSecondary }}>1. Aceitação: Ao usar o CicloTrack, você concorda com estes termos.</Text>
        <Text style={{ color: colors.textSecondary }}>2. Conta: Você é responsável por manter a confidencialidade das suas credenciais.</Text>
        <Text style={{ color: colors.textSecondary }}>3. Uso: Não utilize o app de forma ilegal ou que cause danos a terceiros.</Text>
        <Text style={{ color: colors.textSecondary }}>4. Conteúdo: O app fornece estimativas (CO₂, calorias) sem garantia de exatidão.</Text>
        <Text style={{ color: colors.textSecondary }}>5. Encerramento: Podemos suspender contas que violem estes termos.</Text>
        <Text style={{ color: colors.textSecondary }}>6. Alterações: Os termos podem ser atualizados. O uso contínuo implica concordância.</Text>
      </View>
    </ScrollView>
  );
}


