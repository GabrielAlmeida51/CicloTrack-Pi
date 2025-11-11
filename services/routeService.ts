import { supabase } from '../lib/supabase';

export interface RouteData {
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  mode: 'bike' | 'car';
  co2Saved?: number;
  caloriesBurned?: number;
}

export interface RouteHistory extends RouteData {
  id: string;
  date: string;
  userId: string;
}

export const routeService = {
  async saveRoute(userId: string, routeData: RouteData) {
    try {
      const { data, error } = await supabase
        .from('route_history')
        .insert({
          user_id: userId,
          origin: routeData.origin,
          destination: routeData.destination,
          distance_km: routeData.distance,
          duration_min: routeData.duration,
          mode: routeData.mode,
          co2_saved_kg: routeData.co2Saved || 0,
          calories_burned: routeData.caloriesBurned || 0,
          finished_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (e: any) {
      console.error('Error saving route:', e);
      throw e;
    }
  },

  async getUserRouteHistory(userId: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('route_history')
        .select('*')
        .eq('user_id', userId)
        .order('finished_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (e: any) {
      console.error('Error fetching routes:', e);
      return [];
    }
  },

  async getRouteStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error('Error fetching stats:', e);
      return null;
    }
  },

  async searchTomTomSuggestions(query: string, apiKey: string) {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${apiKey}&limit=10`
      );

      if (!response.ok) throw new Error(`TomTom API error: ${response.status}`);

      const data = await response.json();
      return data.results || [];
    } catch (e: any) {
      console.error('Error searching TomTom:', e);
      throw e;
    }
  },

  async calculateEmissionSaved(distanceKm: number, carConsumption: number) {
    const fatorEmissao = 2.31;
    const litrosEvitados = distanceKm / carConsumption;
    return parseFloat((litrosEvitados * fatorEmissao).toFixed(2));
  },

  calculateCaloriesBurned(distanceKm: number, bikeSpeed = 20) {
    const caloriesPer30Min = 240;
    const timeHours = distanceKm / bikeSpeed;
    return Math.round((timeHours * 60 / 30) * caloriesPer30Min);
  },
};
