import { supabase } from '../lib/supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw new AuthError(error.code || 'LOGIN_ERROR', error.message);
      
      return { user: data.user, session: data.session };
    } catch (e: any) {
      throw new AuthError(e.code || 'LOGIN_ERROR', e.message || 'Erro ao fazer login');
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: { data: { name: credentials.name } },
      });

      if (error) throw new AuthError(error.code || 'REGISTER_ERROR', error.message);

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          name: credentials.name,
        });
      }

      return { user: data.user };
    } catch (e: any) {
      throw new AuthError(e.code || 'REGISTER_ERROR', e.message || 'Erro ao registrar');
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new AuthError(error.code, error.message);
    } catch (e: any) {
      throw new AuthError(e.code || 'LOGOUT_ERROR', e.message || 'Erro ao fazer logout');
    }
  },

  async getUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return { ...user, profile: data };
    } catch (e: any) {
      console.error('Error fetching profile:', e);
      return null;
    }
  },
};
