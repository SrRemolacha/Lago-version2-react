'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

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
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Error cargando perfil:', error);
        return null;
      }

      return data as Profile | null;
    },
    [supabase]
  );

  useEffect(() => {
    let isMounted = true;

    // 1️⃣ Carga inicial — obtener sesión existente
    const initAuth = async () => {
      try {
        const {
          data: { user: initialUser },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (initialUser) {
          const profileData = await fetchProfile(initialUser.id);
          if (isMounted) {
            setUser(initialUser);
            setProfile(profileData);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('[Auth] Error cargando sesión:', err);
        if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // 2️⃣ Listener — reacciona a cambios de sesión en tiempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      const sessionUser = session?.user ?? null;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (sessionUser) {
          const profileData = await fetchProfile(sessionUser.id);
          if (isMounted) {
            setUser(sessionUser);
            setProfile(profileData);
            setLoading(false);
          }
        }
      }

      if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
        router.push('/login');
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, router]);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[Auth] Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setProfile(null);
      setLoading(false);
      router.push('/login');
      router.refresh();
    }
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