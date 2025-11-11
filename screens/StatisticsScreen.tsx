import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useUser, useUserStats } from '../contexts';
import { palette } from '../colors';
import { ThemedCard, StatCard, ProgressBar, ProtectedRoute } from '../components';

const { width } = Dimensions.get('window');

interface WeeklyData {
  day: string;
  distance: number;
  co2: number;
}

export default function StatisticsScreen() {
  const { theme } = useTheme();
  const { user } = useUser();
  const { stats } = useUserStats();
  const colors = palette[theme];

  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  const weeklyData: WeeklyData[] = [
    { day: 'Seg', distance: 12.5, co2: 2.9 },
    { day: 'Ter', distance: 18.3, co2: 4.2 },
    { day: 'Qua', distance: 0, co2: 0 },
    { day: 'Qui', distance: 15.7, co2: 3.6 },
    { day: 'Sex', distance: 22.1, co2: 5.1 },
    { day: 'Sab', distance: 35.8, co2: 8.2 },
    { day: 'Dom', distance: 8.4, co2: 1.9 },
  ];

  const maxDistance = Math.max(...weeklyData.map(d => d.distance));
  const totalWeekDistance = weeklyData.reduce((sum, d) => sum + d.distance, 0);
  const totalWeekCO2 = weeklyData.reduce((sum, d) => sum + d.co2, 0);

  const monthlyStats = {
    totalDistance: user?.totalKm || 0,
    totalCo2: user?.totalCo2 || 0,
    averageDistance: (user?.totalKm || 0) / 30,
    longestRide: 45.3,
  };

  return (
    <ProtectedRoute screenName="Estatísticas">
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <MaterialCommunityIcons name="chart-line" size={32} color={colors.green} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Estatísticas</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.timeframeButtons}>
              {(['week', 'month', 'year'] as const).map(tf => (
                <TouchableOpacity
                  key={tf}
                  style={[
                    styles.timeframeBtn,
                    {
                      backgroundColor: timeframe === tf ? colors.green : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setTimeframe(tf)}
                >
                  <Text
                    style={[
                      styles.timeframeBtnText,
                      { color: timeframe === tf ? colors.background : colors.text },
                    ]}
                  >
                    {tf === 'week' ? 'Semana' : tf === 'month' ? 'Mês' : 'Ano'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {timeframe === 'week' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Distância da Semana
                </Text>
                <ThemedCard variant="elevated">
                  <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
                    <View style={styles.chartBars}>
                      {weeklyData.map((data, idx) => (
                        <View key={idx} style={styles.barWrapper}>
                          <View style={styles.barContainer}>
                            <View
                              style={[
                                styles.bar,
                                {
                                  height: `${(data.distance / maxDistance) * 150}%`,
                                  backgroundColor: data.distance > 0 ? colors.green : colors.border,
                                },
                              ]}
                            />
                          </View>
                          <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                            {data.day}
                          </Text>
                          {data.distance > 0 && (
                            <Text style={[styles.barValue, { color: colors.text }]}>
                              {data.distance.toFixed(1)}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={[styles.chartInfo, { borderTopColor: colors.border }]}>
                    <View>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                        Total Semana
                      </Text>
                      <Text style={[styles.infoValue, { color: colors.green }]}>
                        {totalWeekDistance.toFixed(1)} km
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                        CO₂ Economizado
                      </Text>
                      <Text style={[styles.infoValue, { color: colors.green }]}>
                        {totalWeekCO2.toFixed(1)} kg
                      </Text>
                    </View>
                  </View>
                </ThemedCard>
              </View>
            </>
          )}

          {timeframe === 'month' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Resumo do Mês
                </Text>
                <ThemedCard variant="elevated">
                  <View style={styles.statsList}>
                    <View style={styles.statsItem}>
                      <View
                        style={[
                          styles.statsIcon,
                          { backgroundColor: colors.green + '20' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="map-marker-distance"
                          size={24}
                          color={colors.green}
                        />
                      </View>
                      <View style={styles.statsTextContainer}>
                        <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                          Total de Distância
                        </Text>
                        <Text style={[styles.statsValueLarge, { color: colors.text }]}>
                          {monthlyStats.totalDistance.toFixed(1)} km
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.statsItem}>
                      <View
                        style={[
                          styles.statsIcon,
                          { backgroundColor: '#10B98120' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="leaf"
                          size={24}
                          color="#10B981"
                        />
                      </View>
                      <View style={styles.statsTextContainer}>
                        <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                          CO₂ Economizado
                        </Text>
                        <Text style={[styles.statsValueLarge, { color: colors.text }]}>
                          {monthlyStats.totalCo2.toFixed(1)} kg
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.statsItem}>
                      <View
                        style={[
                          styles.statsIcon,
                          { backgroundColor: '#F59E0B20' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="speedometer"
                          size={24}
                          color="#F59E0B"
                        />
                      </View>
                      <View style={styles.statsTextContainer}>
                        <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                          Média Diária
                        </Text>
                        <Text style={[styles.statsValueLarge, { color: colors.text }]}>
                          {monthlyStats.averageDistance.toFixed(1)} km
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.statsItem}>
                      <View
                        style={[
                          styles.statsIcon,
                          { backgroundColor: '#EF444420' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="mountain-bike"
                          size={24}
                          color="#EF4444"
                        />
                      </View>
                      <View style={styles.statsTextContainer}>
                        <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>
                          Maior Rota
                        </Text>
                        <Text style={[styles.statsValueLarge, { color: colors.text }]}>
                          {monthlyStats.longestRide.toFixed(1)} km
                        </Text>
                      </View>
                    </View>
                  </View>
                </ThemedCard>
              </View>
            </>
          )}

          {timeframe === 'year' && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Resumo do Ano
                </Text>
                <ThemedCard variant="elevated">
                  <View style={styles.yearStats}>
                    <StatCard
                      icon="calendar"
                      label="Dias Ativos"
                      value="87"
                      unit="dias"
                      color={colors.green}
                    />
                    <StatCard
                      icon="target"
                      label="Meta Atingida"
                      value={Math.round((user?.progress || 0) / 100 * 365).toString()}
                      unit="dias"
                      color="#10B981"
                    />
                  </View>
                  <View style={[styles.progressSection, { borderTopColor: colors.border }]}>
                    <Text style={[styles.progressLabel, { color: colors.text }]}>
                      Progresso do Ano
                    </Text>
                    <ProgressBar value={user?.progress || 0} style={{ marginTop: 12 }} />
                    <Text style={[styles.progressInfo, { color: colors.textSecondary }]}>
                      {Math.round((user?.progress || 0) / 100 * 365)} / 365 dias atingidos
                    </Text>
                  </View>
                </ThemedCard>
              </View>
            </>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Conquistas Recentes
            </Text>
            <ThemedCard variant="elevated">
              <View style={styles.achievementsList}>
                {stats?.achievements?.slice(0, 5).map((achievement, idx) => (
                  <View key={idx} style={styles.achievementItem}>
                    <MaterialCommunityIcons
                      name="trophy"
                      size={24}
                      color={colors.green}
                    />
                    <Text style={[styles.achievementText, { color: colors.text }]}>
                      {achievement}
                    </Text>
                  </View>
                ))}
                {(stats?.achievements?.length || 0) === 0 && (
                  <Text style={[styles.noAchievements, { color: colors.textSecondary }]}>
                    Comece pedalando para desbloquear conquistas!
                  </Text>
                )}
              </View>
            </ThemedCard>
          </View>
        </ScrollView>
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
  timeframeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeframeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeframeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chartContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
    marginBottom: 12,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  chartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsList: {
    gap: 0,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsTextContainer: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statsValueLarge: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
  },
  yearStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  progressSection: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressInfo: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noAchievements: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
