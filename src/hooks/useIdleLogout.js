'use client';
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function useIdleLogout(minutes = Number(process.env.NEXT_PUBLIC_IDLE_MINUTES || 30)) {
  const router = useRouter();
  const timeoutRef = useRef(null);
  const events = ['mousemove','mousedown','keydown','touchstart','scroll','visibilitychange'];

  useEffect(() => {
    function resetTimer() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        // sign out
        await supabase.auth.signOut();
        router.push('/auth/login');
      }, minutes * 60 * 1000);
    }

    function handleVisibility() {
      if (document.visibilityState === 'hidden') return; // keep
      resetTimer();
    }

    events.forEach(e => window.addEventListener(e, resetTimer));
    document.addEventListener('visibilitychange', handleVisibility);
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      document.removeEventListener('visibilitychange', handleVisibility);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [minutes, router]);
}
