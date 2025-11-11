import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';

export type ThemeType = 'dark' | 'light';

export const ThemeContext = createContext<{
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}>({ theme: 'dark', setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

// Auth/User basic context (UI level)
export type UserLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
export interface User {
  name: string;
  email: string;
  logged: boolean;
  level: UserLevel;
  progress: number; // 0-100
  totalKm: number;
  totalCo2: number;
  totalCalories: number;
  peso?: number;
}

export interface UserContextType {
  user: User | null;
  login: (user: Partial<User>) => void;
  logout: () => Promise<void>;
  updateProgress: (km: number, co2: number, cal: number) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  function getLevel(totalKm: number): UserLevel {
    if (totalKm >= 200) return 'Avançado';
    if (totalKm >= 50) return 'Intermediário';
    return 'Iniciante';
  }
  function getProgress(totalKm: number) {
    if (totalKm >= 200) return 100;
    if (totalKm >= 50) return Math.round(((totalKm - 50) / 150) * 100);
    return Math.round((totalKm / 50) * 100);
  }

  const login = (u: Partial<User>) => {
    setUser({
      name: u.name || '',
      email: u.email || '',
      logged: true,
      level: getLevel(u.totalKm || 0),
      progress: getProgress(u.totalKm || 0),
      totalKm: u.totalKm || 0,
      totalCo2: u.totalCo2 || 0,
      totalCalories: u.totalCalories || 0,
    });
  };
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Erro ao fazer logout no Supabase:', error);
    }
    setUser(null);
  };
  const updateProgress = (km: number, co2: number, cal: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const newKm = prev.totalKm + km;
      return {
        ...prev,
        totalKm: newKm,
        totalCo2: prev.totalCo2 + co2,
        totalCalories: prev.totalCalories + cal,
        level: getLevel(newKm),
        progress: getProgress(newKm),
      };
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateProgress }}>
      {children}
    </UserContext.Provider>
  );
};

// Stats context (local UI aggregation)
export type RouteHistoryItem = {
  distance: number;
  duration: number;
  mode: 'car' | 'bike';
  date: string;
};
export type UserStats = {
  totalKm: number;
  points: number;
  achievements: string[];
  routeHistory: RouteHistoryItem[];
};

const defaultStats: UserStats = {
  totalKm: 0,
  points: 0,
  achievements: [],
  routeHistory: [],
};

const UserStatsContext = createContext<{
  stats: UserStats;
  addRoute: (route: RouteHistoryItem) => void;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => boolean;
} | null>(null);
export function useUserStats() {
  const ctx = useContext(UserStatsContext);
  if (!ctx) throw new Error('useUserStats must be used within UserStatsProvider');
  return ctx;
}

export const UserStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('userStats');
        if (saved) setStats(JSON.parse(saved));
      } catch {}
    })();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats]);
  const addRoute = (route: RouteHistoryItem) => {
    const newTotalKm = stats.totalKm + route.distance;
    const newPoints = stats.points + Math.round(route.distance * 10);
    const newAchievements = [...stats.achievements];
    if (newTotalKm >= 10 && !newAchievements.includes('10km')) newAchievements.push('10km');
    if (newTotalKm >= 50 && !newAchievements.includes('50km')) newAchievements.push('50km');
    if (newTotalKm >= 100 && !newAchievements.includes('100km')) newAchievements.push('100km');
    setStats({
      ...stats,
      totalKm: newTotalKm,
      points: newPoints,
      achievements: newAchievements,
      routeHistory: [...stats.routeHistory, route],
    });
  };
  const addPoints = (points: number) => {
    setStats(prev => ({ ...prev, points: prev.points + points }));
  };
  const spendPoints = (points: number): boolean => {
    if (stats.points >= points) {
      setStats(prev => ({ ...prev, points: prev.points - points }));
      return true;
    }
    return false;
  };
  return (
    <UserStatsContext.Provider value={{ stats, addRoute, addPoints, spendPoints }}>
      {children}
    </UserStatsContext.Provider>
  );
};

// Progress context
type UserProgress = {
  totalKm: number;
  level: number;
  addKm: (km: number) => void;
};
const UserProgressContext = createContext<UserProgress | undefined>(undefined);
export function useUserProgress() {
  const ctx = useContext(UserProgressContext);
  if (!ctx) throw new Error('useUserProgress must be used within UserProgressProvider');
  return ctx as NonNullable<typeof ctx>;
}

const calcLevel = (totalKm: number) => {
  if (totalKm >= 100) return 5;
  if (totalKm >= 50) return 4;
  if (totalKm >= 25) return 3;
  if (totalKm >= 10) return 2;
  return 1;
};

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalKm, setTotalKm] = useState(0);
  const [level, setLevel] = useState(1);
  const addKm = (km: number) => {
    setTotalKm(prev => {
      const newTotal = prev + km;
      setLevel(calcLevel(newTotal));
      return newTotal;
    });
  };
  return (
    <UserProgressContext.Provider value={{ totalKm, level, addKm }}>
      {children}
    </UserProgressContext.Provider>
  );
};

// Goals context
type Goal = {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  achieved: boolean;
  reward: string;
  unit: string;
};

export type Coupon = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discount: string;
  store: string;
  unlocked: boolean;
  redeemed: boolean;
  code?: string;
};

