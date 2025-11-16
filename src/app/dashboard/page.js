// src/app/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import Sticker from '@/components/Sticker';

export default function DashboardPage() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  const { data: courses } = useQuery({
    queryKey: ['courses-dashboard'],
    queryFn: async () => (await api.get('/courses')).data
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    // fetch profile (protected)
    if (user) {
      api.get('/auth/profile').then(res => setProfile(res.data)).catch(()=>setProfile(null));
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  const role = profile?.role || 'student';

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Welcome back, {profile?.full_name || user.email}</h1>
            <div className="text-sm text-slate-500">Role: {role}</div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="card">
              <h4 className="font-semibold">Continue learning</h4>
              <p className="text-sm text-slate-500 mt-2">Resume where you left off</p>
              <div className="mt-4 grid gap-3">
                {/* take first enrolled/purchased course as sample */}
                {courses?.slice(0,2).map(c => (
                  <div key={c.id} className="flex items-center gap-3 border rounded p-2">
                    <img src={c.thumbnail_path || '/course-default.jpg'} className="w-12 h-8 object-cover rounded" />
                    <div className="text-sm">{c.title}</div>
                    <div className="ml-auto text-xs text-slate-500">20% complete</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold">Trending courses</h4>
              <div className="mt-3 grid gap-3">
                {courses?.slice(0,3).map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold">Quick actions</h4>
              <div className="mt-3 flex flex-col gap-3">
                <button onClick={()=>router.push('/courses')} className="px-3 py-2 border rounded">Browse courses</button>
                {role === 'instructor' && <button onClick={()=>router.push('/dashboard/instructor')} className="px-3 py-2 bg-slate-900 text-white rounded">Instructor Tools</button>}
                {role === 'admin' && <button onClick={()=>router.push('/dashboard/admin')} className="px-3 py-2 bg-amber-500 text-white rounded">Admin Panel</button>}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Recommended for you</h3>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {courses?.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </div>

        <aside className="w-72 hidden lg:block">
          <Sticker src="/stickers/study1.jpg" alt="sticker" className="h-40" />
          <div className="mt-4 card">
            <h5 className="font-semibold">Profile</h5>
            <div className="text-sm mt-2">{profile?.full_name}</div>
            <div className="text-xs text-slate-500 mt-1">{profile?.role}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
