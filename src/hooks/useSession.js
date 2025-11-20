// src/hooks/useSession.js
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

export function useSession() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function init() {
      // 1) get current session
      const sessionRes = await supabase.auth.getSession();
      const session = sessionRes?.data?.session;
      if (!mounted) return;
      setUser(session?.user ?? null);

      // 2) if user exists, fetch profile
      if (session?.user) {
        try {
          const token = session.access_token;
          const res = await api.get('/auth/profile', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
          if (mounted) setProfile(res.data);
        } catch (err) {
          console.warn('profile fetch failed', err);
          if (mounted) setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    }

    init();

    // 3) subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      // when session changes (sign in/out) -> fetch profile or clear
      (async () => {
        if (session?.user) {
          try {
            const token = session.access_token;
            const res = await api.get('/auth/profile', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            if (mounted) setProfile(res.data);
          } catch (err) {
            if (mounted) setProfile(null);
          }
        } else {
          if (mounted) setProfile(null);
        }
      })();
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return { user, profile, loading };
}
