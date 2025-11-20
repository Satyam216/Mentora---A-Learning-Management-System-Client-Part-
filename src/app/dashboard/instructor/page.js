'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/instructor/Sidebar';
import Topbar from '@/components/instructor/Topbar';
import StatsCards from '@/components/instructor/StatsCards';
import ActivityChart from '@/components/instructor/ActivityChart';
import CoursesMiniGrid from '@/components/instructor/CoursesMiniGrid';
import { useSession } from '@/hooks/useSession';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

/**
 * Robust Instructor Dashboard wrapper:
 * - uses useSession() for basic user+loading
 * - if profile not provided by useSession, fetch `/auth/profile`
 * - performs role-based single redirect (no loops)
 * - shows a loader while checking
 */

export default function InstructorDashboard() {
  const { user, loading: sessionLoading, profile: sessionProfile } = useSession(); // may or may not include profile
  const router = useRouter();

  // local state for profile + checking flags
  const [profile, setProfile] = useState(sessionProfile ?? null);
  const [checking, setChecking] = useState(true); // true while we validate role & profile
  const [redirected, setRedirected] = useState(false); // ensure redirect runs only once

  // If sessionProfile changes (e.g. after login), sync local profile
  useEffect(() => {
    if (sessionProfile) setProfile(sessionProfile);
  }, [sessionProfile]);

  // 1) If user exists but no profile, fetch it from backend once
  useEffect(() => {
    let cancelled = false;
    async function fetchProfile() {
      try {
        // Wait for sessionLoading to finish
        if (sessionLoading) return;

        if (!user) {
          // Not logged in
          setProfile(null);
          setChecking(false);
          return;
        }

        if (profile) {
          // already have profile from session or earlier fetch
          setChecking(false);
          return;
        }

        // get access token from supabase client (if needed by backend)
        const s = await supabase.auth.getSession();
        const token = s?.data?.session?.access_token;

        // call backend /auth/profile (make sure this endpoint accepts Authorization Bearer token)
        const res = await api.get('/auth/profile', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!cancelled) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // If profile fetch fails, sign out & redirect to login to avoid stuck state
        try { await supabase.auth.signOut(); } catch (e) {}
        if (!cancelled) {
          setProfile(null);
          router.replace('/auth/login');
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
    // we intentionally depend on user & sessionLoading & profile
  }, [user, sessionLoading, profile, router]);

  // 2) Role-based single redirect (run only after profile resolved)
  useEffect(() => {
    if (checking) return;           // still checking
    if (redirected) return;         // already redirected, do nothing
    if (sessionLoading) return;     // still behind session, wait

    // not logged in -> go to login
    if (!user) {
      setRedirected(true);
      router.replace('/auth/login');
      return;
    }

    // no profile -> shouldn't happen (handled above), but guard
    if (!profile) {
      // fallback: sign out and go to login
      (async () => {
        try { await supabase.auth.signOut(); } catch(e) {}
        setRedirected(true);
        router.replace('/auth/login');
      })();
      return;
    }

    // If user is instructor -> stay here (do nothing)
    if (profile.role === 'instructor') {
      setRedirected(true); // We mark redirected so effect won't run again
      // stay on this page, no navigation
      return;
    }

    // If user has other roles -> redirect to the general dashboard (or admin/instructor accordingly)
    if (profile.role === 'admin') {
      setRedirected(true);
      router.replace('/dashboard/admin');
      return;
    }

    // default: non-instructor -> student dashboard
    setRedirected(true);
    router.replace('/dashboard');
  }, [checking, sessionLoading, user, profile, redirected, router]);

  // Show loader while checking/validating
  if (sessionLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 animate-spin" />
          <div className="text-sm text-slate-600">Checking account & profile…</div>
        </div>
      </div>
    );
  }

  // If we reach here, user is logged in and profile.role === 'instructor'
  return (
    <div className="flex bg-[#F6F8FB] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Instructor Dashboard</h1>
            <p className="text-gray-500 text-sm">Overview of your performance & course stats</p>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Row: Chart + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Graph */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <ActivityChart />
            </div>

            {/* Quick List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold">This Week Plans</h2>
              <ul className="mt-4 space-y-4 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Upload UI Design Lesson</span>
                  <span className="text-gray-400">Today</span>
                </li>
                <li className="flex justify-between">
                  <span>Record Quiz for HTML Course</span>
                  <span className="text-gray-400">Tomorrow</span>
                </li>
                <li className="flex justify-between">
                  <span>Review student progress</span>
                  <span className="text-gray-400">12 June</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Courses Preview */}
          <CoursesMiniGrid />
        </div>
      </div>
    </div>
  );
}
