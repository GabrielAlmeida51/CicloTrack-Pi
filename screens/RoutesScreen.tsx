// screens/RoutesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Platform, ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard, ActivityIndicator, Modal, FlatList } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';
import { useUser } from '../contexts';
import { useUserProgress } from '../contexts';
import { useUserGoals } from '../contexts';
import { useUserStats } from '../contexts';
import { useTheme } from '../contexts';
import { palette } from '../colors';
import { ProtectedRoute } from '../components';

const TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY || '';

type LatLng = { latitude: number; longitude: number };

type Suggestion = {
  id: string;
  address: { freeformAddress: string };
  position: { lat: number; lon: number };
};

export default function RoutesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Routes'>>();
  const { user } = useUser() || {};
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCoords, setOriginCoords] = useState<LatLng | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [emissionSaved, setEmissionSaved] = useState<number | null>(null);
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
  const [mode, setMode] = useState<'car' | 'bike'>('bike');
  const [favorites, setFavorites] = useState([
    { type: 'favorite', label: 'Casa', address: 'Rua das Flores, 123' },
    { type: 'favorite', label: 'Trabalho', address: 'Av. Paulista, 1000' },
  ]);
  const [showAddFavModal, setShowAddFavModal] = useState(false);
  const [newFavLabel, setNewFavLabel] = useState('');
  const [newFavAddress, setNewFavAddress] = useState('');
  const [routeError, setRouteError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showCenterBtn, setShowCenterBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const { totalKm, level, addKm } = useUserProgress() || {};
  const { addProgressMulti } = useUserGoals() || {};
  const { addRoute } = useUserStats() || {};
  const [showFinishModal, setShowFinishModal] = useState(false);
  const { theme } = useTheme();
  const colors = palette[theme];

  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Mock de sugestões de destinos/favoritos
  const recentSuggestions = [
    { type: 'recent', label: 'Parque Ibirapuera', address: 'Av. Pedro Álvares Cabral, s/n' },
    { type: 'recent', label: 'Shopping Center', address: 'Av. das Nações, 500' },
  ];
  const suggestionsList = [...favorites, ...recentSuggestions];

  // Filtro de sugestões conforme o texto digitado
  const filteredSuggestions = destination.length > 0
    ? suggestionsList.filter(s =>
        s.label.toLowerCase().includes(destination.toLowerCase()) ||
        s.address.toLowerCase().includes(destination.toLowerCase())
      )
    : suggestionsList;

  // Opções de emissão de CO2 por tipo de carro (g/km)
  const carTypes = [
    { label: 'Popular', value: 'popular', co2: 120 },
    { label: 'SUV', value: 'suv', co2: 180 },
    { label: 'Elétrico', value: 'eletrico', co2: 0 },
  ];
  const [carType, setCarType] = useState<'popular' | 'suv' | 'eletrico'>('popular');
  // Peso do usuário para cálculo de calorias
  const [userWeight, setUserWeight] = useState<number>(70);

  // Removida navegação forçada para Login; App.tsx cuida do stack
  useEffect(() => {
    // Somente alerta opcional
    if (!user || !user.logged) {
      // Alert.alert('Atenção', 'Você não está logado. Alguns recursos podem ficar limitados.');
    }
  }, [user]);

  useEffect(() => {
    // Carregar favoritos do Supabase quando usuário estiver logado
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth.user?.id;
        if (!userId) return;
        const { data, error } = await supabase
          .from('favorites')
          .select('label, address, lat, lng')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const favs = (data || []).map((f: any) => ({ type: 'favorite', label: f.label, address: f.address }));
        if (favs.length > 0) setFavorites(favs);
      } catch (e) {
        // silencia erros de favoritos
      }
    })();
  }, [user]);

  const saveCurrentDestinationAsFavorite = async () => {
    try {
      if (!destination) {
        Alert.alert('Favoritos', 'Informe um destino para salvar.');
        return;
      }
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) {
        Alert.alert('Favoritos', 'Você precisa estar logado.');
        return;
      }
      const coords = destinationCoords || (await geocodeAddress(destination));
      const { error } = await supabase.from('favorites').insert({
        user_id: userId,
        label: destination,
        address: destination,
        lat: coords?.latitude ?? null,
        lng: coords?.longitude ?? null,
      });
      if (error) throw error;
      setFavorites(prev => [{ type: 'favorite', label: destination, address: destination }, ...prev]);
      Alert.alert('Favoritos', 'Destino salvo com sucesso.');
    } catch (e: any) {
      Alert.alert('Favoritos', e.message || 'Não foi possível salvar.');
    }
  };

  useEffect(() => {
    (async () => {
      setLocationLoading(true);
      setLocationError(null);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permissão de localização negada.');
          setLocationLoading(false);
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      } catch (e) {
        setLocationError('Não foi possível obter sua localização.');
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Autocomplete TomTom
  const fetchSuggestions = async (text: string) => {
    if (!text) return setSuggestions([]);
    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.json?key=${TOMTOM_API_KEY}&limit=5&language=pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    setSuggestions(data.results || []);
  };

  // Geocodificação TomTom
  const geocodeAddress = async (address: string): Promise<LatLng | null> => {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results[0]) {
      return {
        latitude: data.results[0].position.lat,
        longitude: data.results[0].position.lon,
      };
    }
    return null;
  };

  // Calcular rota TomTom
  const calculateRoute = async () => {
    setIsLoading(true);
    setRouteError(null);
    try {
      let orig = originCoords;
      let dest = destinationCoords;
      if (!orig && origin) orig = await geocodeAddress(origin);
      if (!dest && destination) dest = await geocodeAddress(destination);
      if (!orig || !dest) throw new Error('Origem ou destino inválido.');
      setOriginCoords(orig);
      setDestinationCoords(dest);
      const travelMode = mode === 'bike' ? 'bicycle' : 'car';
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${orig.latitude},${orig.longitude}:${dest.latitude},${dest.longitude}/json?travelMode=${travelMode}&key=${TOMTOM_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.routes || !data.routes[0] || !data.routes[0].legs) throw new Error('Rota não encontrada');
      const points: LatLng[] = data.routes[0].legs[0].points.map((p: any) => ({ latitude: p.latitude, longitude: p.longitude }));
      setCoords(points);
      const distKm = data.routes[0].summary.lengthInMeters / 1000;
      const durMin = data.routes[0].summary.travelTimeInSeconds / 60;
      setDistance(distKm);
      setDuration(durMin);
      // Calcular CO2 e calorias
      if (mode === 'bike') {
        // Fórmula: kcal/km = 0.28 * peso(kg) (aprox. para ciclismo urbano)
        const kcalPerKm = 0.28 * userWeight;
        const burned = distKm * kcalPerKm;
        setCaloriesBurned(burned);
        // CO2 economizado em relação ao carro popular
        const co2SavedKg = (distKm * 120) / 1000;
        setEmissionSaved(co2SavedKg);
      } else {
        // Carro: calcula emissão conforme tipo
        const car = carTypes.find(c => c.value === carType) || carTypes[0];
        const co2EmittedKg = (distKm * car.co2) / 1000;
        setEmissionSaved(co2EmittedKg);
        setCaloriesBurned(null);
      }
      setRegion({
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
      setShowRoute(true);
    } catch (e) {
      setRouteError('Não foi possível calcular a rota. Verifique os endereços.');
      setCoords([]);
      setDistance(null);
      setDuration(null);
      setEmissionSaved(null);
      setCaloriesBurned(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Novo fluxo: ao clicar em calcular rota, mostrar painel de opções
  const handleShowOptionsPanel = () => {
    setShowOptionsPanel(true);
  };
  // Novo fluxo: ao confirmar no painel, calcular rota e esconder painel
  const handleConfirmOptionsAndCalculate = async () => {
    await calculateRoute();
    setShowOptionsPanel(false);
  };

  // Botão de voltar para recalcular rota
  const handleBackToEdit = () => {
    setShowRoute(false);
    setShowOptionsPanel(false);
    setCoords([]);
    setDistance(null);
    setDuration(null);
    setRouteError(null);
  };

  // Inverter origem/destino
  const invertRoute = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    const tempCoords = originCoords;
    setOriginCoords(destinationCoords);
    setDestinationCoords(tempCoords);
    setCoords([]);
    setDistance(null);
    setDuration(null);
    setRouteError(null);
  };

  // Sugestões de autocomplete
  const handleSuggestionPress = async (item: Suggestion) => {
    if (activeField === 'origin') {
      setOrigin(item.address.freeformAddress);
      setOriginCoords({ latitude: item.position.lat, longitude: item.position.lon });
    } else {
      setDestination(item.address.freeformAddress);
      setDestinationCoords({ latitude: item.position.lat, longitude: item.position.lon });
    }
    setSuggestions([]);
    setActiveField(null);
    Keyboard.dismiss();
  };

  // Função utilitária para formatar duração
  function formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else if (minutes < 1440) {
      const h = Math.floor(minutes / 60);
      const m = Math.round(minutes % 60);
      return m > 0 ? `${h}h ${m}min` : `${h}h`;
    } else {
      const d = Math.floor(minutes / 1440);
      const h = Math.round((minutes % 1440) / 60);
      return h > 0 ? `${d}d ${h}h` : `${d}d`;
    }
  }

  // Função para finalizar rota
  const handleFinishRoute = async () => {
    const routeDistance = distance;
    const routeDuration = duration;
    const routeEmission = emissionSaved;
    const routeCalories = caloriesBurned;
    const routeMode = mode;
    
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      
      if (userId && routeDistance && routeDuration && originCoords && destinationCoords) {
        await supabase.from('route_history').insert({
          user_id: userId,
          mode: routeMode,
          distance_km: routeDistance,
          duration_min: routeDuration,
          co2_saved_kg: routeMode === 'bike' ? (routeEmission || 0) : null,
          calories_kcal: routeMode === 'bike' ? (routeCalories || null) : null,
          origin_address: origin || null,
          destination_address: destination || null,
          origin_lat: originCoords.latitude,
          origin_lng: originCoords.longitude,
          destination_lat: destinationCoords.latitude,
          destination_lng: destinationCoords.longitude,
          finished_at: new Date().toISOString(),
        });
      }
      if (routeMode === 'bike' && routeDistance && routeDuration) {
        addKm?.(routeDistance);
        addRoute?.({
          distance: routeDistance,
          duration: routeDuration,
          mode: 'bike',
          date: new Date().toISOString(),
        });
        addProgressMulti?.([
          { goalId: 'km', value: routeDistance },
          { goalId: 'co2', value: routeEmission || 0 },
          { goalId: 'rides', value: 1 },
          { goalId: 'long_ride', value: routeDistance >= 50 ? 1 : 0 },
        ]);
      }
    } catch (e) {
      console.log('Erro ao salvar rota:', e);
    } finally {
      setShowFinishModal(true);
      setShowRoute(false);
      setCoords([]);
      setDistance(null);
      setDuration(null);
      setEmissionSaved(null);
      setCaloriesBurned(null);
      setOrigin('');
      setDestination('');
      setOriginCoords(null);
      setDestinationCoords(null);
    }
  };

  // Remover qualquer chamada ou uso de addRoute, handleFinishRoute, e lógica de pontos/conquistas.

  return (
    <ProtectedRoute screenName="Rotas">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Barra de busca Google Maps style */}
        <View style={styles.searchBarContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Origem"
              placeholderTextColor={colors.textSecondary}
              value={origin}
              onChangeText={text => { setOrigin(text); setActiveField('origin'); fetchSuggestions(text); }}
              onFocus={() => setActiveField('origin')}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.invertBtn} onPress={invertRoute}>
              <MaterialCommunityIcons name="swap-vertical" size={24} color={colors.green} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Destino"
              placeholderTextColor={colors.textSecondary}
              value={destination}
              onChangeText={text => { setDestination(text); setActiveField('destination'); fetchSuggestions(text); }}
              onFocus={() => setActiveField('destination')}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {/* Sugestões */}
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item)}>
                  <Text style={{ color: colors.textSecondary }}>{item.address.freeformAddress}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionList}
            />
          )}
          {/* Salvar destino como favorito */}
          {destination?.length > 0 && (
            <TouchableOpacity style={[styles.routeFavBtnModern, { alignSelf: 'flex-end' }]} onPress={saveCurrentDestinationAsFavorite}>
              <Text style={styles.routeFavBtnTextModern}>Salvar destino nos favoritos</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Botão calcular rota (só aparece após preencher origem/destino e antes do painel) */}
        {!showRoute && !showOptionsPanel && origin && destination && !isLoading && (
          <TouchableOpacity style={[styles.calcBtn, { backgroundColor: colors.green }]} onPress={handleShowOptionsPanel}>
            <Text style={[styles.calcBtnText, { color: colors.background }]}>Calcular rota</Text>
          </TouchableOpacity>
        )}
        {/* Mapa */}
        <View style={[styles.mapWrapper, showRoute && styles.mapWrapperFull]}>
          <MapView
            style={styles.map}
            region={region}
            zoomEnabled={true}
            scrollEnabled={true}
          >
            {originCoords && <Marker coordinate={originCoords} title="Origem" />}
            {destinationCoords && <Marker coordinate={destinationCoords} title="Destino" />}
            {coords.length > 0 && <Polyline coordinates={coords} strokeWidth={4} strokeColor={colors.green} />}
          </MapView>
          {/* Botão de voltar quando rota está sendo exibida */}
          {showRoute && (
            <TouchableOpacity style={styles.backBtn} onPress={handleBackToEdit}>
              <MaterialCommunityIcons name="arrow-left" size={26} color={colors.green} />
            </TouchableOpacity>
          )}
        </View>
        {/* Botão finalizar rota ao lado do botão de configurações, canto inferior direito */}
        {showRoute && (
          <TouchableOpacity style={[styles.routeStartBtnModern, { position: 'absolute', right: 96, bottom: 40, zIndex: 500, backgroundColor: colors.green }]} onPress={handleFinishRoute}>
            <Text style={[styles.routeStartBtnTextModern, { color: colors.background }]}>Finalizar</Text>
          </TouchableOpacity>
        )}
        {/* Card de rota - novo layout moderno */}
        {(distance && duration) && (
          <View style={styles.routeCardModern}>
            <View style={styles.routeInfoRowModern}>
              <MaterialCommunityIcons name="map-marker-distance" size={22} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={styles.routeValueModern}>{distance} km</Text>
            </View>
            <View style={styles.routeInfoRowModern}>
              <MaterialCommunityIcons name="clock-outline" size={22} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={styles.routeValueModern}>{formatDuration(Number(duration))}</Text>
            </View>
            <View style={styles.routeInfoRowModern}>
              <MaterialCommunityIcons name={mode === 'bike' ? 'bike' : 'car'} size={22} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={styles.routeValueModern}>{mode === 'bike' ? 'Bicicleta' : 'Carro'}</Text>
            </View>
          </View>
        )}
        {routeError && (
          <View style={styles.routeCard}>
            <Text style={{ color: '#FF6F6F', textAlign: 'center' }}>{routeError}</Text>
          </View>
        )}
        {locationLoading && (
          <View style={styles.wazeRouteCard}>
            <ActivityIndicator size="large" color={colors.green} />
            <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Obtendo sua localização...</Text>
          </View>
        )}
        {locationError && (
          <View style={styles.wazeRouteCard}>
            <Text style={{ color: '#FF6F6F', textAlign: 'center', fontSize: 15 }}>{locationError}</Text>
          </View>
        )}
        {/* Painel inferior de opções de rota (bottom sheet) */}
        {!showRoute && showOptionsPanel && (
          <View style={styles.bottomSheet}>
            <Text style={styles.bottomSheetTitle}>Opções de rota</Text>
            <View style={styles.bottomSheetOptionsRowModern}>
              <TouchableOpacity style={[styles.modeBtnModern, mode === 'car' && styles.modeBtnModernActive]} onPress={() => setMode('car')}>
                <MaterialCommunityIcons name="car" size={32} color={mode === 'car' ? colors.background : colors.green} />
                <Text style={[styles.bottomSheetOptionTextModern, mode === 'car' && styles.bottomSheetOptionTextModernActive]}>Carro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtnModern, mode === 'bike' && styles.modeBtnModernActive]} onPress={() => setMode('bike')}>
                <MaterialCommunityIcons name="bike" size={32} color={mode === 'bike' ? colors.background : colors.green} />
                <Text style={[styles.bottomSheetOptionTextModern, mode === 'bike' && styles.bottomSheetOptionTextModernActive]}>Bicicleta</Text>
              </TouchableOpacity>
            </View>
            {/* Seletor de tipo de carro */}
            {mode === 'car' && (
              <View style={styles.carTypeRow}>
                {carTypes.map(car => (
                  <TouchableOpacity
                    key={car.value}
                    style={[styles.carTypeBtn, carType === car.value && styles.carTypeBtnActive]}
                    onPress={() => setCarType(car.value as any)}
                  >
                    <Text style={[styles.carTypeText, carType === car.value && styles.carTypeTextActive]}>{car.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* Campo de peso para bike */}
            {mode === 'bike' && (
              <View style={styles.weightInputRow}>
                <Text style={styles.weightInputLabel}>Peso (kg):</Text>
                <TextInput
                  style={styles.weightInput}
                  keyboardType="numeric"
                  value={userWeight.toString()}
                  onChangeText={txt => {
                    const val = parseInt(txt.replace(/[^0-9]/g, ''));
                    if (!isNaN(val)) setUserWeight(val);
                  }}
                  maxLength={3}
                />
              </View>
            )}
            <View style={styles.bottomSheetInfoRowModern}>
              <MaterialCommunityIcons name="map-marker-distance" size={22} color={colors.green} style={{ marginRight: 4 }} />
              <Text style={styles.bottomSheetInfoTextModern}>{distance !== null ? `${distance.toFixed(2)} km` : '--'}</Text>
              <MaterialCommunityIcons name="clock-outline" size={22} color={colors.green} style={{ marginLeft: 18, marginRight: 4 }} />
              <Text style={styles.bottomSheetInfoTextModern}>{duration !== null ? formatDuration(Number(duration)) : '--'}</Text>
            </View>
            <TouchableOpacity style={styles.calcBtnBottomSheetModern} onPress={handleConfirmOptionsAndCalculate}>
              <Text style={styles.calcBtnText}>Confirmar e calcular rota</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Card de rota - moderno, após calcular rota (mapa tela cheia) */}
        {showRoute && (distance !== null && duration !== null) && (
          <View style={styles.routeCardModernFull}>
            <View style={styles.routeInfoRowModernFull}>
              <MaterialCommunityIcons name="map-marker-distance" size={22} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={styles.routeValueModernFull}>{distance.toFixed(2)} km</Text>
            </View>
            <View style={styles.routeInfoRowModernFull}>
              <MaterialCommunityIcons name="clock-outline" size={22} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={styles.routeValueModernFull}>{formatDuration(Number(duration))}</Text>
            </View>
            <View style={styles.routeInfoRowModernFull}>
              <MaterialCommunityIcons name="leaf" size={22} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={styles.routeValueModernFull}>{emissionSaved !== null ? `${emissionSaved.toFixed(2)} kg CO₂ ${mode === 'bike' ? 'eco' : carTypes.find(c => c.value === carType)?.label}` : '--'}</Text>
            </View>
            {mode === 'bike' && (
              <View style={styles.routeInfoRowModernFull}>
                <MaterialCommunityIcons name="fire" size={22} color={colors.green} style={{ marginRight: 8 }} />
                <Text style={styles.routeValueModernFull}>{caloriesBurned !== null ? `${caloriesBurned.toFixed(0)} kcal` : '--'}</Text>
              </View>
            )}
          </View>
        )}
        {/* Modal de feedback ao finalizar rota */}
        <Modal
          visible={showFinishModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFinishModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalContentModern}>
              <MaterialCommunityIcons name="trophy" size={64} color={colors.green} style={{ marginBottom: 16 }} />
              <Text style={styles.modalTitle}>Parabéns!</Text>
              <Text style={{ color: colors.green, fontSize: 16, marginBottom: 16, textAlign: 'center' }}>Você finalizou sua rota de bicicleta!</Text>
              <View style={{ width: '100%', backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Total pedalado:</Text>
                  <Text style={{ color: colors.green, fontSize: 14, fontWeight: 'bold' }}>{totalKm?.toFixed(2)} km</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Nível:</Text>
                  <Text style={{ color: colors.green, fontSize: 14, fontWeight: 'bold' }}>{level}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.routeStartBtnModern, { backgroundColor: colors.green, width: '100%' }]} 
                onPress={() => {
                  setShowFinishModal(false);
                  navigation.navigate('Cupons');
                }}
              >
                <Text style={[styles.routeStartBtnTextModern, { color: colors.background }]}>Ver Cupons</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ marginTop: 12, padding: 12 }} 
                onPress={() => setShowFinishModal(false)}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {/* Botão flutuante de Config removido - acesso via navbar */}
    </ProtectedRoute>
  );
}

const bgColor = '#181F23';
const green = '#A3FF6F';
const grayText = '#7A848A';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181F23' },
  searchBarContainer: {
    backgroundColor: '#23292D',
    borderRadius: 18,
    margin: 16,
    padding: 10,
    zIndex: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#181F23',
    color: '#7A848A',
    fontSize: 16,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
  },
  invertBtn: {
    backgroundColor: 'rgba(163,255,111,0.10)',
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 2,
  },
  suggestionList: {
    backgroundColor: '#23292D',
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 120,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#181F23',
  },
  calcBtn: {
    backgroundColor: '#A3FF6F',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginVertical: 8,
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  calcBtnText: {
    color: '#181F23',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#23292D',
    borderRadius: 18,
    margin: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  routeCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    marginHorizontal: 24,
    backgroundColor: '#23292D',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowColor: green,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 3,
    alignItems: 'center',
  },
  routeText: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  modeBtn: {
    backgroundColor: '#23292D',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 4,
  },
  modeBtnActive: {
    backgroundColor: '#A3FF6F',
  },
  wazeRouteCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    marginHorizontal: 24,
    backgroundColor: '#23292D',
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: green,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 3,
    alignItems: 'center',
  },
  wazeRouteInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    gap: 10,
  },
  wazeRouteInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163,255,111,0.07)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  wazeRouteInfoText: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  wazeRouteCardCompact: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    marginHorizontal: 32,
    backgroundColor: '#23292D',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: green,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 3,
    alignItems: 'center',
  },
  invertBtnDisabled: {
    opacity: 0.4,
  },
  defineDestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163,255,111,0.07)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 2,
    shadowColor: green,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  defineDestBtnText: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  navbarMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: '#181F23',
    borderBottomWidth: 1,
    borderBottomColor: '#23292D',
    gap: 10,
  },
  navIconBtn: {
    padding: 4,
    borderRadius: 16,
  },
  mapWrapperModern: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#23292D',
  },
  mapModern: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  centerMapBtn: {
    position: 'absolute',
    top: 28,
    left: 18,
    right: 18,
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(163,255,111,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: green,
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
  routeSearchCardBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    marginHorizontal: 24,
    backgroundColor: 'rgba(163,255,111,0.13)',
    borderRadius: 32,
    padding: 20,
    shadowColor: green,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 3,
  },
  routeSearchCardContent: {
    backgroundColor: '#181F23',
    borderRadius: 22,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: green,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  routeSearchTitle: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  routeSearchOrigin: {
    color: '#7A848A',
    fontSize: 15,
    fontWeight: '600',
  },
  defineDestBtnModern: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163,255,111,0.07)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 2,
    shadowColor: green,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  defineDestBtnTextModern: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalContentModern: {
    backgroundColor: '#181F23',
    borderRadius: 22,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: green,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  modalInputModern: {
    width: '100%',
    backgroundColor: '#23292D',
    borderRadius: 12,
    color: '#7A848A',
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  routeResultCardBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    marginHorizontal: 24,
    backgroundColor: 'rgba(163,255,111,0.13)',
    borderRadius: 32,
    padding: 20,
    shadowColor: green,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 3,
  },
  routeResultInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    gap: 10,
  },
  routeResultInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163,255,111,0.07)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  routeResultInfoText: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  routeStartBtnModern: {
    backgroundColor: '#A3FF6F',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 38,
    alignItems: 'center',
    marginTop: 2,
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  routeStartBtnTextModern: {
    color: '#181F23',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  routeFavBtnModern: {
    marginLeft: 4,
    padding: 4,
    borderRadius: 16,
  },
  routeFavBtnTextModern: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  routeErrorText: {
    color: '#FF6F6F',
    textAlign: 'center',
    fontSize: 15,
  },
  routeLoadingText: {
    color: '#7A848A',
    marginTop: 10,
  },
  routeInfoText: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  routeCardTop: {
    position: 'absolute',
    top: 24,
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(35,41,45,0.93)',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: green,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
    alignItems: 'center',
  },
  routeCardModern: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    minWidth: 170,
    backgroundColor: 'rgba(35,41,45,0.75)',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 22,
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(163,255,111,0.25)',
    alignItems: 'flex-start',
    gap: 8,
  },
  routeInfoRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  routeValueModern: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  mapWrapperFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
  backBtn: {
    position: 'absolute',
    top: 32,
    left: 24,
    backgroundColor: 'rgba(35,41,45,0.85)',
    borderRadius: 18,
    padding: 8,
    zIndex: 200,
    shadowColor: green,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(35,41,45,0.97)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 28,
    shadowColor: green,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 50,
    alignItems: 'center',
  },
  bottomSheetTitle: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  bottomSheetOptionsRowModern: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    marginBottom: 18,
    marginTop: 8,
  },
  modeBtnModern: {
    backgroundColor: 'rgba(35,41,45,0.7)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: green,
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 90,
  },
  modeBtnModernActive: {
    backgroundColor: '#A3FF6F',
    borderColor: '#A3FF6F',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetOptionTextModern: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  bottomSheetOptionTextModernActive: {
    color: '#181F23',
  },
  bottomSheetInfoRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 2,
    gap: 2,
  },
  bottomSheetInfoTextModern: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 2,
  },
  calcBtnBottomSheetModern: {
    backgroundColor: '#A3FF6F',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 44,
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  routeCardModernFull: {
    position: 'absolute',
    top: 36,
    right: 24,
    minWidth: 200,
    backgroundColor: 'rgba(35,41,45,0.80)',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 28,
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 200,
    borderWidth: 1.5,
    borderColor: 'rgba(163,255,111,0.25)',
    alignItems: 'flex-start',
    gap: 10,
  },
  routeInfoRowModernFull: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeValueModernFull: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.5,
  },
  carTypeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  carTypeBtn: {
    backgroundColor: 'rgba(35,41,45,0.7)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  carTypeBtnActive: {
    backgroundColor: '#A3FF6F',
    borderColor: '#A3FF6F',
  },
  carTypeText: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  carTypeTextActive: {
    color: '#181F23',
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  weightInputLabel: {
    color: '#A3FF6F',
    fontWeight: 'bold',
    fontSize: 15,
  },
  weightInput: {
    backgroundColor: '#23292D',
    color: '#A3FF6F',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    minWidth: 50,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: '#A3FF6F',
  },
  settingsBtn: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#A3FF6F',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A3FF6F',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 300,
  },
});