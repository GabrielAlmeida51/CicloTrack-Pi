import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import RoutesScreen from './screens/RoutesScreen';
import ActivitySummaryScreen from './screens/ActivitySummaryScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import CarbonCounterScreen from './screens/CarbonCounterScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ConfigScreen from './screens/ConfigScreen';
import CuponsScreen from './screens/CuponsScreen';
import EducationalContentScreen from './screens/EducationalContentScreen';
import TermsScreen from './screens/TermsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import type { RootStackParamList } from './types/navigation';

import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ThemeContext, ThemeType, UserGoalsProvider, UserProgressProvider, UserProvider, UserStatsProvider, useUser } from './contexts';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => { sub.subscription?.unsubscribe(); };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserProvider>
        <UserStatsProvider>
          <UserProgressProvider>
            <UserGoalsProvider>
              <NavigationContainer>
                <NavigatorContent session={session} />
              </NavigationContainer>
            </UserGoalsProvider>
          </UserProgressProvider>
        </UserStatsProvider>
      </UserProvider>
    </ThemeContext.Provider>
  );
}

function NavigatorContent({ session }: { session: Session | null }) {
  const { user } = useUser();
  const isLogged = Boolean(session) || Boolean(user?.logged);

  if (isLogged) {
    return (
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', headerShown: true }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard', headerShown: false }} />
        <Stack.Screen name="Routes" component={RoutesScreen} options={{ title: 'Rotas' }} />
        <Stack.Screen name="CarbonCounter" component={CarbonCounterScreen} options={{ title: 'CO₂' }} />
        <Stack.Screen name="Config" component={ConfigScreen} options={{ title: 'Config' }} />
        <Stack.Screen name="EducationalContent" component={EducationalContentScreen} options={{ title: 'Educativo' }} />
        <Stack.Screen name="ActivitySummary" component={ActivitySummaryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Estatísticas' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cupons" component={CuponsScreen} options={{ title: 'Cupons' }} />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Termos' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacidade' }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ headerShown: true, title: 'Termos' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ headerShown: true, title: 'Privacidade' }} />
    </Stack.Navigator>
  );
}
