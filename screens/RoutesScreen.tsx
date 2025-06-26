// screens/RoutesScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function RoutesScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [emissionSaved, setEmissionSaved] = useState<number | null>(null);
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);

  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const geocodeAddress = async (address: string) => {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=t4XXN5DSEAGeKNUGjvQQXVmb6e8UKuPo`;
    const response = await fetch(url);
    const data = await response.json();
    return {
      latitude: data.results[0].position.lat,
      longitude: data.results[0].position.lon,
    };
  };

  const calculateRoute = async () => {
    if (!origin || !destination) {
      Alert.alert('Erro', 'Informe origem e destino.');
      return;
    }
    try {
      const originCoords = await geocodeAddress(origin);
      const destinationCoords = await geocodeAddress(destination);

      const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${originCoords.latitude},${originCoords.longitude}:${destinationCoords.latitude},${destinationCoords.longitude}/json?travelMode=bicycle&key=t4XXN5DSEAGeKNUGjvQQXVmb6e8UKuPo`;
      const response = await fetch(routeUrl);
      const data = await response.json();
      const legs = data.routes[0].legs;
      const summary = data.routes[0].summary;

      const points = legs[0].points.map((p: any) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));
      setCoords(points);

      const distKm = summary.lengthInMeters / 1000;
      const durMin = summary.travelTimeInSeconds / 60;

      setDistance(distKm.toFixed(2));
      setDuration(durMin.toFixed(0));

      const CO2_CAR_GRAMS_PER_KM = 120; // média em g/km
      const co2SavedKg = (distKm * CO2_CAR_GRAMS_PER_KM) / 1000;
      setEmissionSaved(+co2SavedKg.toFixed(2));

      const kcalPerKm = 30; // média
      const burned = distKm * kcalPerKm;
      setCaloriesBurned(Math.round(burned));

      setRegion({
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } catch (e) {
      Alert.alert('Erro', 'Falha ao calcular rota.');
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {coords.length > 0 && (
          <>
            <Polyline coordinates={coords} strokeWidth={4} strokeColor="#2E8B57" />
            <Marker coordinate={coords[0]} title="Origem" />
            <Marker coordinate={coords[coords.length - 1]} title="Destino" />
          </>
        )}
      </MapView>
      <ScrollView style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Origem (ex: Av. Paulista, SP)"
          value={origin}
          onChangeText={setOrigin}
        />
        <TextInput
          style={styles.input}
          placeholder="Destino (ex: Parque Ibirapuera)"
          value={destination}
          onChangeText={setDestination}
        />
        <Button title="Calcular Rota" onPress={calculateRoute} color="#2E8B57" />

        {distance && (
          <View style={styles.resultsBox}>
            <Text style={styles.resultText}>Distância: {distance} km</Text>
            <Text style={styles.resultText}>Tempo de bicicleta: {duration} min</Text>
            <Text style={styles.resultText}>Calorias queimadas: {caloriesBurned} kcal</Text>
            <Text style={styles.resultText}>CO₂ economizado: {emissionSaved} kg</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2E8B57',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  resultsBox: {
    marginTop: 12,
    backgroundColor: '#F0FFF0',
    borderRadius: 8,
    padding: 10,
  },
  resultText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E8B57',
    marginBottom: 4,
  },
});