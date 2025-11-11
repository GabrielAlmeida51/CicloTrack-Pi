import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'goal' | 'reminder' | 'info';
  timestamp: string;
  read: boolean;
  actionType?: string;
  actionData?: any;
}

const NOTIFICATIONS_KEY = 'app_notifications';
const MAX_NOTIFICATIONS = 50;

export const notificationService = {
  async createNotification(
    title: string,
    message: string,
    type: 'achievement' | 'goal' | 'reminder' | 'info',
    actionType?: string,
    actionData?: any
  ): Promise<Notification> {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      actionType,
      actionData,
    };

    try {
      const existingNotifications = await this.getNotifications();
      const allNotifications = [notification, ...existingNotifications].slice(0, MAX_NOTIFICATIONS);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }

    return notification;
  },

  async getNotifications(): Promise<Notification[]> {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map(n => ({ ...n, read: true }));
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao marcar todos como lidos:', error);
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  },

  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  },

  async notifyAchievementUnlocked(achievementName: string): Promise<void> {
    await this.createNotification(
      '🏆 Conquista Desbloqueada!',
      `Você desbloqueou a conquista "${achievementName}"!`,
      'achievement',
      'view_achievement',
      { achievement: achievementName }
    );
  },

  async notifyGoalProgress(goalName: string, progress: number): Promise<void> {
    const message = progress === 100
      ? `Parabéns! Você completou a meta "${goalName}"!`
      : `Você está ${progress}% do caminho para completar "${goalName}"`;

    await this.createNotification(
      'Meta em Progresso',
      message,
      progress === 100 ? 'achievement' : 'goal',
      'view_goal',
      { goal: goalName, progress }
    );
  },

  async notifyDailyReminder(message: string): Promise<void> {
    await this.createNotification(
      '🚴 Lembrete Diário',
      message,
      'reminder'
    );
  },

  async notifyMilestoneReached(distanceKm: number): Promise<void> {
    const message = `Parabéns! Você atingiu ${distanceKm} km pedalados!`;
    await this.createNotification(
      '🎉 Novo Recorde!',
      message,
      'achievement',
      'view_stats'
    );
  },

  async notifyWeeklyReport(stats: { distance: number; co2Saved: number; routes: number }): Promise<void> {
    const message = `Esta semana você pedalou ${stats.distance.toFixed(1)} km e economizou ${stats.co2Saved.toFixed(1)} kg de CO₂ em ${stats.routes} rotas!`;
    await this.createNotification(
      '📊 Relatório Semanal',
      message,
      'info',
      'view_statistics'
    );
  },

  async notifyNewFeature(featureName: string, description: string): Promise<void> {
    await this.createNotification(
      `✨ Nova Feature: ${featureName}`,
      description,
      'info'
    );
  },
};
