'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';


type Profile = {
  id: string;
  role: 'admin' | 'user';
  display_name: string | null;
  avatar_url: string | null;
  is_active: boolean | null;
  deleted_at: string | null;
  created_at?: string;
  updated_at?: string;
};

type AuthContextType = {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] profile error', error);
        return null;
      }

      if (!data) {
        console.warn('[Auth] profile not found');
        return null;
      }

      return data as Profile;
    };

    const initAuth = async () => {
      // 1️⃣ Obtener sesión inicial
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        const profileData = await loadProfile(sessionUser.id);
        if (mounted) setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    initAuth();

    // 2️⃣ Escuchar cambios de auth (login / logout / refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setLoading(true);

      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        const profileData = await loadProfile(sessionUser.id);
        if (mounted) setProfile(profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
