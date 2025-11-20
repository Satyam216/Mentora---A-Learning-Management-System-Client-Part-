// src/app/dashboard/page.js
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import { Search } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  // local flags
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sessionUser, setSessionUser] = useState(null); // supabase.user object if any
  const [profile, setProfile] = useState(null); // backend profiles row

  // 1) Fetch courses for public view (published)
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses-for-dashboard'],
    queryFn: async () => {
      const res = await api.get('/courses'); // expects published courses
      return res.data || [];
    },
    staleTime: 1000 * 60,
  });

  // UI search/filter state
  const [q, setQ] = useState('');

  // 2) On mount: check supabase session and optionally fetch profile
  useEffect(() => {
    let mounted = true;
    async function check() {
      setCheckingAuth(true);
      try {
        // supabase-js v2: getSession()
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;

        if (!session) {
          // no logged in user — show public dashboard
          if (mounted) {
            setSessionUser(null);
            setProfile(null);
            setCheckingAuth(false);
          }
          return;
        }

        const user = session.user ?? null;
        setSessionUser(user);

        // pass token to backend to fetch profile row
        const token = session.access_token;

        // IMPORTANT: If your api instance already attaches token automatically
        // via interceptors, you can call api.get('/auth/profile') without headers.
        const res = await api.get('/auth/profile', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (res?.data) {
          if (!mounted) return;
          setProfile(res.data);

          // redirect *once* based on role
          const role = res.data.role;
          if (role === 'instructor') {
            router.replace('/dashboard/instructor');
            return;
          }else if (role === 'student'){
            router.replace('/dashboard/student');
            return;
          } else if (role === 'admin') {
            router.replace('/dashboard/admin');
            return;
          } else {
            // student -> stay at /dashboard (student UI should be this page or /dashboard/student)
            // If you created /dashboard/student page and you prefer to go there:
            // router.replace('/dashboard/student');
          }
        } else {
          // if profile not found, signout to avoid invalid session
          try { await supabase.auth.signOut(); } catch(e) {}
          setSessionUser(null);
          setProfile(null);
        }
      } catch (err) {
        // If profile fetch fails with 401 -> token expired, sign out gracefully
        console.warn('profile fetch or session check failed', err?.message || err);
        try { await supabase.auth.signOut(); } catch(e) {}
        setSessionUser(null);
        setProfile(null);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    }
    check();
    return () => { mounted = false; };
  }, [router]);

  // searching courses
  const filtered = useMemo(() => {
    if (!q) return courses;
    const qq = q.trim().toLowerCase();
    return (courses || []).filter(c =>
      (c.title || '').toLowerCase().includes(qq) ||
      (c.description || '').toLowerCase().includes(qq)
    );
  }, [courses, q]);

  // Render loader while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-amber-400 animate-spin mx-auto" />
          <div className="mt-3 text-sm text-slate-600">Checking session...</div>
        </div>
      </div>
    );
  }

  // If sessionUser && profile is present and role was 'instructor'/'admin' above we already redirected.
  // Here we are either:
  // - not logged in (sessionUser null) => show public dashboard
  // - logged in student (profile.role === 'student') => show student dashboard content (this page)
  // - OR logged in but profile fetch failed -> we signed out & fall back to public dashboard

  const isLoggedIn = !!sessionUser && !!profile;
  const isStudent = profile?.role === 'student';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLoggedIn ? `Welcome back${profile?.full_name ? `, ${profile.full_name}` : ''}` : 'Explore courses and start learning'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border rounded px-3 py-1">
              <Search size={16} className="text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses..."
                className="outline-none text-sm w-64"
              />
            </div>

            {!isLoggedIn && (
              <button onClick={() => router.push('/auth/login')} className="px-4 py-2 bg-slate-900 text-white rounded-md">Login</button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {/* If not logged in => show public hero */}
            {!isLoggedIn && (
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-2xl font-semibold">Learn from experts — anytime</h2>
                <p className="text-sm text-slate-500 mt-2">Login to track progress, attempt quizzes and purchase premium courses.</p>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => router.push('/courses')} className="px-4 py-2 bg-amber-500 text-white rounded">Browse Courses</button>
                  <button onClick={() => router.push('/auth/signup')} className="px-4 py-2 border rounded">Create account</button>
                </div>
              </div>
            )}

            {/* Student view (logged-in) or public course list */}
            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="text-lg font-semibold">{isLoggedIn && isStudent ? 'Your Courses' : 'Courses'}</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(course => (
                  <div key={course.id}>
                    <CourseCard course={course} onPlay={() => router.push(`/courses/${course.id}`)} />
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full py-8 text-center text-slate-500">No courses found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: quick profile / CTA */}
          <aside>
            <div className="bg-white rounded-2xl p-4 shadow">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                      {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-semibold">{profile?.full_name || sessionUser.email}</div>
                      <div className="text-xs text-slate-500">{profile?.role}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    <button onClick={() => router.push('/profile')} className="px-3 py-2 border rounded text-sm">Profile</button>
                    {profile?.role === 'student' && <button onClick={() => router.push('/dashboard')} className="px-3 py-2 bg-slate-900 text-white rounded text-sm">Student Dashboard</button>}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-slate-600">Not signed in</div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => router.push('/auth/login')} className="px-3 py-2 bg-slate-900 text-white rounded">Login</button>
                    <button onClick={() => router.push('/auth/signup')} className="px-3 py-2 border rounded">Sign up</button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
