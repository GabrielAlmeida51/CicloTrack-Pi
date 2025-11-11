import { supabase } from '../lib/supabase';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  type: 'distance' | 'emissions' | 'time' | 'custom';
  isCompleted: boolean;
  createdAt: string;
  dueDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export const goalsService = {
  async createGoal(userId: string, goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          title: goal.title,
          description: goal.description,
          target_value: goal.targetValue,
          current_value: goal.currentValue,
          unit: goal.unit,
          type: goal.type,
          is_completed: goal.isCompleted,
          due_date: goal.dueDate,
        })
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (e: any) {
      console.error('Error creating goal:', e);
      throw e;
    }
  },

  async getUserGoals(userId: string) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (e: any) {
      console.error('Error fetching goals:', e);
      return [];
    }
  },

  async updateGoalProgress(goalId: string, newValue: number) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update({ current_value: newValue })
        .eq('id', goalId)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (e: any) {
      console.error('Error updating goal:', e);
      throw e;
    }
  },

  async completeGoal(goalId: string) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update({ is_completed: true })
        .eq('id', goalId)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (e: any) {
      console.error('Error completing goal:', e);
      throw e;
    }
  },

  async getUserAchievements(userId: string) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (e: any) {
      console.error('Error fetching achievements:', e);
      return [];
    }
  },

  async unlockAchievement(userId: string, achievementId: string) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (e: any) {
      console.error('Error unlocking achievement:', e);
      throw e;
    }
  },

  checkAchievements(totalKm: number, totalCo2: number, routeCount: number) {
    const unlockedAchievements = [];

    if (totalKm >= 10) unlockedAchievements.push('10km');
    if (totalKm >= 50) unlockedAchievements.push('50km');
    if (totalKm >= 100) unlockedAchievements.push('100km');
    if (totalKm >= 500) unlockedAchievements.push('500km');
    if (totalKm >= 1000) unlockedAchievements.push('1000km');

    if (totalCo2 >= 5) unlockedAchievements.push('eco_guardian');
    if (totalCo2 >= 50) unlockedAchievements.push('eco_hero');

    if (routeCount >= 5) unlockedAchievements.push('five_routes');
    if (routeCount >= 30) unlockedAchievements.push('monthly_cyclist');

    return unlockedAchievements;
  },
};
