// App.tsx
import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import RoutesScreen from './screens/RoutesScreen';
import CarbonCounterScreen from './screens/CarbonCounterScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ConfigScreen from './screens/ConfigScreen';

export type RootStackParamList = {
  Home: undefined;
  Routes: undefined;
  CarbonCounter: undefined;
  Login: undefined;
  Register: undefined;
  Config: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Contexto global de autenticação e gamificação
export type UserLevel = 'Iniciante' | 'Intermediário' | 'Avançado';
export interface User {
  name: string;
  email: string;
  logged: boolean;
  level: UserLevel;
  progress: number; // 0-100 para próximo nível
  totalKm: number;
  totalCo2: number;
  totalCalories: number;
}
interface UserContextType {
  user: User | null;
  login: (user: Partial<User>) => void;
  logout: () => void;
  updateProgress: (km: number, co2: number, cal: number) => void;
}
export const UserContext = createContext<UserContextType | undefined>(undefined);
export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Lógica de evolução de nível
  function getLevel(totalKm: number) {
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
  const logout = () => setUser(null);
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

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerTitleAlign: 'center' }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
          <Stack.Screen name="Routes" component={RoutesScreen} options={{ title: 'Rotas' }} />
          <Stack.Screen
            name="CarbonCounter"
            component={CarbonCounterScreen}
            options={{ title: 'Contador de Carbono' }}
          />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="Config" component={ConfigScreen} options={{ title: 'Configurações' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
