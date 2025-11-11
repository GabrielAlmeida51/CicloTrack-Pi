import React, { useState, useEffect, useFocusEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { palette } from '../colors';
import { ThemedButton, ThemedCard, ProtectedRoute } from '../components';
import { notificationService, type Notification } from '../services/notificationService';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const colors = palette[theme];
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleDelete = async (id: string) => {
    await notificationService.deleteNotification(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpar Todas',
      'Tem certeza que deseja limpar todas as notificações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await notificationService.clearAllNotifications();
            loadNotifications();
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    loadNotifications();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return 'trophy';
      case 'goal':
        return 'target';
      case 'reminder':
        return 'bell';
      case 'info':
        return 'information';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return '#F59E0B';
      case 'goal':
        return colors.green;
      case 'reminder':
        return '#3B82F6';
      case 'info':
        return '#8B5CF6';
      default:
        return colors.textSecondary;
    }
  };

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ProtectedRoute screenName="Notificações">
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <MaterialCommunityIcons name="bell" size={32} color={colors.green} />
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notificações</Text>
            {unreadCount > 0 && (
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {unreadCount} não lidas
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {notifications.length > 0 && (
          <View style={styles.actions}>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={handleMarkAllAsRead}>
                <Text style={[styles.actionText, { color: colors.green }]}>
                  Marcar tudo como lido
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={[styles.actionText, { color: '#EF4444' }]}>
                Limpar tudo
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhuma notificação
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
              Você está em dia com tudo! Volte aqui quando tiver novas notificações.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.notificationWrapper, { backgroundColor: colors.background }]}>
                <ThemedCard
                  variant={item.read ? 'default' : 'elevated'}
                  style={[
                    styles.notificationCard,
                    !item.read && { borderLeftWidth: 4, borderLeftColor: colors.green },
                  ]}
                >
                <View style={styles.notificationContent}>
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: getNotificationColor(item.type) + '20' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getNotificationIcon(item.type) as any}
                      size={24}
                      color={getNotificationColor(item.type)}
                    />
                  </View>

                  <View style={styles.notificationText}>
                    <Text style={[styles.notificationTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[styles.notificationMessage, { color: colors.textSecondary }]}
                      numberOfLines={2}
                    >
                      {item.message}
                    </Text>
                    <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>

                  {!item.read && (
                    <View
                      style={[
                        styles.unreadDot,
                        { backgroundColor: colors.green },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.notificationActions}>
                  {!item.read && (
                    <TouchableOpacity
                      onPress={() => handleMarkAsRead(item.id)}
                      style={styles.actionButton}
                    >
                      <Text style={[styles.actionButtonText, { color: colors.green }]}>
                        Marcar como lido
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.actionButton}
                  >
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                      Deletar
                    </Text>
                  </TouchableOpacity>
                </View>
              </ThemedCard>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notificationWrapper: {
    marginVertical: 6,
  },
  notificationCard: {
    padding: 0,
    overflow: 'hidden',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
    marginTop: 2,
  },
  notificationActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