type UserGoalsContextType = {
  goals: Goal[];
  unlockedCoupons: string[];
  coupons: Coupon[];
  addProgress: (goalId: string, value: number) => void;
  addProgressMulti: (progress: { goalId: string; value: number }[]) => void;
  redeemCoupon: (couponId: string, points: number) => boolean;
};

const defaultGoals: Goal[] = [
  { id: 'km', title: '100 km pedalados', description: 'Pedale 100 km no total', target: 100, current: 0, achieved: false, reward: 'Cupom de desconto 10%', unit: 'km' },
  { id: 'co2', title: '10 kg de CO₂ economizados', description: 'Economize 10 kg de CO₂ usando bicicleta', target: 10, current: 0, achieved: false, reward: 'Cupom de frete grátis', unit: 'kg' },
  { id: 'rides', title: '20 rotas finalizadas', description: 'Finalize 20 rotas de bicicleta', target: 20, current: 0, achieved: false, reward: 'Cupom de 20% OFF', unit: 'rotas' },
  { id: 'long_ride', title: 'Rota de 50 km em uma viagem', description: 'Complete uma rota única de pelo menos 50 km', target: 1, current: 0, achieved: false, reward: 'Cupom especial de aventura', unit: 'vezes' },
];

const defaultCoupons: Coupon[] = [
  { id: 'c1', title: '10% OFF BikeShop', description: '10% de desconto em qualquer produto', pointsCost: 100, discount: '10%', store: 'BikeShop', unlocked: false, redeemed: false },
  { id: 'c2', title: 'R$ 50 OFF CicloStore', description: 'R$ 50 de desconto em compras acima de R$ 200', pointsCost: 250, discount: 'R$ 50', store: 'CicloStore', unlocked: false, redeemed: false },
  { id: 'c3', title: '15% OFF Acessórios', description: '15% de desconto em acessórios', pointsCost: 150, discount: '15%', store: 'BikeMania', unlocked: false, redeemed: false },
  { id: 'c4', title: 'Frete Grátis', description: 'Frete grátis em qualquer compra', pointsCost: 80, discount: 'Frete Grátis', store: 'Todas as lojas', unlocked: false, redeemed: false },
  { id: 'c5', title: '20% OFF Peças', description: '20% de desconto em peças de bicicleta', pointsCost: 200, discount: '20%', store: 'PedalPro', unlocked: false, redeemed: false },
  { id: 'c6', title: 'R$ 100 OFF Premium', description: 'R$ 100 de desconto em compras acima de R$ 500', pointsCost: 500, discount: 'R$ 100', store: 'BikeShop Premium', unlocked: false, redeemed: false },
];

const UserGoalsContext = createContext<UserGoalsContextType | undefined>(undefined);
export function useUserGoals() {
  const ctx = useContext(UserGoalsContext);
  if (!ctx) throw new Error('useUserGoals must be used within UserGoalsProvider');
  return ctx;
}

export const UserGoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser() || {};
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [unlockedCoupons, setUnlockedCoupons] = useState<string[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(defaultCoupons);
  
  useEffect(() => {
    if (user && user.email) {
      (async () => {
        try {
          const saved = await AsyncStorage.getItem(`goals_${user.email}`);
          const savedCoupons = await AsyncStorage.getItem(`coupons_${user.email}`);
          const savedCouponsList = await AsyncStorage.getItem(`couponsList_${user.email}`);
          if (saved) setGoals(JSON.parse(saved));
          else setGoals(defaultGoals.map(g => ({ ...g, current: 0, achieved: false })));
          if (savedCoupons) setUnlockedCoupons(JSON.parse(savedCoupons));
          else setUnlockedCoupons([]);
          if (savedCouponsList) setCoupons(JSON.parse(savedCouponsList));
          else setCoupons(defaultCoupons);
        } catch {}
      })();
    } else {
      setGoals(defaultGoals.map(g => ({ ...g, current: 0, achieved: false })));
      setUnlockedCoupons([]);
      setCoupons(defaultCoupons);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user && user.email) {
      AsyncStorage.setItem(`goals_${user.email}`, JSON.stringify(goals));
      AsyncStorage.setItem(`coupons_${user.email}`, JSON.stringify(unlockedCoupons));
      AsyncStorage.setItem(`couponsList_${user.email}`, JSON.stringify(coupons));
    }
  }, [goals, unlockedCoupons, coupons, user?.email]);

  const addProgress = (goalId: string, value: number) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + value, goal.target);
        const justAchieved = !goal.achieved && newCurrent >= goal.target;
        if (justAchieved) setUnlockedCoupons(coupons => [...coupons, goal.reward]);
        return { ...goal, current: newCurrent, achieved: newCurrent >= goal.target };
      }
      return goal;
    }));
  };

  const addProgressMulti = (progress: { goalId: string; value: number }[]) => {
    progress.forEach(({ goalId, value }) => addProgress(goalId, value));
  };

  const redeemCoupon = (couponId: string, points: number): boolean => {
    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon || coupon.redeemed || points < coupon.pointsCost) {
      return false;
    }
    setCoupons(prev => prev.map(c => 
      c.id === couponId ? { ...c, unlocked: true, redeemed: true, code: `BIKE${Math.random().toString(36).substr(2, 6).toUpperCase()}` } : c
    ));
    return true;
  };

  return (
    <UserGoalsContext.Provider value={{ goals, unlockedCoupons, coupons, addProgress, addProgressMulti, redeemCoupon }}>
      {children}
    </UserGoalsContext.Provider>
  );
};


