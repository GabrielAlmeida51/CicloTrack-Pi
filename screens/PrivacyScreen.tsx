import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../contexts';
import { palette } from '../colors';

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const colors = palette[theme];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 18 }}>
      <Text style={{ color: colors.green, fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Política de Privacidade</Text>
      <View style={{ gap: 12 }}>
        <Text style={{ color: colors.textSecondary }}>1. Dados coletados: email, nome e dados de uso (rotas).</Text>
        <Text style={{ color: colors.textSecondary }}>2. Finalidade: fornecer serviços do app e melhorar funcionalidades.</Text>
        <Text style={{ color: colors.textSecondary }}>3. Armazenamento: dados são armazenados no Supabase com políticas de acesso (RLS).</Text>
        <Text style={{ color: colors.textSecondary }}>4. Compartilhamento: não vendemos seus dados. Compartilhamento apenas quando exigido por lei.</Text>
        <Text style={{ color: colors.textSecondary }}>5. Segurança: usamos autenticação e controles de acesso para proteger informações.</Text>
        <Text style={{ color: colors.textSecondary }}>6. Direitos: você pode solicitar remoção e acesso aos seus dados.</Text>
        <Text style={{ color: colors.textSecondary }}>7. Alterações: esta política pode ser atualizada. O uso contínuo implica concordância.</Text>
      </View>
    </ScrollView>
  );
}


