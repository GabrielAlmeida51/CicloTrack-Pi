import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser, useUserStats, useTheme, ThemeType } from '../contexts';
import { palette } from '../colors';
import {
  ThemedInput,
  ThemedButton,
  ThemedCard,
  LoadingOverlay,
  StatCard,
  ProtectedRoute,
} from '../components';

export default function ConfigScreen() {
  const { user, logout, updateProgress } = useUser();
  const { stats } = useUserStats();
  const [name, setName] = useState(user?.name || '');
  const [peso, setPeso] = useState(user?.peso ? String(user.peso) : '');
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const colors = palette[theme];

  const handleLogout = () => {
    Alert.alert(
      'Confirmar logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome não pode estar vazio');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
    } catch (e: any) {
      Alert.alert('Erro', 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute screenName="Configurações">
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <MaterialCommunityIcons name="cog" size={32} color={colors.green} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Configurações</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Seu Perfil</Text>

            <ThemedCard variant="elevated">
              <View style={styles.profileHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.green }]}>
                  <MaterialCommunityIcons name="account" size={48} color={colors.background} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: colors.text }]}>{user?.name || 'Usuário'}</Text>
                  <Text style={[styles.profileLevel, { color: colors.green }]}>
                    {user?.level || 'Iniciante'}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                    {user?.email}
                  </Text>
                </View>
              </View>
            </ThemedCard>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Progresso</Text>

            <ThemedCard variant="elevated">
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.text }]}>
                    Progresso para Avançado
                  </Text>
                  <Text style={[styles.progressPercent, { color: colors.green }]}>
                    {user?.progress || 0}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(user?.progress || 0, 100)}%`, backgroundColor: colors.green },
                    ]}
                  />
                </View>
                <Text style={[styles.progressInfo, { color: colors.textSecondary }]}>
                  {user?.totalKm || 0} km / 200 km
                </Text>
              </View>
            </ThemedCard>
          </View>

          <View style={styles.statsContainer}>
            <StatCard
              icon="map-marker-distance"
              label="Distância"
              value={(user?.totalKm || 0).toFixed(1)}
              unit="km"
              color={colors.green}
            />
            <StatCard
              icon="leaf"
              label="CO₂ Economizado"
              value={(user?.totalCo2 || 0).toFixed(1)}
              unit="kg"
              color="#10B981"
            />
          </View>

          <View style={styles.statsContainer}>
            <StatCard
              icon="fire"
              label="Calorias"
              value={(user?.totalCalories || 0).toString()}
              unit="kcal"
              color="#F59E0B"
            />
            <StatCard
              icon="star"
              label="Pontos"
              value={(stats?.points || 0).toString()}
              unit="pts"
              color="#3B82F6"
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Editar Perfil</Text>

            <View style={styles.formContainer}>
              <ThemedInput
                label="Nome completo"
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                icon="account-outline"
              />

              <ThemedInput
                label="Peso (kg)"
                placeholder="ex: 70"
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric"
                icon="weight"
                style={{ marginTop: 16 }}
              />

              <ThemedButton
                title="SALVAR PERFIL"
                onPress={handleSaveProfile}
                loading={loading}
                style={{ marginTop: 20 }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Aparência</Text>

            <ThemedCard variant="elevated">
              <View style={styles.themeContainer}>
                <View style={styles.themeHeader}>
                  <Text style={[styles.themeLabel, { color: colors.text }]}>Tema do Aplicativo</Text>
                </View>

                <View style={styles.themeBtns}>
                  <TouchableOpacity
                    style={[
                      styles.themeBtn,
                      {
                        backgroundColor: theme === 'dark' ? colors.green : colors.background,
                        borderColor: theme === 'dark' ? colors.green : colors.border,
                      },
                    ]}
                    onPress={() => setTheme('dark')}
                  >
                    <MaterialCommunityIcons
                      name="moon-waning-crescent"
                      size={20}
                      color={theme === 'dark' ? colors.background : colors.text}
                    />
                    <Text
                      style={[
                        styles.themeBtnText,
                        { color: theme === 'dark' ? colors.background : colors.text },
                      ]}
                    >
                      Escuro
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.themeBtn,
                      {
                        backgroundColor: theme === 'light' ? colors.green : colors.background,
                        borderColor: theme === 'light' ? colors.green : colors.border,
                      },
                    ]}
                    onPress={() => setTheme('light')}
                  >
                    <MaterialCommunityIcons
                      name="white-balance-sunny"
                      size={20}
                      color={theme === 'light' ? colors.background : colors.text}
                    />
                    <Text
                      style={[
                        styles.themeBtnText,
                        { color: theme === 'light' ? colors.background : colors.text },
                      ]}
                    >
                      Claro
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ThemedCard>
          </View>

          <View style={styles.section}>
            <ThemedButton
              title="SAIR"
              onPress={handleLogout}
              variant="danger"
              style={{ marginTop: 8 }}
            />
          </View>
        </ScrollView>

        <LoadingOverlay visible={loading} message="Salvando..." />
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
  },
  progressContainer: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressInfo: {
    fontSize: 12,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  formContainer: {
    gap: 16,
  },
  themeContainer: {
    gap: 16,
  },
  themeHeader: {
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  themeBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
