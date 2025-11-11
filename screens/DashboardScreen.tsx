import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useUser, useUserStats, useUserProgress } from '../contexts';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { palette } from '../colors';
import {
  ActivityCard,
  StatCard,
  GoalCard,
  ThemedCard,
  LoadingOverlay,
  ErrorBoundary,
  BottomNavBar,
} from '../components';
import { routeService } from '../services';
import { supabase } from '../lib/supabase';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Dashboard'>>();
  const { theme } = useTheme();
  const { user, logout } = useUser();
  const { stats } = useUserStats();
  const { totalKm } = useUserProgress();
  const colors = palette[theme];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user?.logged) {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        if (userId) {
          const activities = await routeService.getUserRouteHistory(userId, 10);
          setRecentActivities(activities);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const bikeRoutes = stats?.routeHistory?.filter(r => r.mode === 'bike') || [];
  const totalDistance = stats?.totalKm || 0;
  const totalEmissions = bikeRoutes.reduce((sum, r) => sum + (r.distance * 0.12), 0);
  const totalCalories = bikeRoutes.reduce((sum, r) => sum + (r.distance * 0.28 * 70), 0);
  const lastActivity = recentActivities[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                Bem-vindo, {user?.name?.split(' ')[0] || 'Ciclista'}! 👋
              </Text>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: colors.green + '25', borderColor: colors.green }]}>
              <MaterialCommunityIcons name="star" size={14} color={colors.green} />
              <Text style={[styles.levelText, { color: colors.green, marginLeft: 4 }]}>
                {user?.level || 'Iniciante'}
              </Text>
            </View>
          </View>

          <ErrorBoundary error={error} onDismiss={() => setError(null)} />

          {lastActivity && (
            <View style={styles.lastActivityContainer}>
              <View style={[styles.lastActivityCard, { backgroundColor: colors.card, borderLeftColor: colors.green }]}>
                <View style={styles.lastActivityHeader}>
                <View>
                  <Text style={[styles.lastActivityLabel, { color: colors.textSecondary }]}>Última Atividade</Text>
                  <Text style={[styles.lastActivityTitle, { color: colors.text }]}>
                    {lastActivity.origin?.substring(0, 15) || 'Rota'} → {lastActivity.destination?.substring(0, 15) || 'Destino'}
                  </Text>
                </View>
                <MaterialCommunityIcons name="bicycle" size={28} color={colors.green} />
              </View>
              <View style={styles.lastActivityStats}>
                <View style={styles.lastActivityStat}>
                  <MaterialCommunityIcons name="map-marker-distance" size={18} color={colors.green} />
                  <Text style={[styles.lastActivityStatText, { color: colors.text }]}>
                    {lastActivity.distance_km?.toFixed(1) || '0'} km
                  </Text>
                </View>
                <View style={styles.lastActivityStat}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color={colors.green} />
                  <Text style={[styles.lastActivityStatText, { color: colors.text }]}>
                    {lastActivity.duration_min || '0'} min
                  </Text>
                </View>
                <View style={styles.lastActivityStat}>
                  <MaterialCommunityIcons name="leaf" size={18} color={colors.green} />
                  <Text style={[styles.lastActivityStatText, { color: colors.text }]}>
                    {lastActivity.co2_saved_kg?.toFixed(2) || '0'} kg CO₂
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: colors.green }]}
          onPress={() => navigation.navigate('Routes')}
        >
          <MaterialCommunityIcons name="play-circle" size={20} color={colors.background} />
          <Text style={[styles.ctaButtonText, { color: colors.background }]}>Começar Nova Rota</Text>
        </TouchableOpacity>

        <View style={styles.metricsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Suas Métricas</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: colors.card, borderTopColor: colors.green }]}>
              <MaterialCommunityIcons name="map-marker-distance" size={24} color={colors.green} />
              <Text style={[styles.metricValue, { color: colors.green }]}>{totalDistance.toFixed(1)}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>km</Text>
              <Text style={[styles.metricName, { color: colors.text }]}>Distância</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: colors.card, borderTopColor: '#10B981' }]}>
              <MaterialCommunityIcons name="leaf" size={24} color="#10B981" />
              <Text style={[styles.metricValue, { color: '#10B981' }]}>{totalEmissions.toFixed(1)}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>kg</Text>
              <Text style={[styles.metricName, { color: colors.text }]}>CO₂ Economizado</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: colors.card, borderTopColor: '#F59E0B' }]}>
              <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
              <Text style={[styles.metricValue, { color: '#F59E0B' }]}>{Math.round(totalCalories)}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>kcal</Text>
              <Text style={[styles.metricName, { color: colors.text }]}>Calorias</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: colors.card, borderTopColor: '#8B5CF6' }]}>
              <MaterialCommunityIcons name="star" size={24} color="#8B5CF6" />
              <Text style={[styles.metricValue, { color: '#8B5CF6' }]}>{stats?.points || 0}</Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>pts</Text>
              <Text style={[styles.metricName, { color: colors.text }]}>Pontos</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Progresso para Avançado</Text>
          <ThemedCard variant="elevated">
            <View style={styles.progressContent}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: colors.text }]}>
                  Sua Jornada
                </Text>
                <Text style={[styles.progressValue, { color: colors.green }]}>
                  {user?.progress || 0}%
                </Text>
              </View>
              <View
                style={[
                  styles.progressBarContainer,
                  { backgroundColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${user?.progress || 0}%`,
                      backgroundColor: colors.green,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressInfo, { color: colors.textSecondary }]}>
                {totalKm?.toFixed(1) || 0} km / 200 km para próximo nível
              </Text>
            </View>
          </ThemedCard>
        </View>

        <View style={styles.activitiesSection}>
          <View style={styles.activitiesTitleRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Atividades Recentes
            </Text>
            {recentActivities.length > 0 && (
              <TouchableOpacity onPress={() => navigation.navigate('Statistics')}>
                <Text style={[styles.viewMoreLink, { color: colors.green }]}>Ver Tudo</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentActivities.length > 0 ? (
            recentActivities.slice(0, 3).map((activity) => (
              <ActivityCard
                key={activity.id}
                title={`${activity.origin} → ${activity.destination}`}
                distance={activity.distance_km}
                duration={activity.duration_min}
                mode={activity.mode}
                date={activity.finished_at}
                co2Saved={activity.co2_saved_kg}
                caloriesBurned={activity.calories_burned}
              />
            ))
          ) : (
            <ThemedCard variant="outlined">
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="inbox-outline"
                  size={48}
                  color={colors.textSecondary}
                />
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  Nenhuma atividade ainda
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Comece uma rota para rastrear seu progresso
                </Text>
              </View>
            </ThemedCard>
          )}
        </View>
      </ScrollView>

      <BottomNavBar
        activeIndex={0}
        items={[
          { name: 'Início', icon: 'home', onPress: () => navigation.navigate('Dashboard') },
          { name: 'Rotas', icon: 'map-marker-path', onPress: () => navigation.navigate('Routes') },
          { name: 'Cupons', icon: 'ticket-percent', onPress: () => navigation.navigate('Cupons') },
          { name: 'CO₂', icon: 'leaf', onPress: () => navigation.navigate('CarbonCounter') },
          { name: 'Config', icon: 'cog', onPress: () => navigation.navigate('Config') },
          { name: 'Sair', icon: 'logout', onPress: () => logout() },
        ]}
      />

      <LoadingOverlay visible={loading} message="Carregando dados..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 0,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastActivityContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  lastActivityCard: {
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lastActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastActivityLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastActivityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastActivityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  lastActivityStat: {
    alignItems: 'center',
    flex: 1,
  },
  lastActivityStatText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  ctaButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  metricsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: (screenWidth - 48) / 2,
    borderRadius: 12,
    padding: 14,
    borderTopWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  progressSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  progressContent: {
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
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressInfo: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  activitiesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  activitiesTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewMoreLink: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
