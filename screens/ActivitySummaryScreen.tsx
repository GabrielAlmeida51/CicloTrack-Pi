import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useTheme, useUser } from '../contexts';
import { palette } from '../colors';
import { ThemedButton, ThemedCard, StatCard, ProtectedRoute } from '../components';
import { shareService } from '../services';

interface ActivityData {
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  co2Saved: number;
  caloriesBurned: number;
  mode: 'bike' | 'car';
  startTime: string;
  endTime: string;
  averageSpeed: number;
}

export default function ActivitySummaryScreen({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Routes'>>();
  const { theme } = useTheme();
  const { user } = useUser();
  const colors = palette[theme];
  const [sharing, setSharing] = useState(false);

  const activity: ActivityData = route?.params?.activity || {
    origin: 'Local de Origem',
    destination: 'Local de Destino',
    distance: 12.5,
    duration: 45,
    co2Saved: 2.8,
    caloriesBurned: 480,
    mode: 'bike',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    averageSpeed: 16.7,
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      await shareService.shareActivity({
        title: `${activity.origin} → ${activity.destination}`,
        distance: activity.distance,
        duration: activity.duration,
        co2Saved: activity.co2Saved,
        date: activity.endTime,
        mode: activity.mode,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    } finally {
      setSharing(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute screenName="Resumo da Atividade">
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Resumo da Atividade</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.section}>
          <ThemedCard variant="elevated">
            <View style={styles.routeInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors.green + '20' }]}>
                <MaterialCommunityIcons
                  name={activity.mode === 'bike' ? 'bike' : 'car'}
                  size={32}
                  color={colors.green}
                />
              </View>
              <View style={styles.routeDetails}>
                <Text style={[styles.routeOrigin, { color: colors.textSecondary }]}>De:</Text>
                <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={1}>
                  {activity.origin}
                </Text>
                <Text style={[styles.routeOrigin, { color: colors.textSecondary, marginTop: 8 }]}>Para:</Text>
                <Text style={[styles.routeText, { color: colors.text }]} numberOfLines={1}>
                  {activity.destination}
                </Text>
              </View>
            </View>
          </ThemedCard>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="map-marker-distance"
            label="Distância"
            value={activity.distance.toFixed(1)}
            unit="km"
            color={colors.green}
          />
          <StatCard
            icon="clock-outline"
            label="Duração"
            value={Math.floor(activity.duration).toString()}
            unit="min"
            color="#3B82F6"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="speedometer"
            label="Velocidade"
            value={activity.averageSpeed.toFixed(1)}
            unit="km/h"
            color="#F59E0B"
          />
          <StatCard
            icon="leaf"
            label="CO₂ Economizado"
            value={activity.co2Saved.toFixed(1)}
            unit="kg"
            color="#10B981"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="fire"
            label="Calorias"
            value={activity.caloriesBurned.toString()}
            unit="kcal"
            color="#EF4444"
          />
          <StatCard
            icon="star"
            label="Pontos"
            value={Math.round(activity.distance * 10).toString()}
            unit="pts"
            color="#8B5CF6"
          />
        </View>

        <View style={styles.section}>
          <ThemedCard variant="elevated">
            <View style={styles.timeInfo}>
              <View style={styles.timeRow}>
                <MaterialCommunityIcons name="clock-start" size={20} color={colors.green} />
                <View>
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Início</Text>
                  <Text style={[styles.timeValue, { color: colors.text }]}>
                    {formatTime(activity.startTime)}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.timeRow}>
                <MaterialCommunityIcons name="clock-end" size={20} color={colors.green} />
                <View>
                  <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Fim</Text>
                  <Text style={[styles.timeValue, { color: colors.text }]}>
                    {formatTime(activity.endTime)}
                  </Text>
                </View>
              </View>
            </View>
          </ThemedCard>
        </View>

        <View style={styles.section}>
          <ThemedCard variant="outlined">
            <View style={styles.impactBox}>
              <MaterialCommunityIcons name="leaf" size={28} color={colors.green} />
              <Text style={[styles.impactTitle, { color: colors.text }]}>Seu Impacto Ambiental</Text>
              <Text style={[styles.impactValue, { color: colors.green }]}>
                -{activity.co2Saved.toFixed(1)} kg CO₂
              </Text>
              <Text style={[styles.impactDesc, { color: colors.textSecondary }]}>
                Você evitou emissões de carbono equivalentes a dirigir {(activity.co2Saved / 2.31 * 1.5).toFixed(1)} km de carro.
              </Text>
            </View>
          </ThemedCard>
        </View>

        <View style={styles.actions}>
          <ThemedButton
            title="COMPARTILHAR"
            onPress={handleShare}
            loading={sharing}
            variant="primary"
          />
          <ThemedButton
            title="VOLTAR"
            onPress={() => navigation.goBack()}
            variant="secondary"
            style={{ marginTop: 12 }}
          />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  routeInfo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeDetails: {
    flex: 1,
  },
  routeOrigin: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  timeInfo: {
    gap: 16,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  impactBox: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  impactValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  impactDesc: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});
