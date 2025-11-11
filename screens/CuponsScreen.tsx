import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStats, useUserProgress, useUserGoals, useTheme } from '../contexts';
import { palette } from '../colors';
import { ProtectedRoute } from '../components';

export default function CuponsScreen() {
  const { totalKm, level } = useUserProgress() || {};
  const { stats, spendPoints } = useUserStats() || {};
  const { coupons, redeemCoupon } = useUserGoals() || {};
  const { theme } = useTheme();
  const colors = palette[theme];

  const handleRedeemCoupon = (couponId: string, pointsCost: number) => {
    if (!spendPoints || !redeemCoupon) return;
    
    if (stats.points < pointsCost) {
      Alert.alert('Pontos Insuficientes', `Você precisa de ${pointsCost} pontos para resgatar este cupom. Você tem ${stats.points} pontos.`);
      return;
    }

    Alert.alert(
      'Resgatar Cupom',
      `Deseja resgatar este cupom por ${pointsCost} pontos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resgatar',
          onPress: () => {
            const success = spendPoints(pointsCost);
            if (success) {
              redeemCoupon(couponId, pointsCost);
              Alert.alert('Sucesso!', 'Cupom resgatado com sucesso!');
            }
          },
        },
      ]
    );
  };

  const availableCoupons = coupons?.filter(c => !c.redeemed) || [];
  const redeemedCoupons = coupons?.filter(c => c.redeemed) || [];

  return (
    <ProtectedRoute screenName="Cupons">
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <MaterialCommunityIcons name="star-circle" size={48} color={colors.green} />
          <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>Seus Pontos</Text>
          <Text style={[styles.pointsValue, { color: colors.green }]}>{stats?.points || 0}</Text>
          <Text style={[styles.pointsSubtext, { color: colors.textSecondary }]}>
            Pedale para ganhar mais pontos!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cupons Disponíveis</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Troque seus pontos por cupons de desconto
          </Text>
        </View>

        {availableCoupons.length > 0 ? (
          availableCoupons.map(coupon => (
            <View key={coupon.id} style={[styles.couponCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.couponHeader}>
                <View style={[styles.iconBadge, { backgroundColor: colors.green + '20' }]}>
                  <MaterialCommunityIcons name="ticket-percent" size={28} color={colors.green} />
                </View>
                <View style={styles.couponInfo}>
                  <Text style={[styles.couponTitle, { color: colors.text }]}>{coupon.title}</Text>
                  <Text style={[styles.couponDescription, { color: colors.textSecondary }]}>
                    {coupon.description}
                  </Text>
                  <Text style={[styles.couponStore, { color: colors.textSecondary }]}>
                    <MaterialCommunityIcons name="store" size={14} color={colors.textSecondary} /> {coupon.store}
                  </Text>
                </View>
              </View>
              
              <View style={styles.couponFooter}>
                <View style={styles.pointsCostContainer}>
                  <MaterialCommunityIcons name="star" size={18} color={colors.green} />
                  <Text style={[styles.pointsCost, { color: colors.green }]}>{coupon.pointsCost} pontos</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.redeemButton,
                    { backgroundColor: stats.points >= coupon.pointsCost ? colors.green : colors.textSecondary }
                  ]}
                  onPress={() => handleRedeemCoupon(coupon.id, coupon.pointsCost)}
                  disabled={stats.points < coupon.pointsCost}
                >
                  <Text style={[styles.redeemButtonText, { color: colors.background }]}>
                    {stats.points >= coupon.pointsCost ? 'Resgatar' : 'Bloqueado'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="ticket-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum cupom disponível no momento
            </Text>
          </View>
        )}

        {redeemedCoupons.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Meus Cupons</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Cupons que você já resgatou
              </Text>
            </View>

            {redeemedCoupons.map(coupon => (
              <View key={coupon.id} style={[styles.redeemedCard, { backgroundColor: colors.card, borderColor: colors.green }]}>
                <View style={styles.couponHeader}>
                  <View style={[styles.iconBadge, { backgroundColor: colors.green + '30' }]}>
                    <MaterialCommunityIcons name="check-circle" size={28} color={colors.green} />
                  </View>
                  <View style={styles.couponInfo}>
                    <Text style={[styles.couponTitle, { color: colors.text }]}>{coupon.title}</Text>
                    <Text style={[styles.couponDescription, { color: colors.textSecondary }]}>
                      {coupon.description}
                    </Text>
                    <Text style={[styles.couponStore, { color: colors.textSecondary }]}>
                      <MaterialCommunityIcons name="store" size={14} color={colors.textSecondary} /> {coupon.store}
                    </Text>
                  </View>
                </View>
                
                {coupon.code && (
                  <View style={[styles.codeContainer, { backgroundColor: colors.green + '15' }]}>
                    <Text style={[styles.codeLabel, { color: colors.textSecondary }]}>Código do cupom:</Text>
                    <Text style={[styles.codeValue, { color: colors.green }]}>{coupon.code}</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 4,
  },
  pointsSubtext: {
    fontSize: 13,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  couponCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  couponHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  couponStore: {
    fontSize: 12,
    marginTop: 2,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pointsCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsCost: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  redeemButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyCard: {
    marginHorizontal: 16,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  redeemedCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  codeContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
}); 