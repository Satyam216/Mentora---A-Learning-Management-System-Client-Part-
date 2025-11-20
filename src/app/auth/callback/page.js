'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let unsub = null;

    async function handle() {
      try {
        // 1) Set up a listener for auth state changes.
        // When the OAuth redirect finishes, Supabase client should get a session
        // and trigger this callback. We'll redirect once a session is available.
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
          try {
            if (!session?.access_token) return; // wait until session present
            // small tick so session persists
            await new Promise((r) => setTimeout(r, 150));
            // cleanup
            if (!cancelled) {
              // optional: remove hash/params that supabase appended
              if (typeof window !== 'undefined' && window.history?.replaceState) {
                const url = new URL(window.location.href);
                url.hash = '';
                url.search = '';
                window.history.replaceState({}, document.title, url.pathname + url.search);
              }
              router.replace('/dashboard'); // safe, final redirect
            }
          } catch (e) {
            console.error('auth state handler error', e);
            if (!cancelled) router.replace('/auth/login');
          }
        });

        unsub = listener; // will unsubscribe later

        // 2) As a fallback, check if session already exists on the client
        // (some supabase builds store the session automatically)
        const maybe = await supabase.auth.getSession?.(); // optional chaining
        if (maybe?.data?.session?.access_token) {
          // session already present — redirect immediately
          await new Promise((r) => setTimeout(r, 100));
          if (!cancelled) router.replace('/dashboard');
          return;
        }

        // 3) Last resort: wait up to N seconds for listener to fire, then fallback to login
        const timeoutMs = 10_000;
        await new Promise((resolve) => setTimeout(resolve, timeoutMs));
        if (!cancelled) {
          // if still no session, go to login (or show error)
          const s = await supabase.auth.getSession?.();
          if (s?.data?.session?.access_token) {
            if (!cancelled) router.replace('/dashboard');
          } else {
            if (!cancelled) router.replace('/auth/login');
          }
        }
      } catch (err) {
        console.error('OAuthCallback error', err);
        if (!cancelled) router.replace('/auth/login');
      }
    }

    handle();

    return () => {
      cancelled = true;
      try { unsub?.subscription?.unsubscribe?.(); } catch (e) { /* ignore */ }
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB]">
      <div className="text-center">
        <div className="mb-4 animate-spin border-4 border-amber-400 rounded-full w-12 h-12" />
        <div className="text-sm text-slate-600">Completing sign in…</div>
      </div>
    </div>
  );
}
