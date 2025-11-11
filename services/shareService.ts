import { Share, Linking } from 'react-native';

export interface ShareActivityData {
  title: string;
  distance: number;
  duration: number;
  co2Saved: number;
  date: string;
  mode: 'bike' | 'car';
}

export const shareService = {
  async shareActivity(activity: ShareActivityData) {
    try {
      const message = `🚴 Verifique minha atividade no CicloTrack!
      
📍 ${activity.title}
📏 ${activity.distance.toFixed(1)} km
⏱️ ${activity.duration} minutos
🌱 ${activity.co2Saved.toFixed(1)} kg CO₂ economizado
📅 ${new Date(activity.date).toLocaleDateString('pt-BR')}

Venha se juntar a mim na comunidade de ciclistas sustentáveis!`;

      await Share.share({
        message,
        title: 'Compartilhar atividade',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      throw error;
    }
  },

  async shareProfile(userName: string, stats: { totalKm: number; totalCo2: number; level: string }) {
    try {
      const message = `${userName} está pedalando para um futuro melhor no CicloTrack!

🚴 ${stats.totalKm.toFixed(0)} km pedalados
🌱 ${stats.totalCo2.toFixed(1)} kg CO₂ economizado
⭐ Nível: ${stats.level}

Baixe o app e junte-se a nós!`;

      await Share.share({
        message,
        title: 'Compartilhar perfil',
      });
    } catch (error) {
      console.error('Erro ao compartilhar perfil:', error);
      throw error;
    }
  },

  async shareAchievement(achievementTitle: string) {
    try {
      const message = `🏆 Desbloqueei a conquista "${achievementTitle}" no CicloTrack!

Estou pedalando para um mundo mais sustentável. Você também pode fazer a diferença!`;

      await Share.share({
        message,
        title: 'Compartilhar conquista',
      });
    } catch (error) {
      console.error('Erro ao compartilhar conquista:', error);
      throw error;
    }
  },

  async openInstagram() {
    const url = 'https://instagram.com/ciclotrackapp';
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir Instagram:', error);
      throw error;
    }
  },

  async openTwitter() {
    const url = 'https://twitter.com/ciclotrackapp';
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir Twitter:', error);
      throw error;
    }
  },

  async openFacebook() {
    const url = 'https://facebook.com/ciclotrackapp';
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir Facebook:', error);
      throw error;
    }
  },

  async sendEmail(email: string, subject: string, body: string) {
    try {
      const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(emailUrl);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  },
};
